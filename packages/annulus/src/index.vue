<template>
  <transition name="fade" @after-enter="afterEnter" @before-leave="beforeLeave">
    <div
      :class="['rz-annulus', {'is-after-enter': isAfterEnter}]"
      :style="svgStyle"
      v-show="visible"
    >
      <svg
        :class="['svg-box', ]"
        :style="svgStyle"
        @mouseenter="$emit('enter')"
        @mouseleave="$emit('leave')"
      >
        <template v-for="(item, index) in listData">
          <g
            :key="index"
            :ref="'group' + index"
            :class="['group-wrap', {'is-animation': item.animation, 'is-reverse': item.reverse, 'just-show': item.justShow}]"
            @mouseenter="handleGroupHover(item, index, true)"
            @mouseleave="handleGroupHover(item, index, false)"
          >
            <defs>
              <linearGradient
                :id="'linear-gradient' + index"
                spreadMethod="pad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  :style="{'stop-color': item.startColor || 'rgba(153,111,232,1)', 'stop-opacity': 1}"
                />
                <stop
                  offset="100%"
                  :style="{'stop-color': item.endColor || 'rgba(36,200,242,1)', 'stop-opacity': 1}"
                />
              </linearGradient>

            </defs>
            <circle
              :r="item.size ? item.size / 2 : 0"
              cx="50%"
              cy="50%"
              fill="none"
              stroke="rgba(255, 255, 255, 0)"
              :stroke-width="item.strokeWidth"
              :style="filterEmptyCircleStyle(item)"
              class="circular-bg-path"
            />
            <template v-for="(list, childIndex) in item.options">
              <circle
                :key="childIndex"
                :r="item.size ? item.size / 2 : 0"
                cx="50%"
                cy="50%"
                fill="none"
                :stroke-width="item.strokeWidth"
                :class="['circular-bg-path', {'is-hover': list.identifier === hoverActiveIdentifier, 'is-active': list.identifier === activeIdentifier}]"
                :style="circularPathStyle(index, childIndex)"
                @mouseenter="handleCircleHover(list, true)"
                @mouseleave="handleCircleHover(list, false)"
                @click="handleCircleClick(list, item)"
              />
            </template>
          </g>
        </template>
      </svg>
      <div class="pos-cen rz-annulus__slot">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Annulus",

  options: {
    name: "Annulus"
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    configs: {
      type: Array,
      default() {
        return [];
      }
    },

    size: {
      type: Number,
      default: 500
    },

    // 运动方向
    reverse: {
      type: Boolean,
      default: false
    },

    activeIdentifier: {
      type: [String, Number],
      default: 0
    }
  },

  data() {
    return {
      total: 0,
      listData: [],
      isAfterEnter: false,
      svgStyle: {
        width: this.size + "px",
        height: this.size + "px"
      },

      hoverActiveIdentifier: 0,
      hoverParentActiveIdentifier: 0,
      activatedId: 16,
    };
  },

  watch: {
    configs: {
      handler() {
        this.initData();
      },
      deep: true
    },
    activeIdentifier(value) {
      this.filterCircleSize();
    }
  },

  computed: {
    
  },

  mounted() {
    this.initData();
  },

  methods: {
    // 初始化数据
    initData() {
      this.listData = [];
      let copyData = JSON.parse(JSON.stringify(this.configs));
      copyData.forEach((row, index) => {
        let total = 0;
        let identifierList = [];
        if (row.options) {
          row.options.forEach(list => {
            total += parseFloat(list.value);
            identifierList.push(list.identifier);
          });
        }
        row.originalSize = row.size;
        row.identifierList = identifierList;
        row.total = total;
        this.listData.push(row);
      });
    },

    // 计算圆大小
    filterCircleSize() {
      setTimeout(() => {
        let filterIndex = this.listData.findIndex(
          row =>
            row.identifier === this.hoverParentActiveIdentifier ||
            row.identifierList.indexOf(this.activeIdentifier) !== -1
        );
        this.listData.forEach((row, idx) => {
          if (row.linkage) {
            // 是否需要联动
            if (!this.activeIdentifier && !this.hoverParentActiveIdentifier) {
              row.size = row.originalSize;
            } else {
              if (idx === filterIndex) {
                row.size = row.originalSize + 45 - 17 - 10;
              } else {
                if (filterIndex > 0 && idx < 2) {
                  row.size = row.originalSize - 17;
                } else {
                  row.size = row.originalSize + 45;
                }
              }
            }
          }
        });
      }, 0);
    },

    // 圆鼠标移入移出
    handleGroupHover(item, index, status = true) {
      this.hoverParentActiveIdentifier = status ? item.identifier : 0;
      if(index === this.listData.length - 1){
        this.$emit("update:activeIdentifier", this.activatedId);
      }
    },

    // 计算每段圆环偏移量
    filterDashoffset(index, parent) {
      let count = 0;
      parent.options.forEach((row, idx) => {
        if (idx < index) {
          let len =
            parent.options && parent.options.length > 1
              ? parent.options.length
              : 0;
          count +=
            (row.value / parent.total) *
            (parent.size * Math.PI - len * parent.space);
        }
      });
      count += index * parent.space;
      return -count;
    },

    // 计算每段圆环偏长度，最小值1
    getArcLength(value, parent) {
      let len =
        parent.options && parent.options.length > 1 ? parent.options.length : 0;
      let res =
        (value / parent.total) * (parent.size * Math.PI - len * parent.space);
      return res < 1 ? 1 : res;
    },

    /**
     * 鼠标移入移出事件
     */
    handleCircleHover(list, status = true) {
      this.hoverActiveIdentifier = status ? list.identifier : 0;
      if (!this.activeIdentifier) this.filterCircleSize();
      let filterRes = list.identifier;
      this.$emit("update:activeIdentifier", filterRes);
    },

    // 每段圆弧点击
    handleCircleClick(list, item) {
      let filterRes = list.identifier;
      this.activatedId = filterRes;
      this.$emit("update:activeIdentifier", filterRes);
      this.$emit("change", list, item);
    },

    // 空圆环样式，为了hover到每段圆环间距可以放大效果
    filterEmptyCircleStyle(item) {
      return {
        "stroke-width":
          (this.hoverParentActiveIdentifier === item.identifier &&
            !this.activeIdentifier) ||
          item.identifierList.indexOf(this.activeIdentifier) !== -1
            ? item.hoverStyle && item.hoverStyle.strokeWidth
            : item.strokeWidth
      };
    },

    // transition进入状态
    afterEnter(el) {
      this.isAfterEnter = true;
    },

    // transition离开状态
    beforeLeave(el) {
      this.isAfterEnter = false;
    },

    leaveSvg(){
      this.$emit('leave'); 
      this.$emit("update:activeIdentifier", this.activatedId)
    },

    /**
     * 圆形样式
     */
    circularPathStyle(index, childIndex) {
      let item = this.listData[index];
      let list = item.options[childIndex];
      let linearGradient = "url(#linear-gradient" + index + ")";

      // 初始化样式
      let strokeColor = item.stroke || linearGradient;
      let strokeWidth = item.strokeWidth;

      // 高亮
      let isCurrentCircle =
        item.identifierList.indexOf(this.activeIdentifier) !== -1;
      if (
        ((this.activeIdentifier && isCurrentCircle) ||
          item.identifier === this.hoverParentActiveIdentifier) &&
        item.hoverStyle
      ) {
        if (
          this.activeIdentifier === list.identifier ||
          this.hoverActiveIdentifier === list.identifier
        ) {
          strokeColor = item.hoverStyle.stroke;
        }
        if (
          isCurrentCircle ||
          (item.identifier === this.hoverParentActiveIdentifier &&
            !this.activeIdentifier)
        )
          strokeWidth = item.hoverStyle.strokeWidth;
      }
      return {
        stroke: strokeColor,
        "stroke-width": strokeWidth,
        "stroke-dashoffset": this.filterDashoffset(childIndex, item),
        "stroke-dasharray": `${this.getArcLength(
          list.value,
          item
        )}, ${Math.PI * item.size}`
      };
    }
  }
};
</script>
