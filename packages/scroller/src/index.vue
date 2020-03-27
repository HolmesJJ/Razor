<template>
  <div
    class="rz-scroller"
    v-infinite-scroll="scrollHandler"
    infinite-scroll-distance="distance"
    infinite-scroll-disabled="disabled"
    infinite-scroll-immediate-check="immediateCheck"
    infinite-scroll-throttle-delay="delay"
  >
    <!-- infinite-scroll-listen-for-event="listenEvent" -->
    <slot></slot>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from "vue-property-decorator";
import { insertDefaultHeight } from "rz/utils/dom";

@Component({
  name: "Scroller",
})
export default class Scroller extends Vue {
  /**
   * 是否派发滚动事件
   */
  @Prop({
    type: Boolean,
    default: false
  })
  readonly disabled: boolean;

  /**
   * 滚动离底部距离
   */
  @Prop({
    type: Number,
    default: 20
  })
  readonly distance: number;

  /**
   * 是否立即检测默认应该不是
   */
  @Prop({
    type: Boolean,
    default: false
  })
  readonly immediateCheck: boolean;
  /**
   * 更新延迟。
   */
  @Prop({
    type: Number,
    default: 200
  })
  readonly delay: number;

  /**
   * 处理函数
   */
  @Prop({
    type: Function,
    required: true,
    default: () => undefined
  })
  readonly scrollHandler: () => any;

  /**
   * 更新延迟。
   */
  @Prop({
    type: [Number, String],
    default: "100%"
  })
  readonly height: number | string;

  mounted() {
    // 初始化
    this._initCom();
  }

  _initCom() {
    insertDefaultHeight(this.$el, "100%");
  }
}
</script>