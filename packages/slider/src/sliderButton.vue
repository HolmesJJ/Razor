<template>
  <div
    class="rz-slider__button-wrapper"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="onButtonDown"
    @touchstart="onButtonDown"
    :class="{ 'hover': hovering, 'dragging': dragging, 'is-active': type === activeType }"
    :style="wrapperStyle"
    ref="button"
    tabindex="0"
    @focus="handleMouseEnter"
    @blur="handleMouseLeave"
    @keydown.left="onLeftKeyDown"
    @keydown.right="onRightKeyDown"
    @keydown.down.prevent="onLeftKeyDown"
    @keydown.up.prevent="onRightKeyDown"
  >
    <rz-tooltip
      :visible-arrow="true"
      placement="top"
      ref="tooltip"
      :effect="this.effect"
      :popper-class="tooltipClass"
      :disabled="!showTooltip"
    >
      <span slot="content">{{ formatValue }}</span>
      <div class="rz-slider__button" :class="{ 'hover': hovering, 'dragging': dragging }"></div>
    </rz-tooltip>
  </div>
</template>

<script>
import RzTooltip from "../../tooltip";

export default {
  name: "sliderButton",
  options: {
    name: "sliderButton"
  },

  components: {
    RzTooltip
  },

  props: {
    value: {
      type: Number,
      default: 0
    },
    vertical: {
      type: Boolean,
      default: false
    },
    tooltipClass: String,
    effect: {
      type: String,
      default: "light"
    },
    maxWidth: {
      type: Number,
      default: 100
    },
    minWidth: {
      type: Number,
      default: 0
    },
    type: {
      type: String
    },
    activeType: {
      type: String
    }
  },

  data() {
    return {
      hovering: false,
      dragging: false,
      isClick: false,
      startX: 0,
      currentX: 0,
      startY: 0,
      currentY: 0,
      startPosition: 0,
      newPosition: null,
      oldValue: this.value
    };
  },

  computed: {
    disabled() {
      return this.$parent.sliderDisabled;
    },

    max() {
      return this.$parent.max;
    },

    min() {
      return this.$parent.min;
    },

    step() {
      return this.$parent.step;
    },

    showTooltip() {
      return this.$parent.showTooltip;
    },

    precision() {
      return this.$parent.precision;
    },

    calibrationArr() {
      return this.$parent.calibrationArr;
    },

    iscalibrationExist() {
      return this.calibrationArr && this.calibrationArr.length;
    },

    currentPosition() {
      if (this.iscalibrationExist) {
        const half = this.calibrationArr[0];
        const mark = this.calibrationArr[1];
        const value = this.value;
        let position = ``;
        if (value < half) {
          position = (value - this.min) / ((half - this.min) / mark);
        } else {
          position = ((value - half) / (this.max - half)) * (100 - mark) + mark;
        }
        return `${position}%`;
      } else {
        return `${((this.value - this.min) / (this.max - this.min)) * 100}%`;
      }
    },

    enableFormat() {
      return this.$parent.formatTooltip instanceof Function;
    },

    formatValue() {
      return (
        (this.enableFormat && this.$parent.formatTooltip(this.value)) ||
        this.value
      );
    },

    wrapperStyle() {
      const result = this.vertical
        ? { bottom: this.currentPosition }
        : { left: this.currentPosition };

      return result;
    },

    range() {
      return this.$parent.range;
    }
  },

  watch: {
    dragging(val) {
      this.$parent.dragging = val;
    },
    wrapperStyle(val) {
      this.$emit("position-change", val);
    }
  },

  methods: {
    displayTooltip() {
      this.$refs.tooltip && (this.$refs.tooltip.showPopper = true);
    },

    hideTooltip() {
      this.$refs.tooltip && (this.$refs.tooltip.showPopper = false);
    },

    handleMouseEnter() {
      this.hovering = true;
      this.displayTooltip();
    },

    handleMouseLeave() {
      this.hovering = false;
      this.hideTooltip();
    },

    onButtonDown(event) {
      if (this.disabled) return;
      event.preventDefault();
      this.onDragStart(event);
      window.addEventListener("mousemove", this.onDragging);
      window.addEventListener("touchmove", this.onDragging);
      window.addEventListener("mouseup", this.onDragEnd);
      window.addEventListener("touchend", this.onDragEnd);
      window.addEventListener("contextmenu", this.onDragEnd);
    },
    onLeftKeyDown() {
      if (this.disabled) return;
      this.newPosition =
        parseFloat(this.currentPosition) -
        (this.step / (this.max - this.min)) * 100;
      this.setPosition(this.newPosition);
    },
    onRightKeyDown() {
      if (this.disabled) return;
      this.newPosition =
        parseFloat(this.currentPosition) +
        (this.step / (this.max - this.min)) * 100;
      this.setPosition(this.newPosition);
    },
    onDragStart(event) {
      this.dragging = true;
      this.isClick = true;
      if (event.type === "touchstart") {
        event.clientY = event.touches[0].clientY;
        event.clientX = event.touches[0].clientX;
      }
      if (this.vertical) {
        this.startY = event.clientY;
      } else {
        this.startX = event.clientX;
      }
      this.startPosition = parseFloat(this.currentPosition);
      this.newPosition = this.startPosition;
    },

    onDragging(event) {
      if (this.dragging) {
        this.isClick = false;
        this.displayTooltip();
        this.$parent.resetSize();
        let diff = 0;
        if (event.type === "touchmove") {
          event.clientY = event.touches[0].clientY;
          event.clientX = event.touches[0].clientX;
        }
        if (this.vertical) {
          this.currentY = event.clientY;
          diff =
            ((this.startY - this.currentY) / this.$parent.sliderSize) * 100;
        } else {
          this.currentX = event.clientX;
          diff =
            ((this.currentX - this.startX) / this.$parent.sliderSize) * 100;
        }
        this.newPosition = this.startPosition + diff;
        this.setPosition(this.newPosition);
      }
    },

    onDragEnd() {
      if (this.dragging) {
        /*
         * 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
         * 不使用 preventDefault 是因为 mouseup 和 click 没有注册在同一个 DOM 上
         */
        setTimeout(() => {
          this.dragging = false;
          this.hideTooltip();
          if (!this.isClick) {
            this.setPosition(this.newPosition);
            this.$parent.emitChange();
          }
        }, 0);
        window.removeEventListener("mousemove", this.onDragging);
        window.removeEventListener("touchmove", this.onDragging);
        window.removeEventListener("mouseup", this.onDragEnd);
        window.removeEventListener("touchend", this.onDragEnd);
        window.removeEventListener("contextmenu", this.onDragEnd);
      }
    },

    setPosition(newPosition) {
      if (newPosition > this.maxWidth && this.range) {
        this.$nextTick(() => {
          this.$emit("active-change", "tail");
        });
        return;

        // return;
      }

      if (newPosition < this.minWidth && this.range) {
        this.$nextTick(() => {
          this.$emit("active-change", "head");
        });
        return;
      }
      // if (newPosition >= this.maxWidth || newPosition <= this.minWidth) {
      //   return;
      // }

      if (newPosition === null || isNaN(newPosition)) return;
      if (newPosition < 0) {
        newPosition = 0;
      } else if (newPosition > 100) {
        newPosition = 100;
      }
      let value = 0;
      if (this.iscalibrationExist) {
        const half = this.calibrationArr[0];
        const mark = this.calibrationArr[1];
        if (newPosition < mark) {
          value = newPosition * ((half - this.min) / mark) + this.min;
          value = parseFloat(value.toFixed(this.precision));
        } else {
          value =
            half + ((newPosition - mark) / (100 - mark)) * (this.max - half);
          value = parseFloat(value.toFixed(this.precision));
        }
      } else {
        const lengthPerStep = 100 / ((this.max - this.min) / this.step);
        const steps = Math.round(newPosition / lengthPerStep);
        value = steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min;
        value = parseFloat(value.toFixed(this.precision));
      }

      this.$emit("input", value);
      this.$nextTick(() => {
        this.$refs.tooltip && this.$refs.tooltip.updatePopper();
      });
      if (!this.dragging && this.value !== this.oldValue) {
        this.oldValue = this.value;
      }
    }
  }
};
</script>
