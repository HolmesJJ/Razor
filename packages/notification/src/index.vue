<template>
  <transition name="rz-notification-fade">
    <div
      :class="['rz-notification', customClass, horizontalClass]"
      v-show="visible"
      :style="_customStyle"
      @mouseenter="clearTimer()"
      @mouseleave="startTimer()"
      @click="click"
      role="alert"
    >
      <i class="rz-notification__icon" :class="[ typeClass, iconClass ]" v-if="type || iconClass"></i>
      <div class="rz-notification__group" :class="{ 'is-with-icon': typeClass || iconClass }">
        <h2 class="rz-notification__title" v-text="title"></h2>
        <div class="rz-notification__content" v-show="message">
          <slot>
            <p v-if="!dangerouslyUseHTMLString">{{ message }}</p>
            <p v-else v-html="message"></p>
          </slot>
        </div>
        <div class="rz-notification__closeBtn rz-icon-close" v-if="showClose" @click.stop="close"></div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
let typeMap = {
  success: "success",
  info: "info",
  warning: "warning",
  error: "error"
};

export default {
  data() {
    return {
      visible: false,
      title: "",
      message: "",
      duration: 4500,
      type: "",
      showClose: true,
      customClass: "",
      iconClass: "",
      onClose: null,
      onClick: null,
      closed: false,
      verticalOffset: 0,
      timer: null,
      dangerouslyUseHTMLString: false,
      position: "top-right",
      customStyle:{type: Object, default(){return {}}}
    };
  },

  computed: {
    typeClass() {
      return this.type && typeMap[this.type]
        ? `rz-icon-${typeMap[this.type]}`
        : "";
    },

    horizontalClass() {
      return this.position.indexOf("right") > -1 ? "right" : "left";
    },

    verticalProperty() {
      return /^top-/.test(this.position) ? "top" : "bottom";
    },

    positionStyle() {
      return {
        [this.verticalProperty]: `${this.verticalOffset}px`
      };
    },
    _customStyle() {
      return Object.assign(this.customStyle, this.positionStyle);
    }
  },

  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false;
        this.$el.addEventListener("transitionend", this.destroyElement);
      }
    }
  },

  methods: {
    destroyElement() {
      this.$el.removeEventListener("transitionend", this.destroyElement);
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },

    click() {
      if (typeof this.onClick === "function") {
        this.onClick();
      }
    },

    close() {
      this.closed = true;
      if (typeof this.onClose === "function") {
        this.onClose();
      }
    },

    clearTimer() {
      clearTimeout(this.timer);
    },

    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close();
          }
        }, this.duration);
      }
    },
    keydown(e) {
      if (e.keyCode === 46 || e.keyCode === 8) {
        this.clearTimer(); // detele 取消倒计时
      } else if (e.keyCode === 27) {
        // esc关闭消息
        if (!this.closed) {
          this.close();
        }
      } else {
        this.startTimer(); // 恢复倒计时
      }
    }
  },
  mounted() {
    if (this.duration > 0) {
      this.timer = setTimeout(() => {
        if (!this.closed) {
          this.close();
        }
      }, this.duration);
    }
    document.addEventListener("keydown", this.keydown);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.keydown);
  },
  created() {}
};
</script>
