<template>
  <!-- 编写 placeholder 组件 -->
  <div class="rz-placeholder" :style="customStyle">
    <span class="rz-placeholder__empty-text">
      <slot name="empty">
        <div class="rz-placeholder__empty-text--image" :style="_backgroundStyle"></div>
        <p>{{ emptyText || t('el.table.emptyText') }}</p>
      </slot>
    </span>
  </div>
</template>

<script lang='ts'>

import { Vue, Component, Prop } from "vue-property-decorator";
import Locale from "rz/mixins/locale";

@Component({
  name: "Placeholder",
  mixins: [Locale]
})
export default class Placeholder extends Vue {
  @Prop({ type: String, default: "" })
  readonly emptyText: string;

  @Prop({ type: String, default: "" })
  readonly backgroundImage: string;

  @Prop({
    type: Object,
    default() {
      return {};
    }
  })
  readonly customStyle;

  @Prop({
    type: Object,
    default() {
      return {};
    }
  })
  readonly backgroundStyle;

  get _backgroundStyle() {
    const style: any = {};
    if (this.backgroundImage) {
      style.backgroundImage = `url('${this.backgroundImage}')`;
    }
    return Object.assign({}, style, this.backgroundStyle);
  }
}
</script>
