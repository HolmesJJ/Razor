<template>
  <div
    class="rz-slider"
    :class="{ 
      'is-vertical': vertical, 
      'rz-slider--with-input': showInput,
      'is-toRight': direction === 'toRight',
      'is-range': range,
      'is-hover': isHover
     }"
    role="slider"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-orientation="vertical ? 'vertical': 'horizontal'"
    :aria-disabled="sliderDisabled"
    @mouseover="handleMouseover"
    @mouseout="handleMouseout"
  >
    <div v-if="showInput && !range" class="rz-slider__input-box">
      <rz-input-number
        key="inputNumber"
        v-model="firstValue"
        class="rz-slider__input"
        ref="input"
        @change="$nextTick(emitChange)"
        :step="step"
        :step-strictly="stepStrictly"
        :disabled="sliderDisabled"
        :controls="showInputControls"
        :min="min"
        :max="max"
        :debounce="debounce"
        :size="inputSize"
        :unit="unit"
      ></rz-input-number>
    </div>
    <div
      class="rz-slider__runway"
      :class="{ 'show-input': showInput, 'disabled': sliderDisabled }"
      :style="runwayStyle"
      @click="onSliderClick"
      ref="slider"
    >
      <div class="rz-slider__bar" :style="barStyle" :class="{'is-range': range}"></div>
      <slider-button
        type="head"
        :activeType="currentActive"
        :maxWidth="rangeHeadMax"
        :vertical="vertical"
        v-model="firstValue"
        :tooltip-class="_tooltipClassName"
        ref="button1"
        @position-change="handleHeadPositionChange"
        @active-change="handleActiveChange"
      ></slider-button>
      <slider-button
        type="tail"
        :activeType="currentActive"
        v-if="range"
        :minWidth="rangeTailMin"
        :vertical="vertical"
        v-model="secondValue"
        :tooltip-class="_tooltipClassName"
        ref="button2"
        @position-change="handleTailPositionChange"
        @active-change="handleActiveChange"
      ></slider-button>
      <div
        class="rz-slider__range-tail"
        :class="{'is-vertical': this.vertical}"
        v-if="range"
        :style="rangeTailStyle"
      ></div>
      <div
        class="rz-slider__stop"
        v-for="(item, key) in stops"
        :key="key"
        :style="vertical ? { 'bottom': item + '%' } : { 'left': item + '%' }"
      ></div>
      <div
        class="rz-slider__calibration"
        :class="{'is-end': (item.value === max)}"
        v-show="item.position !== 0"
        v-for="(item, key) in calibrationArrStops"
        :key="key + 'calibration'"
        :style="vertical ? { 'bottom': item.position + '%' } : { 'left': item.position + '%' }"
      >
        <span v-show="!!item.value">{{item.value}}</span>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
import RzInputNumber from "pkg/inputNumber";
import sliderButton from "./sliderButton.vue";
import emitter from "rz/mixins/emitter";

export default {
  options: {
    name: "Slider"
  },

  mixins: [emitter],

  inject: {
    Form: {
      default: ""
    }
  },

  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    value: {
      type: [Number, Array],
      default: 0
    },
    showInput: {
      type: Boolean,
      default: false
    },
    stepStrictly: Boolean,
    showInputControls: {
      type: Boolean,
      default: false
    },
    inputSize: {
      type: String,
      default: "small"
    },
    showStops: {
      type: Boolean,
      default: false
    },
    showTooltip: {
      type: Boolean,
      default: true
    },
    formatTooltip: Function,
    disabled: {
      type: Boolean,
      default: false
    },
    range: {
      type: Boolean,
      default: false
    },
    vertical: {
      type: Boolean,
      default: false
    },
    showBorder: {
      type: Boolean,
      default: false
    },
    height: {
      type: String
    },
    debounce: {
      type: Number,
      default: 300
    },
    label: {
      type: String
    },
    tooltipClass: {
      type: String,
      default: ""
    },
    effect: {
      type: String,
      default: "light"
    },
    unit: {
      type: String,
      default: "%"
    },
    customRunwayStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    direction: {
      type: String,
      default: "toLeft"
    },
    calibrationArr: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  components: {
    RzInputNumber,
    sliderButton
  },

  data() {
    return {
      firstValue: null,
      secondValue: null,
      oldValue: null,
      dragging: false,
      sliderSize: 1,
      rangeTailWidth: 0,
      rangeHeadMax: 100,
      rangeTailMin: 0,
      currentActive: "",
      isHover: false
    };
  },

  watch: {
    value(val, oldVal) {
      if (
        this.dragging ||
        (Array.isArray(val) &&
          Array.isArray(oldVal) &&
          val.every((item, index) => item === oldVal[index]))
      ) {
        return;
      }
      this.setValues();
    },

    dragging(val) {
      if (!val) {
        this.setValues();
      }
    },

    firstValue(val) {
      if (this.range) {
        this.$emit("input", [this.minValue, this.maxValue]);
      } else {
        this.$emit("input", val);
      }
    },

    secondValue() {
      if (this.range) {
        this.$emit("input", [this.minValue, this.maxValue]);
      }
    },

    min() {
      this.setValues();
    },

    max() {
      this.setValues();
    },
    range(val) {
      if (!val) {
        this.rangeHeadMax = 100;
        this.rangeTailMin = 0;
      } else {
        this.$nextTick(() => {
          this.handleTailPositionChange(this.$refs.button2.wrapperStyle);
        });
      }
    }
  },

  methods: {
    valueChanged() {
      if (this.range) {
        return ![this.minValue, this.maxValue].every(
          (item, index) => item === this.oldValue[index]
        );
      } else {
        return this.value !== this.oldValue;
      }
    },
    setValues() {
      if (this.min > this.max) {
        console.error(
          "[Razor Error][Slider]min should not be greater than max."
        );
        return;
      }
      const val = this.value;
      if (this.range && Array.isArray(val)) {
        if (val[1] < this.min) {
          this.$emit("input", [this.min, this.min]);
        } else if (val[0] > this.max) {
          this.$emit("input", [this.max, this.max]);
        } else if (val[0] < this.min) {
          this.$emit("input", [this.min, val[1]]);
        } else if (val[1] > this.max) {
          this.$emit("input", [val[0], this.max]);
        } else {
          this.firstValue = val[0];
          this.secondValue = val[1];
          if (this.valueChanged()) {
            this.dispatch("FormItem", "el.form.change", [
              this.minValue,
              this.maxValue
            ]);
            this.oldValue = val.slice();
          }
        }
      } else if (!this.range && typeof val === "number" && !isNaN(val)) {
        if (val < this.min) {
          this.$emit("input", this.min);
        } else if (val > this.max) {
          this.$emit("input", this.max);
        } else {
          this.firstValue = val;
          if (this.valueChanged()) {
            this.dispatch("FormItem", "el.form.change", val);
            this.oldValue = val;
          }
        }
      }
    },

    setPosition(percent) {
      const targetValue = this.min + (percent * (this.max - this.min)) / 100;
      if (!this.range) {
        this.$refs.button1.setPosition(percent);
        return;
      }
      let button;
      if (
        Math.abs(this.minValue - targetValue) <
        Math.abs(this.maxValue - targetValue)
      ) {
        button = this.firstValue < this.secondValue ? "button1" : "button2";
      } else {
        button = this.firstValue > this.secondValue ? "button1" : "button2";
      }
      this.$refs[button].setPosition(percent);
    },

    onSliderClick(event) {
      if (this.sliderDisabled || this.dragging) return;
      this.resetSize();
      if (this.vertical) {
        const sliderOffsetBottom = this.$refs.slider.getBoundingClientRect()
          .bottom;
        this.setPosition(
          ((sliderOffsetBottom - event.clientY) / this.sliderSize) * 100
        );
      } else {
        const sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left;
        this.setPosition(
          ((event.clientX - sliderOffsetLeft) / this.sliderSize) * 100
        );
      }
      this.emitChange();
    },

    resetSize() {
      if (this.$refs.slider) {
        this.sliderSize = this.$refs.slider[
          `client${this.vertical ? "Height" : "Width"}`
        ];
      }
    },

    emitChange() {
      this.$nextTick(() => {
        this.$emit(
          "change",
          this.range ? [this.minValue, this.maxValue] : this.value
        );
      });
    },

    handleMouseover() {
      this.isHover = true;
    },
    handleMouseout() {
      this.isHover = false;
    },
    handleHeadPositionChange(val) {
      let value;
      if (this.vertical) {
        value = val.bottom;
      } else {
        value = val.left;
      }
      this.rangeTailMin = parseFloat(value);
    },

    handleTailPositionChange(val) {
      let value;
      if (this.vertical) {
        value = val.bottom;
      } else {
        value = val.left;
      }

      this.rangeHeadMax = parseFloat(value);
      this.rangeTailWidth = 100 - parseFloat(value);
    },

    handleActiveChange(val) {
      this.currentActive = val;
    }
  },

  computed: {
    calibrationArrStops() {
      if (!this.calibrationArr || !this.calibrationArr.length) {
        return [];
      }
      const mark = this.calibrationArr[1];
      const half = this.calibrationArr[0];
      const arr = [
        {
          position: mark,
          value: half
        }
      ];
      const count = 5;
      const minGap = mark / count;
      const maxGap = (100 - mark) / count;
      const min = this.min;

      for (let i = 1; i <= count; i++) {
        const itemLeftValue = ((half - min) / count) * (count - i) + min;
        const itemRightValue = ((this.max - half) / count) * i + half;
        const leftValue = parseFloat(itemLeftValue.toFixed(this.precision));
        const rightValue = parseFloat(itemRightValue.toFixed(this.precision));

        const itemLeft = {
          position: (count - i) * minGap,
          value: (count - i) % 2 ? leftValue : 0
        };

        const itemRight = {
          position: mark + i * maxGap,
          value: rightValue
        };

        arr.unshift(itemLeft);
        arr.push(itemRight);
      }
      return arr;
    },
    stops() {
      if (!this.showStops || this.min > this.max || this.iscalibrationExist) {
        return [];
      }
      if (this.step === 0) {
        process.env.NODE_ENV !== "production" &&
          console.warn("[Razor Warn][Slider]step should not be 0.");
        return [];
      }
      const stopCount = (this.max - this.min) / this.step;
      const stepWidth = (100 * this.step) / (this.max - this.min);
      const result = [];
      for (let i = 1; i < stopCount; i++) {
        result.push(i * stepWidth);
      }
      if (this.range) {
        return result.filter(step => {
          return (
            step < (100 * (this.minValue - this.min)) / (this.max - this.min) ||
            step > (100 * (this.maxValue - this.min)) / (this.max - this.min)
          );
        });
      } else {
        return result.filter(
          step =>
            step > (100 * (this.firstValue - this.min)) / (this.max - this.min)
        );
      }
    },

    minValue() {
      return Math.min(this.firstValue, this.secondValue);
    },

    maxValue() {
      return Math.max(this.firstValue, this.secondValue);
    },

    iscalibrationExist() {
      if (
        this.calibrationArr[0] < this.min ||
        this.calibrationArr[0] > this.max
      ) {
        throw new Error(
          "[Razor] [Error] 刻度中位值不能大于最大值或小于最小值 | calibrationArr[0] < min || calibrationArr[0] > max"
        );
      }
      return this.calibrationArr && this.calibrationArr.length;
    },

    barSize() {
      if (this.iscalibrationExist && !this.range) {
        const half = this.calibrationArr[0];
        const mark = this.calibrationArr[1];
        const value = this.value;
        let size = ``;

        if (value < half) {
          size = (value - this.min) / ((half - this.min) / mark);
        } else {
          size = ((value - half) / (this.max - half)) * (100 - mark) + mark;
        }

        return `${size}%`;
      } else if (this.range) {
        if (this.iscalibrationExist) {
          const half = this.calibrationArr[0];
          const mark = this.calibrationArr[1];
          let size;
          let left;
          let right;

          if (this.minValue <= half && this.maxValue >= half) {
            left = mark * ((half - this.minValue) / (half - this.min));
            right = (100 - mark) * ((this.maxValue - half) / (this.max - half));
            size = `${left + right}%`;
          } else if (this.minValue < half && this.maxValue < half) {
            left = mark * ((half - this.minValue) / (half - this.min));
            right = mark * ((half - this.maxValue) / (half - this.min));
            size = `${left - right}%`;
          } else {
            left = (100 - mark) * ((this.minValue - half) / (this.max - half));
            right = (100 - mark) * ((this.maxValue - half) / (this.max - half));
            size = `${right - left}%`;
          }
          return size;
        }
        return `${(100 * (this.maxValue - this.minValue)) /
          (this.max - this.min)}%`;
      } else {
        return `${(100 * (this.firstValue - this.min)) /
          (this.max - this.min)}%`;
      }
    },

    barStart() {
      if (this.iscalibrationExist && this.range) {
        const half = this.calibrationArr[0];
        const mark = this.calibrationArr[1];
        const value = this.minValue;
        let position = ``;

        if (value < half) {
          position = (value - this.min) / ((half - this.min) / mark);
        } else {
          position = ((value - half) / (this.max - half)) * (100 - mark) + mark;
        }

        return `${position}%`;
      }

      return this.range
        ? `${(100 * (this.minValue - this.min)) / (this.max - this.min)}%`
        : "0%";
    },

    precision() {
      let precisions = [this.min, this.max, this.step].map(item => {
        let decimal = ("" + item).split(".")[1];
        return decimal ? decimal.length : 0;
      });
      return Math.max.apply(null, precisions);
    },

    runwayStyle() {
      const style = { ...this.customRunwayStyle };
      if (this.vertical) {
        style.height = this.height;
      }
      return style;
    },

    barStyle() {
      const vertical = {
        height: this.barSize,
        bottom: this.barStart
      };
      const horizontal = {
        width: this.barSize,
        left: this.barStart
      };
      return this.vertical ? vertical : horizontal;
    },

    rangeTailStyle() {
      let result = {};

      if (this.vertical) {
        result.height = this.rangeTailWidth + "%";
        result.top = 0;
      } else {
        result.width = this.rangeTailWidth + "%";
        result.right = "0";
      }

      return result;
    },

    sliderDisabled() {
      return this.disabled || (this.Form || {}).disabled;
    },

    _tooltipClassName() {
      const tooltipEffectType =
        this.effect === "dark" ? "is-tooltip-dark" : "is-tooltip-light";
      const cusstomClass = this.tooltipClass
        ? this.tooltipClass
        : `rz-slider__tooltip ${tooltipEffectType}`;
      return cusstomClass;
    }
  },

  mounted() {
    let valuetext;
    if (this.range) {
      if (Array.isArray(this.value)) {
        this.firstValue = Math.max(this.min, this.value[0]);
        this.secondValue = Math.min(this.max, this.value[1]);
      } else {
        this.firstValue = this.min;
        this.secondValue = this.max;
      }
      this.oldValue = [this.firstValue, this.secondValue];
      valuetext = `${this.firstValue}-${this.secondValue}`;
    } else {
      if (typeof this.value !== "number" || isNaN(this.value)) {
        this.firstValue = this.min;
      } else {
        this.firstValue = Math.min(this.max, Math.max(this.min, this.value));
      }
      this.oldValue = this.firstValue;
      valuetext = this.firstValue;
    }
    this.$el.setAttribute("aria-valuetext", valuetext);

    // label screen reader
    this.$el.setAttribute(
      "aria-label",
      this.label ? this.label : `slider between ${this.min} and ${this.max}`
    );

    this.resetSize();
    window.addEventListener("resize", this.resetSize);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.resetSize);
  }
};
</script>
