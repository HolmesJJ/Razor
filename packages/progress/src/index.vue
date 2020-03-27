<template>
  <div
    class="rz-progress"
    :class="[
      'rz-progress--' + type,
      status ? 'is-' + status : '',
      {
        'rz-progress--without-text': !showText,
        'rz-progress--text-inside': textInside,
      }
    ]"
    role="progressbar"
    :aria-valuenow="percentage"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="rz-progress-bar" v-if="type === 'line'">
      <div class="rz-progress-bar__outer" :style="{height: strokeWidth + 'px', backgroundColor: this.outerBackground}">
        <div class="rz-progress-bar__inner" :style="barStyle">
          <div class="rz-progress-bar__innerText" v-if="showText && textInside">{{percentage}}%</div>
        </div>
      </div>
    </div>
    <div class="rz-progress-circle" :style="{height: width + 'px', width: width + 'px'}" v-else>
      <svg viewBox="0 0 100 100">
        <path
          class="rz-progress-circle__track"
          :d="trackPath"
          stroke="#263451"
          :stroke-width="relativeStrokeWidth"
          fill="none"
        ></path>
        <path
          class="rz-progress-circle__path"
          :d="trackPath"
          stroke-linecap="round"
          :stroke="stroke"
          :stroke-width="relativeStrokeWidth"
          fill="none"
          :style="circlePathStyle"
        ></path>
      </svg>
    </div>
    <div
      class="rz-progress__text"
      v-if="showText && !textInside"
      :style="{fontSize: progressTextSize + 'px'}"
    >
      <template v-if="!status">{{percentage}}%</template>
      <i v-else :class="iconClass"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: "Progress",
  options: {
    name: "Progress"
  },
  props: {
    type: {
      type: String,
      default: "line",
      validator: val => ["line", "circle"].indexOf(val) > -1
    },
    percentage: {
      type: Number,
      default: 0,
      required: true,
      validator: val => val >= 0 && val <= 100
    },
    status: {
      type: String
    },
    strokeWidth: {
      type: Number,
      default: 4
    },
    textInside: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 126
    },
    showText: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: ""
    },
    outerBackground:{
      type: String,
      default: ""
    }
  },
  computed: {
    barStyle() {
      const style = {};
      style.width = this.percentage + "%";
      style.backgroundColor = this.color;
      return style;
    },
    relativeStrokeWidth() {
      return ((this.strokeWidth / this.width) * 100).toFixed(1);
    },
    trackPath() {
      const radius = parseInt(
        50 - parseFloat(this.relativeStrokeWidth) / 2,
        10
      );

      return `M 50 50 m 0 -${radius} a ${radius} ${radius} 0 1 1 0 ${radius *
        2} a ${radius} ${radius} 0 1 1 0 -${radius * 2}`;
    },
    perimeter() {
      const radius = 50 - parseFloat(this.relativeStrokeWidth) / 2;
      return 2 * Math.PI * radius;
    },
    circlePathStyle() {
      const perimeter = this.perimeter;
      return {
        strokeDasharray: `${perimeter}px,${perimeter}px`,
        strokeDashoffset: (1 - this.percentage / 100) * perimeter + "px",
        transition: "stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease"
      };
    },
    stroke() {
      let ret;
      if (this.color) {
        ret = this.color;
      } else {
        switch (this.status) {
          case "success":
            ret = "#4da971";
            break;
          case "exception":
            ret = "#e5624c";
            break;
          case "warning":
            ret = "#f1b206";
            break;
          default:
            ret = "#68cdfa";
        }
      }
      return ret;
    },
    iconClass() {
      if (this.type === "line") {
        return this.status === "success"
          ? "rz-icon-circle-check"
          : "rz-icon-circle-close";
      } else {
        return this.status === "success" ? "rz-icon-check" : "rz-icon-close";
      }
    },
    progressTextSize() {
      return this.type === "line"
        ? 12 + this.strokeWidth * 0.4
        : this.width * 0.111111 + 2;
    }
  }
};
</script>
