<template>
  <!-- 编写 videoPlayer 组件 -->
  <div class="rz-videoPlayer__outer">
    <div
      ref="container"
      class="rz-videoPlayer"
      :style="{
      width: containerWidth,
      height: containerHeight
    }"
      @mouseover="() => {imageFocus = true}"
      @mouseout="() => {imageFocus = false}"
    >
      <img
        id="cutimage_container"
        v-if="isCutting"
        :src="currentCutImage"
        @mousedown="handleDrawStart"
        @contextmenu="stopCut"
      />
      <div
        class="rz-videoPlayer__drawDiv"
        v-if="showDraw"
        @contextmenu="stopCut"
        :style="{
        top: `${cutRectY1}px`,
        left: `${cutRectX1}px`,
        bottom: `${height - cutRectY2}px`,
        right: `${width - cutRectX2}px`,
        boxShadow: `rgba(0, 0, 0, 0.5) 0 0 0 ${width}px`,
      }"
      >
        <rz-button class="rz-videoPlayer__drawDiv--confirm" type="primary" size="mini">
          <rz-icon label="iconby"></rz-icon>
        </rz-button>

        <rz-button
          class="rz-videoPlayer__drawDiv--cancel"
          type="danger"
          size="mini"
          @click.native="handleCutCancel"
        >
          <rz-icon label="iconfail"></rz-icon>
        </rz-button>
      </div>
      <div
        class="rz-videoPlayer__container"
        :style="{
        height: `${height * scale}px`,
        width: `${width * scale}px`,
        top: `${transformY}px`,
        left: `${transformX}px`,
      }"
        @wheel="handleZoom"
        @mousedown="handleMoveStart"
      >
        <VideoContainer
          :showRect="showRect"
          :videoUrl="videoUrl"
          :videoWsHost="videoWsHost"
          :autoPlay="autoPlay"
          :displayType="playType"
          :imageList="imageList"
          :imageFocus="imageFocus"
          :duration="imageDuration"
          ref="videoContainer"
        />
      </div>
    </div>
    <div class="rz-videoPlayer__controllers" v-if="config && config.showController">
      <div class="rz-videoPlayer__controllers--left">
        <div
          class="rz-videoPlayer__controllers--item rz-videoPlayer__controllers--playbtn"
          v-if="config && config.needPlay"
        >
          <rz-tooltip type="normal" placement="top" :content="playContent" :openDelay="0">
            <rz-icon :label="play ? 'iconfailL' : 'iconplay'" @click.native="handlePlay"></rz-icon>
          </rz-tooltip>
        </div>
        <div
          class="rz-videoPlayer__controllers--item videoSwitch"
          v-if="config.needVideo && config.needImg"
        >
          <rz-on-off
            :value="playType === 'video'"
            :active-text="getLabel('video')"
            :inactive-text="getLabel('image')"
            type="text"
            @click.native="switchVideoPlay"
          ></rz-on-off>
        </div>

        <div
          class="rz-videoPlayer__controllers--item rz-videoPlayer__controllers--icon"
          v-if="playType === 'image'"
        >
          <rz-tooltip type="normal" placement="top" :content="getLabel('pre')" :openDelay="0">
            <i class="rz-icon-arrow-left" @click="handlePre"></i>
          </rz-tooltip>
        </div>
        <div
          class="rz-videoPlayer__controllers--item rz-videoPlayer__controllers--icon"
          v-if="playType === 'image'"
        >
          <rz-tooltip type="normal" placement="top" :content="getLabel('next')" :openDelay="0">
            <i class="rz-icon-arrow-right" @click="handleNext"></i>
          </rz-tooltip>
        </div>
      </div>
      <div class="rz-videoPlayer__controllers--right">
        <div
          class="rz-videoPlayer__controllers--item rz-videoPlayer__controllers--rect"
          v-if="config.needBodyRect"
        >
          <span>{{getLabel('bodyRect')}}</span>
          <rz-on-off v-model="showBodyRect" @change="showBodyRectChange"></rz-on-off>
        </div>
        <div
          class="rz-videoPlayer__controllers--item rz-videoPlayer__controllers--rect"
          v-if="config.needFaceRect"
        >
          <span>{{getLabel('faceRect')}}</span>
          <rz-on-off v-model="showFaceRect"></rz-on-off>
        </div>

        <div
          class="rz-videoPlayer__controllers--item rz-videoPlayer__controllers--icon"
          v-if="config && config.needZoom"
        >
          <rz-icon label="iconenlarge" @click.native="handelZoomOut"></rz-icon>
        </div>

        <div
          class="rz-videoPlayer__controllers--item rz-videoPlayer__controllers--icon"
          v-if="config && config.needZoom"
        >
          <rz-icon label="iconnarrow" @click.native="handleZoomIn"></rz-icon>
        </div>
        <div
          class="rz-videoPlayer__controllers--item rz-videoPlayer__controllers--icon"
          v-if="config && config.needDownload"
        >
          <rz-tooltip type="normal" placement="top" :content="getLabel('download')" :openDelay="0">
            <rz-icon label="icondownload" @click.native="handleDownload"></rz-icon>
          </rz-tooltip>
        </div>
        <div
          class="rz-videoPlayer__controllers--item rz-videoPlayer__controllers--icon"
          v-if="config && config.needCut"
        >
          <rz-tooltip type="normal" placement="top" :content="getLabel('cut')" :openDelay="0">
            <rz-icon label="iconshear" @click.native="handleCut"></rz-icon>
          </rz-tooltip>
        </div>
        <div
          class="rz-videoPlayer__controllers--item rz-videoPlayer__controllers--icon"
          v-if="config && config.needFullScreen"
        >
          <rz-tooltip
            type="normal"
            placement="top"
            :content="getLabel('fullscreen')"
            :openDelay="0"
          >
            <rz-icon label="iconfullScreen" @click.native="handleFullScreen"></rz-icon>
          </rz-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from "vue-property-decorator";
import RzSlider from "pkg/slider";
import RzTooltip from "pkg/tooltip";
import RzOnOff from "pkg/onOff";
import RzIcon from "pkg/icon";

import VideoContainer from "./videoContainer.vue";
import { downloadFile } from "rz/utils/img";
import { labelConfig, rectifyNumRange, numRangeRectify } from "../util";
import { swallowEvent } from "rz/utils/util";

@Component({
  name: "VideoPlayer",
  components: {
    VideoContainer,
    RzSlider,
    RzTooltip,
    RzOnOff,
    RzIcon
  }
})
export default class VideoPlayer extends Vue {
  @Prop()
  videoConfig!: object;

  @Prop()
  autoPlay!: boolean;

  @Prop({
    default() {
      return {
        play: "",
        pause: "",
        zoom: "",
        download: "",
        fullscreen: "",
        cut: "",
        image: "",
        video: "",
        pre: "",
        next: ""
      };
    }
  })
  labelConfig: object;
  @Prop({ default: "" })
  videoUrl!: string;
  @Prop({ default: "" })
  videoWsHost!: string;
  @Prop({
    default() {
      return [];
    }
  })
  imageList: string[];
  @Prop({ default: 2000 })
  imageDuration: number;
  @Prop({ type: [Number, String], default: "100%" })
  customWidth!: string | number;

  @Prop({ type: [Number, String], default: "100%" })
  customHeight!: string | number;

  /*eslint-disable*/

  $refs: {
    videoContainer: any;
  };

  imageFocus = false;

  width = 0;
  height = 0;

  // 缩放配置
  maxScale = 5;
  minScale = 1;
  scale: number = 1;

  // 裁剪
  isCutting = false;
  currentCutImage = "";
  showDraw = false;
  hasRect = false;

  // 裁剪框左上右下坐标
  cutRectX1 = 0;
  cutRectY1 = 0;
  cutRectX2 = 0;
  cutRectY2 = 0;
  // 裁剪元素位置
  cutImgClientX = 0;
  cutImgClientY = 0;
  // 裁剪框第一个点
  startX = 0;
  startY = 0;

  // 记录偏移
  transformX = 0;
  transformY = 0;

  // 记录拖拽上一次位置
  lastX = 0;
  lastY = 0;
  canMove = false;

  // 是否画框
  showFaceRect: boolean = false;
  showBodyRect: boolean = false;

  get showRect(): boolean {
    return this.showFaceRect || this.showBodyRect;
  }
  // showRect: boolean = false;

  // 播放类型
  playType = this.imageList.length ? "image" : this.videoUrl ? "video" : "";

  play = this.autoPlay;

  get playContent() {
    return this.play ? this.getLabel("pause") : this.getLabel("play");
  }

  getLabel(name) {
    return this.labelConfig[name] ? this.labelConfig[name] : labelConfig[name];
  }

  get containerWidth(): string {
    if (typeof this.customWidth === "string") {
      return this.customWidth;
    }
    return `${this.customWidth}px`;
  }

  get containerHeight(): string {
    const controllerHeight = 48;
    if (typeof this.customHeight === "string") {
      return this.config.showController
        ? `calc(${this.customHeight} - ${controllerHeight}px)`
        : `${this.customHeight}`;
    }

    return this.config.showController
      ? `${this.customHeight - controllerHeight}px`
      : `${this.customHeight}px`;
  }

  get config() {
    const defaultConfig = {
      showController: true,
      needPlay: true,
      needCut: false,
      needDownload: true,
      needFullScreen: true,
      needZoom: true,
      needVideo: true,
      needImg: true,
      needFaceRect: true,
      needBodyRect: true,
      canZoom: true
    };
    return Object.assign(defaultConfig, this.videoConfig);
  }

  mounted() {
    const elm = getComputedStyle((this.$refs as any).container);
    this.width = parseFloat(elm.width);
    this.height = parseFloat(elm.height);
  }

  showBodyRectChange() {
    this.$emit("body-rect-change", this.showBodyRect);
  }

  showFaceRectChange() {
    this.$emit("face-rect-change", this.showFaceRect);
  }

  changeShowBodyRect(show: boolean) {
    this.showBodyRect = show;
  }

  changeShowFaceRect(show: boolean) {
    this.showFaceRect = show;
  }

  // 播放
  handlePlay() {
    if (this.isCutting) {
      this.isCutting = false;
    }
    if (this.play) {
      this.doStop();
    } else {
      this.doPlay();
    }
    this.play = !this.play;
    this.$emit("playStateChange", this.play);
  }

  doPlay() {
    this.$refs.videoContainer.play();
  }

  doStop() {
    this.$refs.videoContainer.stop();
  }

  // 切换播放
  switchVideoPlay(type) {
    if (this.isCutting) {
      this.isCutting = false;
    }
    if (
      (type === "video" && !this.videoUrl) ||
      (type === "image" && !this.imageList[0])
    ) {
      return;
    }

    if (this.play) {
      this.doStop();
      this.play = false;
    }

    this.$nextTick(() => {
      this.playType = this.playType === "video" ? "image" : "video";
    });
  }

  handleFullScreen() {
    this.play = false;
    this.$emit("fullscreen");
  }

  // 处理图片切换
  handlePre() {
    if (this.playType !== "image") return;
    this.$refs.videoContainer && this.$refs.videoContainer.handleImgPre();
  }
  handleNext() {
    if (this.playType !== "image") return;
    this.$refs.videoContainer && this.$refs.videoContainer.handleImgNext();
  }

  // 处理裁剪
  handleCut() {
    let dataBase64 =
      this.$refs.videoContainer &&
      this.$refs.videoContainer.getBase64(this.calcCurrentScreen());
    if (dataBase64 === "") return;
    this.play = false;
    this.isCutting = true;
    this.currentCutImage = dataBase64;
  }

  handleCutConfirm() {}

  handleCutCancel(e) {
    this.stopCut(e);
  }

  stopCut(e) {
    swallowEvent(e);
    this.isCutting = false;
    this.showDraw = false;
    this.hasRect = false;
  }

  // 计算当前画面百分比
  calcCurrentScreen() {
    let left = {
      x: (this.transformX * -1) / this.width / this.scale,
      y: (this.transformY * -1) / this.height / this.scale
    };
    let right = {
      x: (this.transformX * -1 + this.width) / this.width / this.scale,
      y: (this.transformY * -1 + this.height) / this.height / this.scale
    };
    return { left, right };
  }

  /**
   * api: 下载
   */
  handleDownload() {
    let fileName = `${new Date().toLocaleString()}.png`;
    let dataBase64 = "";
    if (this.playType === "image") {
      dataBase64 =
        this.$refs.videoContainer &&
        this.$refs.videoContainer.getBase64(this.calcCurrentScreen());
    } else {
      dataBase64 =
        this.$refs.videoContainer && this.$refs.videoContainer.getBase64();
    }
    if (dataBase64 === "") return;
    downloadFile(fileName, dataBase64);
  }

  handleDrawStart(e) {
    swallowEvent(e);
    if (this.hasRect) return;

    this.showDraw = true;
    this.startX = e.pageX - e.target.getBoundingClientRect().x;
    this.startY = e.pageY - e.target.getBoundingClientRect().y;
    this.cutRectX1 = this.startX;
    this.cutRectY1 = this.startY;
    this.cutRectX2 = this.startX;
    this.cutRectY2 = this.startY;
    this.cutImgClientX = e.target.getBoundingClientRect().x;
    this.cutImgClientY = e.target.getBoundingClientRect().y;
    document.addEventListener("mousemove", this.handleDrawMove);
    document.addEventListener("mouseup", this.handleDrawEnd);
  }

  handleDrawMove(e) {
    swallowEvent(e);
    if (!this.showDraw) return;
    let newX = rectifyNumRange(
      e.pageX - this.cutImgClientX,
      0,
      this.width,
      numRangeRectify.INSIDE
    );
    let newY = rectifyNumRange(
      e.pageY - this.cutImgClientY,
      0,
      this.height,
      numRangeRectify.INSIDE
    );
    this.cutRectX2 = Math.max(newX, this.startX);
    this.cutRectY2 = Math.max(newY, this.startY);
    this.cutRectX1 = Math.min(newX, this.startX);
    this.cutRectY1 = Math.min(newY, this.startY);
  }
  handleDrawEnd(e) {
    this.handleDrawMove(e);
    document.removeEventListener("mousemove", this.handleDrawMove);
    document.removeEventListener("mouseup", this.handleDrawEnd);
    this.emitDrawEnd(e);
    this.hasRect = true;
  }

  emitDrawEnd(e) {
    let cutPosition = {
      left: {
        x: this.cutRectX1 / this.width / this.scale,
        y: this.cutRectY1 / this.height / this.scale
      },
      right: {
        x: this.cutRectX2 / this.width / this.scale,
        y: this.cutRectY2 / this.height / this.scale
      }
    };
    let dataBase64 =
      this.$refs.videoContainer &&
      this.$refs.videoContainer.getBase64(cutPosition);
    this.$emit("drawEnd", e, dataBase64);
  }

  // 处理缩放
  handleZoom(event) {
    if (!this.config.canZoom) {
      return;
    }
    let center = {
      x: 0,
      y: 0
    };
    let scale: number;
    if (event.target) {
      swallowEvent(event);
      const scaleUp = event.deltaY < 0;
      let newScale = this.scale + 0.1 * (scaleUp ? 1 : -1);

      center.x = event.offsetX + this.transformX;
      center.y = event.offsetY + this.transformY;

      if (newScale > this.maxScale) {
        newScale = this.maxScale;
      } else if (newScale < this.minScale) {
        newScale = this.minScale;
      }
      scale = newScale / this.scale;
      this.scale = parseFloat(newScale.toFixed(1));
    } else {
      scale = event / this.scale;
      center.x = this.width / 2;

      center.y = this.height / 2;
      this.scale *= scale;
    }
    let transformX = (center.x - this.transformX) * scale;
    let transformY = (center.y - this.transformY) * scale;
    this.transformX = rectifyNumRange(
      center.x - transformX,
      0,
      this.width * (1 - this.scale),
      numRangeRectify.OUTSIDE
    );
    this.transformY = rectifyNumRange(
      center.y - transformY,
      0,
      this.height * (1 - this.scale),
      numRangeRectify.OUTSIDE
    );
  }

  /**
   * api: 放大
   */
  handelZoomOut() {
    const scale = this.scale + 0.5;

    if (scale > this.maxScale) {
      return;
    }

    this.handleZoom(scale);
  }

  /**
   * api: 缩小
   */
  handleZoomIn() {
    const scale = this.scale - 0.5;

    if (scale < this.minScale) {
      return;
    }

    this.handleZoom(scale);
  }

  // 处理拖拽事件
  handleMoveStart(e) {
    swallowEvent(e);
    this.canMove = true;
    this.lastX = e.pageX;
    this.lastY = e.pageY;
    document.addEventListener("mousemove", this.handleMove);
    document.addEventListener("mouseup", this.handleMoveEnd);
  }

  handleMove(e) {
    swallowEvent(e);
    if (!this.canMove) return;
    const nowX = e.pageX;
    const nowY = e.pageY;
    let moveX = nowX - this.lastX + this.transformX;
    let moveY = nowY - this.lastY + this.transformY;
    this.transformX = rectifyNumRange(
      moveX,
      0,
      this.width * (1 - this.scale),
      numRangeRectify.OUTSIDE
    );
    this.transformY = rectifyNumRange(
      moveY,
      0,
      this.height * (1 - this.scale),
      numRangeRectify.OUTSIDE
    );
    this.lastX = nowX;
    this.lastY = nowY;
  }

  handleMoveEnd(e) {
    this.handleMove(e);
    this.canMove = false;
    document.removeEventListener("mousemove", this.handleMove);
    document.removeEventListener("mouseup", this.handleMoveEnd);
  }
}
</script>
