<template>
  <transition @after-enter="afterEnter" @after-leave="afterLeave" name="colorfulball-fade">
    <div
      :style="{customStyle}"
      class="rz-colorfulBall"
      :class="{'is-hover': isHover, 'is-after-enter': isAfterEnter}"
      v-show="visible"
    >
      <div class="rz-colorfulBall__circle"></div>
      <div class="rz-colorfulBall__leftEllipse"></div>
      <div class="rz-colorfulBall__rightEllipse"></div>
      <slot></slot>
    </div>
  </transition>
</template>

<script lang='ts'>

import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  name: "ColorfulBall"
})
export default class ColorfulBall extends Vue {
  @Prop({ type: Boolean, default: false })
  readonly isHover: boolean;

  @Prop({ type: Boolean, default: true })
  readonly visible: boolean;

  @Prop({
    type: Object,
    default() {
      return {
        width:"420px",
        height:"420px"
      };
    }
  })
  customStyle: object;

  isAfterEnter: boolean = false;

  afterEnter() {
    this.isAfterEnter = true;
  }
  afterLeave() {
    this.isAfterEnter = false;
  }
}
</script>
