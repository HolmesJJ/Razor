<template>
  <div
    v-if="!isInline"
    class="rz-step"
    :style="style"
    :class="[
        !isSimple && `is-${$parent.direction}`,
        isSimple && 'is-simple',
        isLast && !space && !isCenter && 'is-flex',
        isCenter && !isVertical && !isSimple && 'is-center'
      ]"
  >
    <!-- icon & line -->
    <div class="rz-step__head" :class="`is-${currentStatus}`">
      <div class="rz-step__line" :class="`is-${currentStatus}`" :style="isLast ? '' : { marginRight: $parent.stepOffset + 'px' }">
        <i class="rz-step__line-inner" :style="lineStyle"></i>
      </div>

      <div class="rz-step__icon" :class="`is-${icon ? 'icon' : 'text'} is-${currentStatus}`">
        <slot v-if="currentStatus !== 'success' && currentStatus !== 'error'" name="icon">
          <i v-if="icon" class="rz-step__icon-inner" :class="[icon]"></i>
          <div class="rz-step__icon-inner" v-if="!icon && !isSimple">{{ index + 1 }}</div>
        </slot>
        <i
          v-else
          :class="['rz-icon-' + (currentStatus === 'success' ? 'check' : 'close')]"
          class="rz-step__icon-inner is-status"
        ></i>
      </div>
    </div>
    <!-- title & description -->
    <div class="rz-step__main">
      <div class="rz-step__title" ref="title" :class="['is-' + currentStatus]">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="isSimple" class="rz-step__arrow"></div>
      <div v-else class="rz-step__description" :class="['is-' + currentStatus]">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
  <div
    :class="{
      'is-center': isCenter,
      ['is-' + currentStatus]:true
    }"
    class="rz-step is-inline"
    v-else
  >
    <div class="rz-step__icon" :class="['is-' + currentStatus]">
      <slot v-if="currentStatus !== 'success' && currentStatus !== 'error'" name="icon">
        <i v-if="icon" class="rz-step__icon-inner" :class="[icon]"></i>
        <div class="rz-step__icon-inner">{{ index + 1 }}</div>
      </slot>
      <i
        v-else
        :class="['rz-icon-' + (currentStatus === 'success' ? 'check' : 'close')]"
        class="rz-step__icon-inner is-status"
      ></i>
    </div>
    <div class="rz-step__title" ref="title" :class="['is-' + currentStatus]">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="rz-step__divider"></div>
  </div>
</template>

<script>
export default {
  name: "Step",

  options: {
    name: "Step"
  },

  props: {
    title: String,
    icon: String,
    description: String,
    status: String
  },

  data() {
    return {
      index: -1,
      lineStyle: {},
      internalStatus: ""
    };
  },

  beforeCreate() {
    this.$parent.steps.push(this);
  },

  beforeDestroy() {
    const steps = this.$parent.steps;
    const index = steps.indexOf(this);
    if (index >= 0) {
      steps.splice(index, 1);
    }
  },

  computed: {
    currentStatus() {
      return this.status || this.internalStatus;
    },
    prevStatus() {
      const prevStep = this.$parent.steps[this.index - 1];
      return prevStep ? prevStep.currentStatus : "wait";
    },
    isCenter() {
      return this.$parent.alignCenter;
    },
    isVertical() {
      return this.$parent.direction === "vertical";
    },
    isSimple() {
      return this.$parent.simple;
    },
    isInline() {
      return this.$parent.inline;
    },
    isLast() {
      const parent = this.$parent;
      parent.steps = parent.steps || [];
      const length = parent.steps.length;
      if(!length){
        return false;
      }
      return parent.steps[length - 1] === this;
    },
    stepsCount() {
      return this.$parent.steps.length;
    },
    space() {
      const {
        isSimple,
        $parent: { space }
      } = this;
      return isSimple ? "" : space;
    },
    style: function() {
      const style = {};
      const parent = this.$parent;
      const len = parent.steps.length;

      const space =
        typeof this.space === "number"
          ? this.space + "px"
          : this.space
            ? this.space
            : 100 / (len - (this.isCenter ? 0 : 1)) + "%";
      style.flexBasis = space;
      if (this.isVertical) return style;
      if (this.isLast) {
        style.maxWidth = 100 / this.stepsCount + "%";
      } else {
        style.marginRight = -this.$parent.stepOffset + "px";
      }

      return style;
    }
  },

  methods: {
    updateStatus(val) {
      const prevChild = this.$parent.$children[this.index - 1];

      if (val > this.index) {
        this.internalStatus = this.$parent.finishStatus;
      } else if (val === this.index && this.prevStatus !== "error") {
        this.internalStatus = this.$parent.processStatus;
      } else {
        this.internalStatus = "wait";
      }

      if (prevChild) prevChild.calcProgress(this.internalStatus);
    },

    calcProgress(status) {
      let step = 100;
      const style = {};

      style.transitionDelay = 150 * this.index + "ms";
      if (status === this.$parent.processStatus) {
        step = this.currentStatus !== "error" ? 0 : 0;
      } else if (status === "wait") {
        step = 0;
        style.transitionDelay = -150 * this.index + "ms";
      }

      style.borderWidth = step ? "1px" : 0;
      this.$parent.direction === "vertical"
        ? (style.height = step + "%")
        : (style.width = step + "%");

      this.lineStyle = style;
    }
  },

  mounted() {
    /* eslint-disable-next-line */
    const unwatch = this.$watch("index", val => {
      this.$watch("$parent.active", this.updateStatus, { immediate: true });
      unwatch();
    });
  }
};
</script>
