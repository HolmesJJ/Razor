<template>
  <div
    class="rz-steps"
    :class="[
       !simple && !inline && 'rz-steps--' + direction,
       simple && 'rz-steps--simple',
       inline && 'rz-steps--inline',
       inline && alignCenter && 'is-center'
     ]"
  >
    <slot></slot>
  </div>
</template>

<script>
import Migrating from "rz/mixins/migrating";

export default {
  name: "Steps",
  
  options: {
    name: "Steps"
  },

  mixins: [Migrating],

  props: {
    space: [Number, String],
    active: Number,
    direction: {
      type: String,
      default: "horizontal"
    },
    alignCenter: Boolean,
    simple: Boolean,
    inline: Boolean,
    finishStatus: {
      type: String,
      default: "finish"
    },
    processStatus: {
      type: String,
      default: "process"
    }
  },

  data() {
    return {
      steps: [],
      stepOffset: 0
    };
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          center: "center is removed."
        }
      };
    }
  },

  watch: {
    active(newVal, oldVal) {
      this.$emit("change", newVal, oldVal);
    },

    steps(steps) {
      steps.forEach((child, index) => {
        child.index = index;
      });
    }
  }
};
</script>
