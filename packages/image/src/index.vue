<template>
  <div class="rz-image" :style="imageStyle">
    <s-image
      :src="src"
      :width="width"
      :height="height"
      :bounding="bounding"
      :ratioError="ratioError"
      :allowZoom="allowZoom"
      :type="type"
      :flexable="flexable"
      :flexbase="flexbase"
      :emptySrc="emptySrc"
      :loadingSrc="loadingSrc"
      :converter="converter"
    ></s-image>

    <div class="rz-image__info" v-show="showInfo">
      <slot name="info">
        <span v-if="smallSuffix" class="rz-image__lastletter">%</span>
        <span>{{ infoText }}</span>
      </slot>
    </div>

    <!-- 用作 close 等的插槽 -->
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

import SImage from "pkg/sImage";

import { Boundings } from "./imageCalculator";

import { getRealSize } from 'pkg/sImage/src/libs/utils'

@Component({
  components: {
    SImage
  }
})
export default class Img extends Vue {
  @Prop() src!: string;

  @Prop() width!: string;

  @Prop() height!: string;

  @Prop() info!: string;

  @Prop({ default: false }) showInfo!: boolean;

  @Prop()
  bounding!: Boundings;

  @Prop({ default: false }) actived?: boolean;

  @Prop({ default: "#3B4764" }) bgColor!: string;

  // 是否控制图片居中显示
  @Prop({ default: false }) needFlex: boolean;

  // 是否自动调整位置
  @Prop({ default: false }) needFit: boolean;

  @Prop({ default: 0.1 }) ratioError: number;

  @Prop({ default: false }) allowZoom: boolean;

  @Prop(String) type: string;

  @Prop({
    type: Number,
    default: 100
  }) flexbase: number;

  @Prop({
    type: Boolean,
    default: true
  }) flexable: boolean;

  @Prop(String)
  emptySrc: string;

  @Prop(String)
  loadingSrc: string;
  @Prop()
  converter!: Function;

  smallSuffix: boolean = false;

  get infoText(): string {
    if (this.showInfo && this.info) {
      const lastLetter = this.info.slice(-1);
      if (lastLetter === "%") {
        this.smallSuffix = true;
        return this.info.slice(0, -1);
      } else {
        this.smallSuffix = false;
        return this.info;
      }
    }
    return "";
  }

  get imageStyle() {
    return {
      width: getRealSize(parseInt(this.width), this.flexable, this.flexbase, this.converter),
      height: getRealSize(parseInt(this.height), this.flexable, this.flexbase, this.converter),
      backgroundColor: this.bgColor
    };
  }
}
</script>
