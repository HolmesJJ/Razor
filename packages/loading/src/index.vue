<template>
  <transition name="rz-loading-fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      class="rz-loading-mask"
      :style="{ backgroundColor: background || '' }"
      :class="[customClass, { 'is-fullscreen': fullscreen }]">
      <div class="rz-loading-spinner">
        <svg v-if="!spinner" class="circular" viewBox="32 32 64 64">
          <circle class="path" cx="64" cy="64" r="30" fill="none"/>
        </svg>
        <i v-else :class="spinner" :style="{fontSize: spinnerFontSize + 'px'}"></i>
        <p v-if="text" class="rz-loading-text" :style="{fontSize: textFontSize + 'px'}">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
import Locale from 'rz/mixins/locale';
export default {
  data() {
    return {
      text: null,
      spinner: null,
      background: null,
      fullscreen: true,
      visible: false,
      spinnerFontSize: 48,
      textFontSize: 14,
      customClass: ''
    };
  },
  mixins: [Locale],
  methods: {
    handleAfterLeave() {
      this.$emit('after-leave');
    },
    setText(text) {
      this.text = text;
    }
  }
};
</script>
