<template>
  <div class="rz-frame-player__image-list" ref="container">
    <div class="rz-frame-player__image-list-wrapper">
      <img
        :src="currentSrc"
        alt="current-image"
        :key="currentSrc"
        :style="imageListStyle"
        crossorigin="anonymous"
      />
      <div
        v-show="showFaceRect && faceRectStyles.length > 0"
        v-for="(rect, index) in faceRectStyles"
        :key="rect.id"
        class="rz-frame-player__image-list-face"
        :style="faceRectStyles[index].style"
      ></div>
      <div
        v-show="showBodyRect && bodyRectStyles.length > 0"
        v-for="(rect, index) in bodyRectStyles"
        :key="rect.id"
        class="rz-frame-player__image-list-body"
        :style="bodyRectStyles[index].style"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

import {
  getRatio,
  getBenchmark,
  getScaleValue,
  Size,
  Boundings
} from "pkg/image/src/utils";

import { OperationType, ZoomInfo, ImageList } from "../types";

import { getInt, getRandomId } from "../libs/utils";

@Component({
  name: "FramePlayerImageList"
})
export default class FramePlayerImageList extends Vue {
  @Prop() imageList:
    | {
        src: string;
        faceBounding?: Boundings[];
        bodyBounding?: Boundings[];
      }[]
    | string[];

  @Prop({ default: "display" }) mode: OperationType;

  @Prop() containerWidth: number;

  @Prop() containerHeight: number;

  @Prop() showFaceRect: boolean;

  @Prop() showBodyRect: boolean;

  @Prop({ default: false }) autoPlay: boolean;

  @Prop() imageDuration: number;

  @Prop({ default: "red" }) faceRectColor: string;

  @Prop({ default: "blue" }) bodyRectColor: string;

  @Prop({ default: 2 }) rectWidth: number;

  @Prop({
    default() {
      return {
        scale: 1,
        transformX: 0,
        transformY: 0
      };
    }
  })
  zoomInfo: ZoomInfo;

  currentIndex: number = 0;

  currentSrc: string = "";

  faceRects: Boundings[] = [];

  bodyRects: Boundings[] = [];

  @Watch("currentIndex", { immediate: true })
  onIndexChange(val) {
    const current = this.imageList[val];
    if (typeof current === "string") {
      this.currentSrc = current;
      this.faceRects = [];
      this.bodyRects = [];
    } else {
      this.faceRects =
        typeof current.faceBounding === "undefined" ? [] : current.faceBounding;
      this.bodyRects =
        typeof current.bodyBounding === "undefined" ? [] : current.bodyBounding;

      this.currentSrc = current.src;
    }
  }

  @Watch("imageList", { deep: true })
  onImageListChange(val) {
    const current = val[this.currentIndex];
    if (typeof current === "string") {
      this.currentSrc = current;
      this.faceRects = [];
      this.bodyRects = [];
    } else {
      this.faceRects =
        typeof current.faceBounding === "undefined" ? [] : current.faceBounding;
      this.bodyRects =
        typeof current.bodyBounding === "undefined" ? [] : current.bodyBounding;

      this.currentSrc = current.src;
    }
  }

  scaleValue: number = 1;

  timer: any = null;

  originSize: Size = {
    width: this.containerWidth,
    height: this.containerHeight
  };

  get imageWidth(): number {
    return getInt(
      this.originSize.width * this.scaleValue * this.zoomInfo.scale
    );
  }

  get imageHeight(): number {
    return getInt(
      this.originSize.height * this.scaleValue * this.zoomInfo.scale
    );
  }

  get imageListStyle() {
    const result: any = {
      width: this.imageWidth + "px",
      height: this.imageHeight + "px"
    };

    return result;
  }

  get faceRectStyles() {
    return this.faceRects.map(rect => {
      return {
        id: getRandomId(),
        style: this.getRectStyle(rect, this.zoomInfo.scale, "face")
      };
    });
  }

  get bodyRectStyles() {
    return this.bodyRects.map(rect => {
      return {
        id: getRandomId(),
        style: this.getRectStyle(rect, this.zoomInfo.scale, "body")
      };
    });
  }

  @Watch("currentSrc", { immediate: true })
  onSrcChange(val) {
    const image = new Image();
    image.src = val;
    image.onload = event => {
      // 原始图片大小
      this.originSize = {
        width: image.width,
        height: image.height
      };

      this.$emit("inner-loaded", this.originSize);

      const containerSize = {
        width: this.containerWidth,
        height: this.containerHeight
      };

      const benchmark = getBenchmark(this.originSize, containerSize);

      this.scaleValue = getScaleValue(containerSize, benchmark);
    };
  }

  getRectStyle(rect: Boundings, scale: number, type: string) {
    const { start, end } = rect;
    const left = start.x * scale * this.scaleValue;
    const top = start.y * scale * this.scaleValue;
    const width = (end.x - start.x) * scale * this.scaleValue;
    const height = (end.y - start.y) * scale * this.scaleValue;

    return {
      border: `${this.rectWidth}px solid ${this[type + "RectColor"]}`,
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`
    };
  }

  next() {
    this.currentIndex++;
    if (this.currentIndex === this.imageList.length) {
      this.currentIndex = 0;
    }
    this.$emit("next", this.currentIndex);
  }

  prev() {
    this.currentIndex--;
    if (this.currentIndex === -1) {
      this.currentIndex = this.imageList.length - 1;
    }
    this.$emit("prev", this.currentIndex);
  }

  play() {
    this.timer = setInterval(() => {
      this.next();
    }, this.imageDuration);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
  }

  mounted() {
    if (this.autoPlay) {
      this.play();
    }
  }

  beforeDestroy() {
    this.stop();
    this.currentIndex = 0;
  }
}
</script>