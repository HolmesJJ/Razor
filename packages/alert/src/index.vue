<template>
  <transition name="rz-alert-fade">
    <div
      class="rz-alert"
      :class="[typeClass, center ? 'is-center' : '']"
      v-show="visible"
      role="alert"
    >
      <i class="rz-alert__icon" :class="[ iconClass, isBigIcon ]" v-if="showIcon"></i>
      <div class="rz-alert__content">
        <span class="rz-alert__title" :class="[ isBoldTitle ]" v-if="title">{{ title }}</span>
        <slot>
          <p class="rz-alert__description" v-if="description">{{ description }}</p>
        </slot>
        <i
          class="rz-alert__closebtn"
          :class="{ 'is-customed': closeText !== '', 'rz-icon-close': closeText === '' }"
          v-show="closable"
          @click="close()"
        >{{closeText}}</i>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
const TYPE_CLASSES_MAP = {
  success: "rz-icon-success",
  warning: "rz-icon-warning",
  error: "rz-icon-error"
};
export default {
  options: {
    name: "Alert"
  },

  props: {
    title: {
      type: String,
      default: "",
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "info"
    },
    closable: {
      type: Boolean,
      default: true
    },
    closeText: {
      type: String,
      default: ""
    },
    showIcon: Boolean,
    center: Boolean
  },

  data() {
    return {
      visible: true
    };
  },

  methods: {
    close() {
      this.visible = false;
      this.$emit("close");
    }
  },

  computed: {
    typeClass() {
      return `rz-alert--${this.type}`;
    },

    iconClass() {
      return TYPE_CLASSES_MAP[this.type] || "rz-icon-info";
    },

    isBigIcon() {
      return this.description || this.$slots.default ? "is-big" : "";
    },

    isBoldTitle() {
      return this.description || this.$slots.default ? "is-bold" : "";
    }
  }
};
</script>
