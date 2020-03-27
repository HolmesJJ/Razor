<template>
  <div class="rz-badge">
    <slot></slot>
    <transition name="rz-zoom-in-center">
      <sup
        v-show="!hidden && (content || content === 0 || isDot)"
        v-text="content"
        class="rz-badge__content"
        :class="{ 'is-fixed': !!$slots.default, 'is-dot': isDot }"
      ></sup>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  name: "Badge"
})
export default class Badge extends Vue {
  @Prop({
    default() {
      return {};
    }
  })
  readonly value: any;

  @Prop({ type: Number })
  readonly max: number;

  @Prop({ type: Boolean })
  readonly isDot: boolean;

  @Prop({ type: Boolean })
  readonly hidden: boolean;

  get content() {
    if (this.isDot) return '';

    const value = this.value;
    const max = this.max;

    if (typeof value === "number" && typeof max === "number") {
      return max < value ? `${max}+` : value;
    }

    return value;
  }
}
</script>
