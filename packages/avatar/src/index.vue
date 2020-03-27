<template>
  <span :class="avatarClass" :style="sizeStyle">
    <rz-checkbox v-if="showCheck" v-model="avatarChecked"></rz-checkbox>
    <img
      v-if="isImageExist && src"
      :src="src"
      @error="handleError"
      :alt="alt"
      :srcSet="srcSet"
      :style="{ 'object-fit': fit }"
    >
    <i v-else-if="icon" :class="icon"></i>
    <slot v-else-if="$slots.default"></slot>
  </span>
</template>
<script lang='ts'>
import { Vue, Component, Prop, Watch, Emit } from "vue-property-decorator";

@Component({
  name: "Avatar"
})
export default class Avatar extends Vue {
  @Prop({
    type: [Number, String],
    validator(val) {
      if (typeof val === "string") {
        return ["large", "medium", "small"].includes(val);
      }
      return typeof val === "number";
    }
  })
  size: number | string;

  @Prop({
    type: String,
    default: "circle",
    validator(val) {
      return ["circle", "square"].includes(val);
    }
  })
  shape: string;

  @Prop({
    type: String,
    default: ""
  })
  icon: string;

  @Prop({
    type: String,
    default: ""
  })
  src: string;

  @Prop({
    type: String,
    default: ""
  })
  alt: string;

  @Prop({
    type: String,
    default: ""
  })
  srcSet: string;

  @Prop({
    type: Function
  })
  error: Function;

  @Prop({
    type: String,
    default: ""
  })
  fit: string;

  @Prop({
    type: Boolean,
    default: true
  })
  showCheck: boolean;

  @Prop({
    type: Boolean,
    default: false
  })
  checked: boolean;

  avatarChecked: boolean = this.checked;

  get avatarClass() {
    const { size, icon, shape, fit } = this;
    let classList = ["rz-avatar"];

    if (size && typeof size === "string") {
      classList.push(`rz-avatar--${size}`);
    }

    if (icon) {
      classList.push("rz-avatar--icon");
    }

    if (shape) {
      classList.push(`rz-avatar--${shape}`);
    }

    if (fit) {
      classList.push(`is-fit`);
    }

    return classList.join(" ");
  }

  get sizeStyle() {
    const { size } = this;

    const sizeStyle =
      typeof size === "number"
        ? {
          height: `${size}px`,
          width: `${size}px`,
          lineHeight: `${size}px`
        }
        : {};
    return sizeStyle;
  }

  isImageExist: boolean = true;

  @Watch("avatarChecked")
  handleCheckChange(value) {
    this.emitCheckChange(value);
  }

  @Emit("change")
  emitCheckChange(value) {
    return value;
  }

  handleError() {
    const { error } = this;
    const errorFlag = error ? error() : undefined;
    if (errorFlag !== false) {
      this.isImageExist = false;
    }
  }
}
</script>
