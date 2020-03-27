<template>
  <li class="rz-timeline-item" :style="{ 'height': height}">
    <div class="rz-timeline-item__tail" :style="tailStyle"></div>

    <div
      v-if="!$slots.dot"
      class="rz-timeline-item__node"
      :class="[
        `rz-timeline-item__node--${size || ''}`,
        `rz-timeline-item__node--${type || ''}`
      ]"
      :style="{
        backgroundColor: color
      }"
    >
      <i v-if="icon" class="rz-timeline-item__icon" :class="icon"></i>
    </div>
    <div v-if="$slots.dot" class="rz-timeline-item__dot">
      <slot name="dot"></slot>
    </div>

    <div class="rz-timeline-item__wrapper">
      <div
        v-if="!hideTimestamp && placement === 'top'"
        class="rz-timeline-item__timestamp is-top"
      >{{timestamp}}</div>

      <div class="rz-timeline-item__content">
        <slot></slot>
      </div>

      <div
        v-if="!hideTimestamp && placement === 'bottom'"
        class="rz-timeline-item__timestamp is-bottom"
      >{{timestamp}}</div>
    </div>
  </li>
</template>

<script>
export default {
  options: {
    name: "TimelineItem"
  },

  inject: ["timeline"],

  props: {
    timestamp: String,

    hideTimestamp: {
      type: Boolean,
      default: false
    },

    placement: {
      type: String,
      default: "bottom"
    },

    type: String,

    color: String,

    size: {
      type: String,
      default: "large"
    },

    icon: String,
    height: {
      type: [String, Number],
      default: "120px"
    },
    dashed:{
      type: Boolean,
      default: false,
    }
  },
  computed: {
    tailStyle() {
      if (this.dashed) {
        return {
          "border-left-style":'dashed'
        }
      }
      return {};
    }
  }
};
</script>
