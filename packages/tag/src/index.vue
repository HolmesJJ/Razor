<template>
  <transition :name="disableTransitions ? '' : 'rz-zoom-in-center'">
    <rz-popover
      :popper-class="'rz-tag__popover'"
      :visible-arrow="false"
      :disabled="disabled || popoverDisable"
      :open-delay="popoverDelay"
      trigger="hover"
      placement="top-start"
    >
      <div class="rz-tag__popover-content">{{popoverText}}</div>
      <span
        slot="reference"
        class="rz-tag"
        ref="tagContainer"
        :class="[
        type ? 'rz-tag--' + type : '',
        tagSize && `rz-tag--${tagSize}`,
        {'is-hit': hit},
        {'is-top': top},
        {'is-activated': activated},
      ]"
        @click="handleClick"
        :style="{backgroundColor: color}"
      >
        <slot></slot>
        <i class="rz-tag__close rz-icon-close" v-if="closable" @click.stop="handleClose"></i>
      </span>
    </rz-popover>
  </transition>
</template>
<script>
import RzPopover from "pkg/popover";

export default {
  name: "Tag",
  options: {
    name: "Tag"
  },
  components: {
    RzPopover
  },
  props: {
    text: String,
    closable: Boolean,
    type: String,
    hit: Boolean,
    disableTransitions: Boolean,
    color: String,
    size: String,
    top: Boolean,
    activated: Boolean,
    popoverDisable: {
      type: Boolean,
      default: false
    },
    popoverDelay:{
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      disabled: true
    };
  },
  methods: {
    handleClose(event) {
      this.$emit("close", event);
    },
    handleClick(event) {
      this.$emit("click", event);
    },
    getMaxTextLength() {
      if (this.size !== "large") {
        return true;
      }
      const container = this.$refs.tagContainer;
      const width = container.clientWidth;
      const tagPadding = 8; // tag 的padding 的值
      const containerTextLength = width - tagPadding * 2;
      this.disabled = this.getDisabledState(containerTextLength);
    },
    getDisabledState(containerTextLength) {
      const tagFontSize = 12; // tag fontsize 的值
      // eslint-disable-next-line
      const reg = /[^\x00-\xff]/g;
      const strLength = this.popoverText.replace(reg, "**").length; // 真实长度
      const charFontSize = tagFontSize / 2; // 字号除以二是单个字符的字号
      const strWidth = strLength * charFontSize;
      const remainder = containerTextLength % 12;
      const adapt = remainder > charFontSize ? remainder : remainder + charFontSize; // 适配字符
      const disabled = strWidth <= containerTextLength - tagFontSize - adapt;
      return disabled;
    }
  },
  computed: {
    tagSize() {
      return this.size || (this.$RAZOR || {}).size;
    },
    popoverText() {
      if (!this.$slots || !this.$slots.default || !this.$slots.default.length || !this.$slots.default[0].text) {
        return "";
      }
      return this.$slots.default[0].text;
    }
  },
  mounted() {
    this.getMaxTextLength();
  },
  updated(){
    this.getMaxTextLength();
  }
};
</script>
