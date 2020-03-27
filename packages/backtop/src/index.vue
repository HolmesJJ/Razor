<template>
  <!-- 编写 backtop 组件 -->
  <transition name="rz-fade-in">
    <div
      v-if="visible"
      @click.stop="handleClick"
      :style="{
        'right': styleRight,
        'bottom': styleBottom,
        'z-index': zIndex,
      }"
      class="rz-backtop"
    >
      <slot>
        <rz-icon name="caret-top" :label="iconClass"></rz-icon>
        <span class="rz-backtop__word">TOP</span>
      </slot>
    </div>
  </transition>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator";
import throttle from "throttle-debounce/throttle";
import Locale from "rz/mixins/locale";

@Component({
  name: "Backtop",
  mixins: [Locale],
})
export default class Backtop extends Vue {

  @Prop({ type: Number, default: 20 })
  readonly visibilityHeight: number;

  @Prop({
    type: String,
    default: ""
  })
  readonly target: string;

  @Prop({ type: [Number, String], default: 40 })
  readonly right: number | string;

  @Prop({ type: [Number, String], default: 40 })
  readonly bottom: number | string;
  
  @Prop({ type: Number, default: 5 })
  readonly zIndex: number;

  @Prop({ type: String, default: '' })
  readonly iconClass: string;

  get styleBottom() {
    if(this.isString(this.bottom)){
      return this.bottom;
    }
    return `${this.bottom}px`;
  }

  get styleRight() {
    if(this.isString(this.right)){
      return this.right;
    }
    return `${this.right}px`;
  }

  el: HTMLElement = null;
  container: HTMLElement | Document = null;
  visible: boolean = false;

  throttledScrollHandler: () => Function;

  mounted() {
    this.init();
    this.throttledScrollHandler = throttle(300, this.onScroll);
    this.container.addEventListener("scroll", this.throttledScrollHandler);
  }

  beforeDestroy() {
    this.container.removeEventListener("scroll", this.throttledScrollHandler);
  }

  isString(value){
    return Object.prototype.toString.call(value).indexOf('String') > -1;
  }

  init() {
    this.container = document;
    this.el = document.documentElement;
    if (this.target) {
      this.el = document.querySelector(this.target);
      if (!this.el) {
        throw new Error(`target is not existed: ${this.target}`);
      }
      this.container = this.el;
    }
  }

  onScroll() {
    const scrollTop = this.el.scrollTop;
    this.visible = scrollTop >= this.visibilityHeight;
  }

  handleClick(e) {
    this.scrollToTop();
    this.$emit("click", e);
  }

  scrollToTop() {
    let el = this.el;
    let step = 0;
    let interval = setInterval(() => {
      if (el.scrollTop <= 0) {
        clearInterval(interval);
        return;
      }
      step += 10;
      el.scrollTop -= step;
    }, 20);
  }
}
</script>
