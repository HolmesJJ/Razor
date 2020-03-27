<template>
  <div
    class="rz-image-card"
    :class="containerClass"
    :style="{ padding: realContainerPadding }"
    @click="handleClick"
    @mouseover="handleMouseover"
    @mouseout="handleMouseout"
  >
    <!-- 勾选框 -->

    <div
      class="rz-image-card__others"
      v-show="renderCheckbox && (showSelectedLabel || allowSelect)"
    >
      <rz-checkbox
        class="rz-image-card__select"
        v-if="allowSelect"
        v-model="selected"
        @click.native="handleCheckboxClick"
        @change="handleSelectChange"
      ></rz-checkbox>

      <div class="rz-image-card__slabel" v-if="showSelectedLabel">{{ selectedLabel }}</div>
    </div>

    <!-- 图片 -->
    <div class="rz-image-card__wrapper" :style="wrapperStyle" ref="wrapper">
      <image-card-wrapper
        v-for="(image, index) in showData"
        :key="index"
        :src="image.src"
        :width="image.width"
        :height="image.height"
        :bounding="image.bounding"
        :info="image.info"
        :showInfo="showCurrentInfo(index)"
        :needFlex="needFlex"
        :bgColor="bgColor"
        :needFit="needFit"
        :ratioError="ratioError"
        :allowZoom="allowZoom"
        :type="type"
        :flexable="flexable"
        :flexbase="flexbase"
        :emptySrc="emptySrc"
        :loadingSrc="loadingSrc"
        :converter="converter"
      >
        <slot name="info" slot="info"></slot>
      </image-card-wrapper>

      <div
        v-if="showScore"
        class="rz-image-card__score"
        :class="{ 'rz-image-card__score--actived': actived }"
      >{{ score }}</div>
    </div>

    <!-- 质量分数 -->

    <!-- 额外内容, 放slot -->
    <div class="rz-image-card__content" :style="contentPaddingStyle" v-if="$slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

// components
import RzCheckbox from "../../checkbox/src/index.vue";
import ImageCardWrapper from "../../image/src/index.vue";

// utils
import isEmpty from "lodash/isEmpty";
import isArray from "lodash/isArray";
import has from "lodash/has";

import { getRealSize } from 'pkg/sImage/src/libs/utils'

@Component({
  name: "ImageCard",
  components: {
    RzCheckbox,
    ImageCardWrapper
  },
  model: {
    prop: "value",
    event: "update"
  }
})
export default class ImageCard extends Vue {
  @Prop([Array, Object]) data!: any;

  // 允许框选
  @Prop({ default: false }) allowSelect!: boolean;

  @Prop({ default: false }) value?: boolean;

  // 当前状态
  @Prop({ default: false }) actived?: boolean;

  // content slot position
  @Prop({ default: "bottom" }) contentPosition!: "bottom" | "right";

  @Prop() score?: string;

  @Prop({ default: false }) showScore!: boolean;

  @Prop({ default: false }) transition?: boolean;

  @Prop({ default: "hover" }) showCheckbox?: "hover" | "always";

  @Prop({ default: false }) showSelectedLabel!: boolean;

  @Prop({ default: "" }) selectedLabel!: string;

  @Prop({ default: true }) showInfo: boolean;

  @Prop({ default: 0 }) showInfoIndex: number | number[];

  @Prop() containerPadding!: any;

  @Prop() contentPadding!: any;

  @Prop({ default: false }) needFlex: boolean;

  @Prop({ default: false }) needFit: boolean;

  @Prop({ default: "#3B4764" }) bgColor!: string;

  @Prop({ default: 0.1 }) ratioError: number;

  @Prop({ default: false }) allowZoom: boolean;

  @Prop({ default: true }) activeStyle: boolean;

  @Prop({ default: true }) activeHover: boolean;

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

  isHovered: boolean = false;

  get selected(): boolean {
    return this.value;
  }

  set selected(value) {
    this.$emit("update", value);
  }

  get realContainerPadding(): string {
    const defaultPadding = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    };

    const { top, bottom, left, right } =
      this.containerPadding || defaultPadding;

    if (top) defaultPadding.top = top;
    if (bottom) defaultPadding.bottom = bottom;
    if (left) defaultPadding.left = left;
    if (right) defaultPadding.right = right;

    return `${this.getSize(defaultPadding.top)} ${this.getSize(defaultPadding.right)} ${this.getSize(defaultPadding.bottom)} ${this.getSize(defaultPadding.left)}`;
  }

  get realContentPadding(): any {
    const result: any = {};

    const content = this.contentPadding;

    if (content && has(content, "top")) result.paddingTop = `${this.getSize(content.top)}`;

    if (content && has(content, "left"))
      result.paddingLeft = `${this.getSize(content.left)}`;

    if (content && has(content, "right"))
      result.paddingRight = `${this.getSize(content.right)}`;

    if (content && has(content, "bottom"))
      result.paddingBottom = `${this.getSize(content.bottom)}`;

    return result;
  }

  get containerClass() {
    return {
      "rz-image-card--vertical": this.isVertical,
      "rz-image-card--nocontent": isEmpty(this.$slots),
      "is-actived": this.actived && this.activeStyle,
      "is-hovered": this.isHovered && this.activeHover,
      "is-transition": this.transition,
      "is-vertical": this.isVertical,
      "is-horizontal": !this.isVertical,
      "is-nocontent": this.noContent
    };
  }

  get showData() {
    if (isArray(this.data)) return this.data;
    return [this.data];
  }

  get contentRect() {
    const space = 2;
    let maxWidth = 0,
      maxHeight = 0;

    this.showData.forEach(img => {
      maxWidth += img.width;
    });

    maxWidth += (this.showData.length - 1) * space;

    this.showData.forEach(image => {
      if (image.height > maxHeight) {
        maxHeight = image.height;
      }
    });

    return {
      width: maxWidth,
      height: maxHeight
    };
  }

  // is vertical layout
  get isVertical(): boolean {
    return this.contentPosition === "bottom";
  }

  get noContent() {
    return Object.keys(this.$slots).length === 0;
  }

  get wrapperStyle() {
    return {
      width: this.getSize(this.contentRect.width),
      height: this.getSize(this.contentRect.height)
    };
  }

  get contentStyle() {
    return this.isVertical ? {
      maxWidth: this.getSize(this.contentRect.width)
    } : {}
  }

  get renderCheckbox(): boolean {
    if (this.showCheckbox === "always") {
      return true;
    } else {
      return this.isHovered;
    }
  }

  get contentPaddingStyle() {
    return { 
      ...this.contentStyle,
      ...this.realContentPadding };
  }

  @Emit("click")
  handleClick() {
    return this.data || {};
  }

  @Emit("change")
  handleSelectChange(event) {
    return {
      select: event,
      data: this.data
    };
  }

  showCurrentInfo(index: number): boolean {
    let showIndex = isArray(this.showInfoIndex)
      ? this.showInfoIndex
      : [this.showInfoIndex];

    return this.showInfo && (showIndex as number[]).includes(index);
  }

  handleCheckboxClick(event: Event) {
    event.stopPropagation();
    this.$emit('checkbox-click', {
      select: this.selected,
      data: this.data
    });
  }

  handleMouseout() {
    this.isHovered = false;
  }

  handleMouseover() {
    this.isHovered = true;
  }

  getSize(value: number | string) {
    if (typeof value === 'string') {
      value = parseInt(value);
    }

    return getRealSize(value, this.flexable, this.flexbase, this.converter);
  }
}
</script>
