<template>
  <transition name="dialog-fade" @after-leave="afterLeave">
    <div class="rz-dialog__wrapper" v-show="visible" @click.self="handleWrapperClick">
      <div
        class="rz-dialog rz-dialog-abs"
        :class="[{ 'is-fullscreen': fullscreen, 'rz-dialog--center': center }, customClass]"
        ref="dialog"
        :style="style"
      >
        <div class="rz-dialog__header" v-if="showHeader">
          <slot name="title">
            <span class="rz-dialog__title">{{ title }}</span>
          </slot>
          <button
            type="button"
            class="rz-dialog__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="handleClose"
          >
            <i class="rz-dialog__close rz-icon rz-icon-close"></i>
          </button>
        </div>
        <div
          class="rz-dialog__body"
          :class="{
          'is-body-padding': bodyPadding,
        }"
          v-if="rendered"
        >
          <slot></slot>
        </div>
        <div class="rz-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Popup from "rz/utils/popup";
import Migrating from "rz/mixins/migrating";
import emitter from "rz/mixins/emitter";
function compatibility() {
  const list = ["Firefox"];
  return list.some(i => {
    return navigator.userAgent.indexOf(i) > -1;
  });
}

export default {
  name: "Dialog",

  options: {
    name: "Dialog"
  },

  mixins: [Popup, emitter, Migrating],

  props: {
    title: {
      type: String,
      default: ""
    },

    modal: {
      type: Boolean,
      default: true
    },

    modalAppendToBody: {
      type: Boolean,
      default: true
    },

    appendToBody: {
      type: Boolean,
      default: false
    },

    lockScroll: {
      type: Boolean,
      default: true
    },

    closeOnClickModal: {
      type: Boolean,
      default: true
    },

    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    // 头部显示控制
    showHeader: {
      type: Boolean,
      default: true
    },

    showClose: {
      type: Boolean,
      default: true
    },

    width: String,

    fullscreen: Boolean,

    customClass: {
      type: String,
      default: ""
    },

    top: {
      type: String,
      default: "0"
    },
    beforeClose: Function,
    center: {
      type: Boolean,
      default: false
    },
    bodyPadding: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      closed: false
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.closed = false;
        this.$emit("open");
        this.$el.addEventListener("scroll", this.updatePopper);
        this.setDialog();
        if (this.appendToBody) {
          document.body.appendChild(this.$el);
        }
      } else {
        this.$el.removeEventListener("scroll", this.updatePopper);
        if (!this.closed) this.$emit("close");
      }
    }
  },

  computed: {
    style() {
      let style = {};
      if (!this.fullscreen) {
        if (this.top != 0) {
          style.marginTop = this.top;
        }
        if (this.width) {
          style.width = this.width;
        }
      }
      return style;
    }
  },

  methods: {
    setDialog() {
      this.$nextTick(() => {
        const dialog = this.$refs.dialog;
        dialog.scrollTop = 0;
        if (compatibility()) {
          const style = dialog.style;
          dialog.className = dialog.className.replace("rz-dialog-abs", "");
          style.left = "50%";
          style.top = "50%";
          style.marginLeft = "-" + dialog.clientWidth / 2 + "px";
          style.marginTop = "-" + dialog.clientHeight / 2 + "px";
        }
      });
    },
    getMigratingConfig() {
      return {
        props: {
          size: "size is removed."
        }
      };
    },
    handleWrapperClick() {
      if (!this.closeOnClickModal) return;
      this.handleClose();
    },
    handleClose() {
      if (typeof this.beforeClose === "function") {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit("update:visible", false);
        this.$emit("close");
        this.closed = true;
      }
    },
    updatePopper() {
      this.broadcast("ElSelectDropdown", "updatePopper");
      this.broadcast("ElDropdownMenu", "updatePopper");
    },
    afterLeave() {
      this.$emit("closed");
    }
  },

  mounted() {
    if (this.visible) {
      this.rendered = true;
      this.open();
      this.setDialog();
      if (this.appendToBody) {
        document.body.appendChild(this.$el);
      }
    }
  },

  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};
</script>
