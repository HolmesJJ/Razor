<template>
  <button
    class="rz-button"
    :class="className"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    @click="handleClick"
  >
    <i class="rz-icon-loading" v-if="loading"></i>
    <i :class="icon" v-if="icon && !loading"></i>
    <span v-if="$slots.default">
      <slot></slot>
    </span>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop, Inject } from "vue-property-decorator";

@Component({
  name: "Button"
})
export default class Button extends Vue {
  readonly $RAZOR: any;

  @Inject({ default: "" })
  readonly Form: any;

  @Inject({ default: "" })
  readonly FormItem: any;

  @Prop({ default: "primary" })
  readonly type!: string;

  @Prop({ type: Boolean, default: false })
  readonly disabled: boolean;

  @Prop({ type: Boolean, default: false })
  readonly loading: boolean;

  @Prop({ type: Boolean, default: false })
  readonly autofocus: boolean;

  @Prop({ type: String, default: "button" })
  readonly nativeType: string;

  @Prop({ type: String, default: "" })
  readonly size: string;

  @Prop({ type: String, default: "" })
  readonly icon: string;

  @Prop({ type: Boolean, default: false })
  readonly round: boolean;

  @Prop({ type: Boolean, default: false })
  readonly circle: boolean;

  @Prop({ type: Boolean, default: false })
  readonly plain: boolean;

  @Prop({ type: Boolean, default: false })
  readonly autoWidth: boolean;

  @Prop({ type: String, default: "default" })
  readonly color: string;

  @Emit("click")
  handleClick(event: Event) {
    return event;
  }

  get formItemSize() {
    return (this.FormItem || {}).FormItemSize;
  }

  get buttonDisabled() {
    return this.disabled || (this.Form || {}).disabled;
  }

  get buttonSize() {
    return this.size || this.formItemSize || (this.$RAZOR || {}).size;
  }

  get className(): object {
    let classNameObj = {};
    const prefix = "rz-button--";

    /* handle type */
    const buttonTypeClassName = this.type ? `${prefix}${this.type}` : "";
    if (buttonTypeClassName) classNameObj[buttonTypeClassName] = true;

    /* handle size */
    const buttonSize = this.buttonSize ? `${prefix}${this.buttonSize}` : "";
    if (buttonSize) classNameObj[buttonSize] = true;

    /* handle other case */
    const { buttonDisabled, loading, plain, round, circle, autoWidth } = this;
    classNameObj = Object.assign(classNameObj, {
      "is-disabled": buttonDisabled,
      "is-loading": loading,
      "is-plain": plain,
      "is-round": round,
      "is-circle": circle,
      "is-autoWidth": autoWidth,
      // 当type = 'text' 时，提供color属性来指定默认的字体颜色
      "is-primary-text": this.type === "text" && this.color === "primary"
    });

    return classNameObj;
  }
}
</script>