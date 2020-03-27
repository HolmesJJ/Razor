<template>
  <div class="rz-frame-player">
    <div class="rz-frame-player__main" ref="container" :style="containerStyle">
      <zoom-box
        ref="zoombox"
        :outerHeight="zoomboxHeight"
        :outerWidth="zoomboxWidth"
        :canZoom="config.canZoom"
        :playType="playType"
        :activeCrop="activeCrop"
        :cropOperations="cropOperations"
        :menuClicked="menuClicked"
        :rectWidth="rectWidth"
        :innerSize="innerSize"
        :childrenIcon="icons.children"
        @zoom="zoom"
        @cancel-crop="cancelCrop"
        @crop-operation-click="handleCropOpClick"
      >
        <video-player
          ref="videoFilePlayer"
          v-if="playType === 'videoFile'"
          :videoUrl="videoUrl"
          :autoPlay="isPlay"
          :showAttrsInfo="showAttrsInfo"
          :colors="config.rectColors || rtspColors"
          :drawRect="drawRect"
          @inner-loaded="handleInnerLoaded"
        ></video-player>
        <rtsp-player
          ref="player"
          v-if="playType === 'video'"
          :videoUrl="videoUrl"
          :videoWsHost="videoWsHost"
          :autoPlay="isPlay"
          :showAttrsInfo="showAttrsInfo"
          :colors="config.rectColors || rtspColors"
          :drawRect="drawRect"
          @inner-loaded="handleInnerLoaded"
        ></rtsp-player>
        <image-list
          v-if="playType === 'image'"
          ref="imageList"
          :imageList="imageList"
          :containerWidth="zoomboxWidth"
          :containerHeight="zoomboxHeight"
          :zoomInfo="zoomInfo"
          :autoPlay="isPlay"
          :imageDuration="imageDuration"
          :showFaceRect="showFaceRect"
          :showBodyRect="showBodyRect"
          :faceRectColor="faceRectColor"
          :bodyRectColor="bodyRectColor"
          :rectWidth="rectWidth"
          @inner-loaded="handleInnerLoaded"
          @next="handleNext"
          @prev="handlePrev"
        ></image-list>
      </zoom-box>
    </div>

    <control-bar
      v-if="config.showController"
      :config="config"
      :playType="playType"
      :isPlay="isPlay"
      :playDisabled="playDisabled"
      :switchTypeDisabled="switchDisabled"
      :activeCrop="activeCrop"
      :showFaceRect="showFaceRect"
      :showBodyRect="showBodyRect"
      :disablePrevNext="imageList.length === 1"
      :isFullscreen="isFullscreen"
      :icons="icons"
      :fullscreenText="fullscreenText"
      :cancelFullscreenText="cancelFullscreenText"
      :disabledZoom="isPlay"
      @change="handlePlayChange"
      @type-change="handleTypeChange"
      @next="next"
      @prev="prev"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
      @cut="crop"
      @download="download"
      @fullscreen="fullscreen"
      @face-rect-change="handleShowFaceRect"
      @body-rect-change="handleShowBodyRect"
    ></control-bar>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

// children components
import ZoomBox from "../components/ZoomBox.vue";
import ImageList from "../components/ImageList.vue";
import VideoPlayer from "../components/VideoPlayer.vue";
import RtspPlayer from "pkg/rtspPlayer";
import ControlBar from "../components/ControlBar.vue";

import { VideoConfig, ZoomInfo } from "../types";
import { Boundings, Size } from "pkg/image/src/utils";
import merge from "lodash/merge";
import { t } from "rz/locale";

@Component({
  name: "FramePlayer",
  components: {
    ZoomBox,
    ImageList,
    RtspPlayer,
    VideoPlayer,
    ControlBar
  }
})
export default class FramePlayer extends Vue {
  @Prop() type: "video" | "image" | "videoFile";

  @Prop() videoConfig: VideoConfig;

  @Prop({ default: "100%" }) customWidth: number | string;

  @Prop({ default: "100%" }) customHeight: number | string;

  @Prop() imageList:
    | {
        src: string;
        faceBounding?: Boundings[];
        bodyBounding?: Boundings[];
      }[]
    | string[];

  @Prop() autoPlay: boolean;

  @Prop({ default: "" }) videoUrl: string;

  @Prop({ default: "" }) videoWsHost: string;

  @Prop() cropOperations: {
    label: string;
    onClick: (base64: string) => void;
  }[];

  @Prop() menuClicked: () => void;

  @Prop({ default: 2000 }) imageDuration: number;

  @Prop({ default: "#68cdfa" }) faceRectColor: string;

  @Prop({ default: "#68cdfa" }) bodyRectColor: string;

  @Prop({ default: 2 }) rectWidth: number;

  @Prop({ default: false }) showAttrsInfo: boolean;

  @Prop({
    default() {
      return {
        play: "icon-play",
        pause: "icon-stop",
        prev: "icon-arrowL",
        next: "icon-arrowR",
        zoomIn: "icon-enlarge",
        zoomOut: "icon-narrow",
        download: "icon-download",
        crop: "icon-shear",
        fullscreen: "iconexit-fullScreen",
        cancelFullscreen: "icon-fullScreen",
        children: "icon-arrowR"
      };
    }
  })
  icons: any;

  @Prop({ default: t("el.framePlayer.fullscreen") }) fullscreenText: string;

  @Prop({ default: t("el.framePlayer.cancelFullscreen") })
  cancelFullscreenText: string;

  zoomboxWidth: number = 0;
  zoomboxHeight: number = 0;

  showFaceRect: boolean = this.config.needFaceRect && this.config.showFaceRect;

  showBodyRect: boolean = this.config.needBodyRect && this.config.showBodyRect;

  zoomInfo: ZoomInfo = {
    scale: 1,
    transformX: 0,
    transformY: 0
  };

  isPlay: boolean = this.autoPlay;

  isFullscreen: boolean = false;

  get playType(): "video" | "image" | "videoFile"{
    const hasVideo = this.videoUrl && this.videoWsHost;
    const hasImage = this.imageList && this.imageList.length > 0;
    const hasType = !!this.type;

    if (hasVideo && hasImage && hasType) {
      return this.type;
    } else if (hasVideo) {
      return "video";
    } else if (hasImage) {
      return "image";
    } else {
      return this.type ? this.type : "video";
    }
    
  }

  activeCrop: boolean = false;

  refZoombox: ZoomBox;

  innerSize: Size = {
    width: 0,
    height: 0
  };

  get playDisabled(): boolean {
    return (
      this.playType === "image" && this.imageList && this.imageList.length === 1
    );
  }

  get drawRect(): boolean {
    return this.showFaceRect || this.showBodyRect;
  }

  get config(): VideoConfig {
    const defaultConfig = {
      needSwitcher: true,
      needPlay: true,
      needCut: true,
      needDownload: true,
      needFullScreen: true,
      needZoom: true,
      needVideo: true,
      needImg: true,
      needFaceRect: true,
      showFaceRect: false,
      needBodyRect: true,
      showBodyRect: false,
      showController: true,
      canZoom: true
    };
    return merge(defaultConfig, this.videoConfig);
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

  get containerStyle() {
    return {
      width: this.containerWidth,
      height: this.containerHeight
    };
  }

  get switchDisabled(): boolean {
    return (
      (this.playType === "video" && !this.imageList) ||
      (this.playType === "image" && (!this.videoUrl || !this.videoWsHost)) ||
      this.playType === "videoFile"
    );
  }

  get refFrame(): any {
    return this.playType === "image"
      ? this.$refs.imageList
      : this.playType === "video"
        ? this.$refs.player
        : this.$refs.videoFilePlayer;
  }

  get rtspColors(): string[] {
    const TYPE_COUNT = 13;
    const result = [];

    for (let i = 0; i < TYPE_COUNT; i++) {
      result.push(i === 1 ? this.faceRectColor : this.bodyRectColor);
    }

    return result;
  }

  @Watch("containerStyle", { immediate: true })
  onContainerStyleChange() {
    // 等到dom更新之后才能拿到真正的宽高值
    this.$nextTick(() => {
      if (this.$refs.container) {
        const { width, height } = getComputedStyle(this.$refs
          .container as Element);

        this.zoomboxWidth = parseInt(width);
        this.zoomboxHeight = parseInt(height);
      }
    });
  }

  handlePlayChange(isPlay: boolean) {
    if (isPlay) {
      this.play();
    } else {
      this.stop();
    }
  }

  handleTypeChange() {
    // 先暂停上一个类型的播放
    this.stop();
    this.refZoombox.resetZoom();
    // this.playType = type;
    if (this.autoPlay) {
      this.$nextTick(() => {
        this.play();
      });
    }
    this.$emit("type-change");
  }

  handleInnerLoaded(size) {
    this.innerSize = size;
  }

  handleShowFaceRect(val) {
    this.showFaceRect = val;
    this.$emit("face-rect-change", val);
  }
  handleShowBodyRect(val) {
    this.showBodyRect = val;
    this.$emit("body-rect-change", val);
  }

  handlePrev(index) {
    this.refZoombox.resetZoom();
    this.$emit("prev", index);
  }

  handleNext(index) {
    this.refZoombox.resetZoom();
    this.$emit("next", index);
  }

  handleCropOpClick() {
    this.$emit("crop-operation-click");
  }

  play() {
    this.refFrame.play();
    this.isPlay = true;
    this.controlEventNotification("Play");
  }

  stop() {
    this.refFrame.stop();
    this.isPlay = false;
    this.controlEventNotification("Stop");
  }

  zoom(event) {
    this.zoomInfo = event;
    this.controlEventNotification("Zoom");
  }

  zoomIn() {
    this.refZoombox.zoomIn();
    this.controlEventNotification("ZoomIn");
  }

  zoomOut() {
    this.refZoombox.zoomOut();
    this.controlEventNotification("ZoomOut");
  }

  next() {
    this.stop();
    this.refFrame.next();
    this.controlEventNotification("Next");
  }

  prev() {
    this.stop();
    this.refFrame.prev();
    this.controlEventNotification("Prev");
  }

  crop() {
    // 如果在图片连播模式下先暂停播放
    if (this.playType === "image") {
      this.stop();
    }
    this.activeCrop = !this.activeCrop;
    this.controlEventNotification("Crop");
  }

  cancelCrop() {
    this.activeCrop = false;
    this.controlEventNotification("CancelCrop");
  }

  download() {
    this.stop();
    this.refZoombox.download();
  }

  fullscreen(isFullscreen: boolean) {
    this.isFullscreen = isFullscreen;
    this.$emit("fullscreen", isFullscreen);
  }

  async getScreenshot() {
    try {
      const base64 = await this.refZoombox.getScreenshot();
      return base64;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // control-bar 部分事件的emit,触发时通知外部
  controlEventNotification(type) {
    this.$emit(`controlEvent${type}`);
  }

  mounted() {
    this.refZoombox = this.$refs.zoombox as any;
  }
}
</script>
