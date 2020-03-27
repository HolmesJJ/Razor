import TweenLite, { Linear } from 'gsap/TweenLite';
import {Circ, Sine} from 'gsap/EasePack';
export default {
  name: "Annulus",
  options: {
    name: "Annulus",
  },
  props: {
    configs: {
      type: Array,
      default() {
        return [];
      },
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 500,
    },
    // 高亮标识符
    activeIndex: [String, Number],
    activeData: {
      type: Object,
      default() {
        return {};
      },
    },
    duration: {
      type: Number,
      default: 0.8,
    },
    activeStroke: {
      type: String,
      default: "rgb(25, 205, 254)",
    },
    activeStrokeWidth: {
      type: Number,
      default: 45,
    },
    filterEmptyValue: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      configList: [],
      tweenLites: [],
      hoverActiveIndex: "",
      hoverItemIndex: "",
      clickItemIndex: "",
      isEmitComplete: false,
      isInit: false,
    }
  },
  watch: {
    visible(val) {
      if (!val) {
        this.$emit("beforeLeave");
        // 离开动画
        this.hoverActiveIndex = "";
        this.hoverItemIndex = "";
        this.clickItemIndex = "";
        this.$emit("update:activeIndex", "");
        this.handleStop();
        this.configList.map((item, index) => {
          TweenLite.to(item, this.duration, { rotate: index % 2 === 0 ? item.rotate - 105 : item.rotate + 150, ease: Sine.easeOut, });
          item.options.map((list) => {
            TweenLite.to(list, this.duration, { opacity: 0, ease: Circ.easeOut }).delay(.1);
          })
        });
        setTimeout(() => {
          this.$emit("afterLeave");
        }, this.duration * 1000);
      } else {
        this.isInit = true;
        this.initData();
      }
    },
    configs: {
      handler() {
        if (this.isInit) {
          this.isInit = false;
          return;
        }
        // 数据更新只改变value及计算total值，避免重新初始化所有元素动画闪烁
        this.configs.map((row, index) => {
          if (!this.configList[index]) return;
          let total = 0;
          row.options.map((rowOpts) => {
            if (rowOpts.value > 0) total += parseFloat(rowOpts.value);
            this.configList[index].options.map((list) => {
              if (rowOpts.activeIndex === list.activeIndex) {
                list.value = rowOpts.value;
              }
            })
          })
          this.configList[index].total = total;
        })
        this.updateSize();
      },
      deep: true,
    },
    activeIndex(val) {
      this.configList.map((row, index) => {
        row.options.map((list) => {
          if (list.activeIndex === val) this.clickItemIndex = index;
        })
      })
      this.updateSize();
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      if (!this.visible) return;
      this.isEmitComplete = false;
      this.tweenLites = [];
      this.configList = [];
      // 初始化追加样式属性
      let copyData = JSON.parse(JSON.stringify(this.configs));
      copyData.map((item, index) => {
        item.originalSize = item.size;
        item.originalStrokeWidth = item.strokeWidth;
        item.rotate = index % 2 === 0 ? -105 : 150;
        if (item.options && item.options.length) {
          let total = 0;
          item.identifierList = [];
          item.options.map((list, childIndex) => {
            list.opacity = 1;
            if (list.value > 0) total += parseFloat(list.value);
            // 根据传参是否过滤空数据
            if (this.filterEmptyValue && (list.value <= 0 || !list.value)) return;
            item.identifierList.push(list.activeIndex);
          });
          item.total = total;
          this.configList.push(item);
        }
        item.strokeWidth = item.strokeWidth || 10;
      });
      this.updateSize();
      this.animation();
    },
    animation() {
      this.configList.map((item, index) => {
        if (item.animation === false) return;
        const curTweenLite = TweenLite.to(item, this.duration, { rotate: 0, ease: Sine.easeOut, onComplete: () => {
          this.animationInfinite(item, index);
          if (this.isEmitComplete) return;
          this.$emit("complete");
          this.isEmitComplete = true;
        } });
        item.options.map((list) => {
          TweenLite.to(list, this.duration / 2, { opacity: 1, ease: Circ.easeIn, onComplete: () => {
            TweenLite.to(list, this.duration / 2, { opacity: .5, ease: Sine.easeOut }).delay(this.duration / 2 - 0.1);
          } });
        });
        this.tweenLites.push(curTweenLite);
      });
    },
    // 循环动画
    animationInfinite(item, index) {
      this.tweenLites[index] = TweenLite.to(item, 35, { rotate: index % 2 === 0 ? 360 : -360, ease: Linear.easeNone, onComplete: () => {
        this.tweenLites[index].restart();
        this.tweenLites[index].play();
      } });
    },
    renderSvg(h) {
      return h("svg", {
        ref: "svg",
        staticClass: "rz-annulus",
        props: {},
        style: {
          width: this.size + 'px',
          height: this.size + 'px',
          zIndex: 10,
        },
        // v-show
        directives:[{
          name: "show",
          value: this.visible
        }],
        on: {
          mouseenter: this.svgEnter,
          mouseleave: this.svgLeave,
        },
      }, [this.renderGroup(h)]);
    },
    handleStop() {
      this.tweenLites.map(obj => {
        obj.pause();
      })
    },
    svgEnter() {
      if (!this.isEmitComplete) return;
      this.handleStop();
      this.$emit("svg-enter");
    },
    svgLeave() {
      this.$emit("svg-leave");
      this.tweenLites.map(obj => {
        obj.play();
      })
      this.hoverActiveIndex = "";
      this.hoverItemIndex = "";
      this.updateSize();
    },
    renderGroup(h) {
      const groupEle = this.configList.map((item, index) => {
        if (item.options && !item.options.length) return;
        return h("g", {
          staticClass: "svg-group",
          props: {
            key: "svg-group" + index,
          },
          attrs: {
            transform: `rotate(${item.rotate} ${this.size / 2} ${this.size / 2})`,
          },
          on: {
            mouseenter: () => this.hoverItemIndex = index,
            mouseleave: () => this.updateSize(),
          }
        }, [
          this.renderDefs(h, index, item),
          this.renderCircle(h, index, item),
        ])
      });
      return groupEle;
    },
    renderDefs(h, index) {
      return h("defs", {}, [this.renderLinearGradient(h, index)]);
    },
    renderLinearGradient(h, index) {
      return h("linearGradient", {
        attrs: {
          id: "linearGradient",
          spreadMethod: "pad",
          x1: "0%",
          y1: "0%",
          x2: "100%",
          y2: "0%",
        },
      }, [
        this.renderLinearGradientStop(h, {
          opacity: 0,
        }),
        this.renderLinearGradientStop(h, {
          offset: "100%",
          color: "rgba(36,200,242,1)",
        }),
      ]);
    },
    renderLinearGradientStop(h, params) {
      return h("stop", {
        attrs: {
          offset: params.offset || 0,
        },
        style: {
          "stop-color": params.color || "rgba(153,111,232,1)",
          "stop-opacity": params.opacity || 1,
        },
      }, null);
    },
    renderCircle(h, index, item) {
      return item.options.map((list, idx) => {
        return h("circle", {
          staticClass: "circular-bg-path",
          attrs: {
            cx: "50%",
            cy: "50%",
            r: item.size / 2,
          },
          style: this.circularPathStyle(item, list, idx),
          on: {
            mouseenter: () => this.childCircleEnter(item, list, index),
            mouseleave: () => this.childCircleLeave(item, list, index),
            click: () => this.circleClick(item, list, index),
          },
        }, null);
      })
    },
    /**
     * 圆形样式
     */
    circularPathStyle(item, list, index) {
      let filterStroke = list.activeStroke || item.stroke || list.stroke || "url(#linearGradient)";
      return {
        zIndex: 5,
        opacity: list.opacity,
        cursor: "pointer",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: "auto",
        cx: "50%",
        cy: "50%",
        fill: "none",
        r: item.size / 2,
        stroke: filterStroke,
        strokeWidth: item.strokeWidth,
        strokeDashoffset: list.strokeDashoffset,
        strokeDasharray: list.strokeDasharray,
      };
    },
    childCircleEnter(item, list, index) {
      if (this.isEmitComplete) this.handleStop();
      this.$emit("circle-enter", item, list, index);
      this.hoverActiveIndex = list.activeIndex;
      list.activeStroke = this.activeStroke,
      TweenLite.to(list, this.duration / 2, { opacity: 1 });
      this.hoverItemIndex = index;
      this.updateSize();
    },
    childCircleLeave(item, list, index) {
      this.$emit("circle-leave", item, list, index);
      TweenLite.to(list, this.duration / 2, { opacity: .5 });
      list.activeStroke = "";
    },
    circleClick(item, list, index) {
      this.$emit("update:activeIndex", list.activeIndex);
      this.$emit("change", list, item, index);
      this.clickItemIndex = index;
    },
    // 更新元素动画
    updateSize() {
      this.configList.map((item, index) => {
        let filterSize = 0;
        let filterExtraSize = 0;
        const filterActiveIndex = this.hoverActiveIndex || (this.filterEmptyValue && this.activeData.value && this.activeIndex || this.activeIndex) || "";
        const isCurrent = item.identifierList.includes(filterActiveIndex);
        const itemIndex = this.hoverItemIndex !== "" ? this.hoverItemIndex : this.clickItemIndex;
        if (!filterActiveIndex) {
          filterSize = item.originalSize;
        } else {
          if (isCurrent) {
            filterExtraSize = this.activeStrokeWidth - 27;
          } else {
            if (index < itemIndex) {
              filterExtraSize = -15;
            } else {
              filterExtraSize = index > itemIndex && this.activeStrokeWidth;
            }
          }
        }
        // 计算每个环的size
        filterSize = item.originalSize + filterExtraSize;
        TweenLite.to(item, this.duration / 2, { size: filterSize, strokeWidth: isCurrent ? this.activeStrokeWidth : item.originalStrokeWidth, });
        
        let strokeDasharrayCount = 0;
        item.options.map((list, childIndex) => {
          if (list.activeIndex === filterActiveIndex) {
            list.activeStroke = this.activeStroke;
            TweenLite.to(list, this.duration / 2, { opacity: 1 });
          } else {
            TweenLite.to(list, this.duration / 2, { opacity: .5 });
            list.activeStroke = "";
          }
          const curStrokeDasharray = this.filterStrokeDasharray(item, list, filterSize);
          const filterLen = this.findEffectiveLength(item);
          let startStrokeDasharray = filterLen === 0 ? 0 : filterLen === 1 && list.value > 0 ? Math.PI * filterSize : curStrokeDasharray;
          TweenLite.to(list, this.duration / 2, {
            strokeDasharray: `${ startStrokeDasharray < 1 && startStrokeDasharray > 0 ? 1 : startStrokeDasharray }, ${Math.PI * filterSize}`,
            strokeDashoffset: childIndex === 0 || this.findEffectiveLength(item) <= 1 ? 0 : -strokeDasharrayCount,
          });
          if (list.value > 0) {
            strokeDasharrayCount += (parseFloat(curStrokeDasharray) + item.space);
          }
        });
      })
    },
    filterStrokeDasharray(item, list, filterSize) {
      return list.value / item.total * (Math.PI * filterSize - this.findEffectiveLength(item) * (item.space || 0));
    },
    // 过滤options列表value大于0的值
    findEffectiveLength(item) {
      let effectiveList = item.options.filter((list) => list.value > 0);
      return effectiveList.length;
    },
  },
  render(h) {
    return h("transition", {
      name: "fade",
      props: {
        name: "fade",
        duration: this.duration * 1000,
      },
      attrs: {
        name: "fade",
      }
    }, [this.renderSvg(h)]);
  }
}
