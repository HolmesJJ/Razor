<template>
  <transition name="rz-message-fade" @after-leave="handleAfterLeave">
    <div
      :class="[
        'rz-message',
        type && !iconClass ? `rz-message--${ type }` : '',
        center ? 'is-center' : '',
        showClose ? 'is-closable' : '',
        customClass
      ]"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
      role="alert">
      <i :class="iconClass" v-if="iconClass"></i>
      <i :class="typeClass" v-else></i>
      <slot>
        <p v-if="!dangerouslyUseHTMLString" class="rz-message__content">{{ message }}</p>
        <p v-else v-html="message" class="rz-message__content"></p>
      </slot>
      <i v-if="showClose" class="rz-message__closeBtn rz-icon-close" @click="close"></i>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { keyCodes } from 'rz/utils/keyCode'

const typeMap: any = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
};

@Component({
  name: "Message",
  computed: {
    typeClass(): string {
      return this.type && !this.iconClass
        ? `rz-message__icon rz-iconfont rz-iconfont-${ typeMap[this.type] }`/* 用iconfont 的icon */
        : '';
    }
  }
})

export default class Message extends Vue {
  visible: boolean = false;
  message: string = '';
  duration: number = 3000;
  type: string = 'info';
  iconClass: string = '';
  customClass: string = '';
  onClose: Function = null;
  showClose: boolean = false;
  closed: boolean = false;
  timer: any = null;
  dangerouslyUseHTMLString: boolean = false;
  center: boolean = true;

  @Watch('closed')
  handleClosed(newVal) {
    if (newVal) {
      this.visible = false;
    }
  }

  mounted() {
    this.startTimer();
    document.addEventListener('keydown', this.keydown);
  }

  beforeDestroy() {
    document.removeEventListener('keydown', this.keydown);
  }

  handleAfterLeave() {
    this.$destroy();
    this.$el.parentNode.removeChild(this.$el);
  }

  close() {
    this.closed = true;
    if (typeof this.onClose === 'function') {
      this.onClose(this);
    }
  }

  clearTimer() {
    clearTimeout(this.timer);
  }

  startTimer() {
    if (this.duration > 0) {
      this.timer = setTimeout(() => {
        if (!this.closed) {
          this.close();
        }
      }, this.duration);
    }
  }
  
  keydown(evt) {
    if (evt.keyCode === keyCodes.esc) {
      if (!this.closed) {
        this.close();
      }
    }
  }

}
</script>
