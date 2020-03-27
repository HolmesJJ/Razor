<template>
  <div class="rz-frame-player__control-bar">
    <div class="rz-frame-player__control-bar-left">
      <!-- 播放按钮 -->
      <div
        v-if="config.needPlay"
        class="rz-frame-player__control-bar-item playbtn"
        :class="{ 'is-disabled': activeCrop || playDisabled }"
      >
        <rz-tooltip
          placement="top"
          :content="playContent"
          :disabled="activeCrop || playDisabled"
        >
          <rz-icon :label="playIcon" @click.native="playValueChange"></rz-icon>
        </rz-tooltip>
      </div>

      <!-- 播放类型 -->
      <div v-if="config.needSwitcher" class="rz-frame-player__control-bar-item">
        <rz-on-off
          :disabled="switchTypeDisabled"
          :value="playType === 'video' || playType === 'videoFile'"
          type="text"
          :active-text="t('el.framePlayer.video')"
          :inactive-text="t('el.framePlayer.image')"
          @click.native="switchPlayType"
        ></rz-on-off>
      </div>

      <!-- 上一张 -->
      <div
        v-if="playType === 'image'"
        class="rz-frame-player__control-bar-item"
        :class="{ 'is-disabled': activeCrop || disablePrevNext }"
      >
        <rz-tooltip
          placement="top"
          :content="t('el.framePlayer.prev')"
          :disabled="activeCrop || disablePrevNext"
        >
          <rz-icon :label="icons.prev" @click.native="handlePrev"></rz-icon>
        </rz-tooltip>
      </div>

      <!-- 下一张 -->
      <div
        v-if="playType === 'image'"
        class="rz-frame-player__control-bar-item"
        :class="{ 'is-disabled': activeCrop || disablePrevNext }"
      >
        <rz-tooltip
          placement="top"
          :content="t('el.framePlayer.next')"
          :disabled="activeCrop || disablePrevNext"
        >
          <rz-icon :label="icons.next" @click.native="handleNext"></rz-icon>
        </rz-tooltip>
      </div>
    </div>

    <div class="rz-frame-player__control-bar-right">
      <!-- 是否检测人脸 -->
      <div
        v-if="config.needFaceRect"
        class="rz-frame-player__control-bar-item onoff"
      >
        <span>{{ t("el.framePlayer.faceRect") }}</span>
        <rz-on-off
          :value="showFaceRect"
          @click.native="handleFaceRectChange"
        ></rz-on-off>
      </div>

      <!-- 是否检测结构化 -->
      <div
        v-if="config.needBodyRect"
        class="rz-frame-player__control-bar-item onoff"
      >
        <span>{{ t("el.framePlayer.bodyRect") }}</span>
        <rz-on-off
          :value="showBodyRect"
          @click.native="handleBodyRectChange"
        ></rz-on-off>
      </div>

      <!-- 放大 -->
      <div v-if="config.needZoom" class="rz-frame-player__control-bar-item" :class="{ 'is-disabled': disabledZoom }">
        <rz-tooltip placement="top" :content="t('el.framePlayer.zoomIn')" :disabled="disabledZoom">
          <rz-icon :label="icons.zoomIn" @click.native="handleZoomIn"></rz-icon>
        </rz-tooltip>
      </div>

      <!-- 缩小 -->
      <div v-if="config.needZoom" class="rz-frame-player__control-bar-item" :class="{ 'is-disabled': disabledZoom }">
        <rz-tooltip placement="top" :content="t('el.framePlayer.zoomOut')" :disabled="disabledZoom">
          <rz-icon
            :label="icons.zoomOut"
            @click.native="handleZoomOut"
          ></rz-icon>
        </rz-tooltip>
      </div>

      <!-- 下载 -->
      <div v-if="config.needDownload" class="rz-frame-player__control-bar-item">
        <rz-tooltip placement="top" :content="t('el.framePlayer.download')">
          <rz-icon
            :label="icons.download"
            @click.native="handleDownload"
          ></rz-icon>
        </rz-tooltip>
      </div>

      <!-- 裁剪 -->
      <div
        v-if="config.needCut"
        class="rz-frame-player__control-bar-item"
        :class="{ 'is-actived': activeCrop }"
      >
        <rz-tooltip placement="top" :content="t('el.framePlayer.cut')">
          <rz-icon :label="icons.crop" @click.native="handleCut"></rz-icon>
        </rz-tooltip>
      </div>

      <!-- 全屏 -->
      <div
        v-if="config.needFullScreen"
        class="rz-frame-player__control-bar-item"
      >
        <rz-tooltip
          placement="top"
          :content="isFullscreen ? cancelFullscreenText : fullscreenText"
        >
          <rz-icon
            :label="isFullscreen ? icons.fullscreen : icons.cancelFullscreen"
            @click.native="handleFullscreen"
          ></rz-icon>
        </rz-tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Model,
  Emit,
  Watch
} from "vue-property-decorator";

import RzTooltip from "pkg/tooltip";
import RzIcon from "pkg/icon";
import RzOnOff from "pkg/onOff";

import Locale from "rz/mixins/locale";
import { t } from "rz/locale";
import { VideoConfig } from "../types";

@Component({
  name: "FramePlayerControlBar",
  components: {
    RzIcon,
    RzTooltip,
    RzOnOff
  },
  mixins: [Locale]
})
export default class FramePlayerControlBar extends Vue {
  readonly t: (name: string) => string;

  @Prop() config: VideoConfig;

  @Prop() playType: "video" | "image" |  "videoFile";

  @Prop() isPlay: boolean;

  @Prop(Boolean) playDisabled: boolean; 

  @Prop({ default: false }) prevDisabled: boolean;

  @Prop({ default: false }) nextDisabled: boolean;

  @Prop({ default: false }) switchTypeDisabled: boolean;

  @Prop() showFaceRect: boolean;

  @Prop() showBodyRect: boolean;

  @Prop() activeCrop: boolean;

  @Prop({ default: false }) disablePrevNext: boolean;

  @Prop({ default: false }) isFullscreen: boolean;

  @Prop({ default: t("el.framePlayer.fullscreen") }) fullscreenText: string;

  @Prop({ default: t("el.framePlayer.cancelFullscreen") })
  cancelFullscreenText: string;

  @Prop()
  icons: any;

  @Prop(Boolean)
  disabledZoom: boolean;

  get playIcon(): string {
    return this.isPlay ? this.icons.pause : this.icons.play;
  }

  get playContent(): string {
    return this.isPlay
      ? this.t("el.framePlayer.pause")
      : this.t("el.framePlayer.play");
  }

  playValueChange() {
    if (this.playDisabled || this.activeCrop) {
      return;
    }
    this.$emit("change", !this.isPlay);
  }

  switchPlayType() {
    if (this.switchTypeDisabled) {
      return;
    }
    this.$emit("type-change");
  }

  @Emit("face-rect-change")
  handleFaceRectChange() {
    return !this.showFaceRect;
  }

  @Emit("body-rect-change")
  handleBodyRectChange() {
    return !this.showBodyRect;
  }

  // @Emit("zoom-in")
  handleZoomIn() {
    if (this.disabledZoom) {
      return;
    }
    this.$emit('zoom-in')
  }

  // @Emit("zoom-out")
  handleZoomOut() {
    if (this.disabledZoom) {
      return;
    }
    this.$emit('zoom-out')
  }

  @Emit("download")
  handleDownload() {}

  @Emit("cut")
  handleCut() {}

  @Emit("fullscreen")
  handleFullscreen() {
    return !this.isFullscreen;
  }

  handlePrev() {
    if (this.activeCrop || this.disablePrevNext) {
      return;
    }
    this.$emit("prev");
  }

  handleNext() {
    if (this.activeCrop || this.disablePrevNext) {
      return;
    }
    this.$emit("next");
  }
}
</script>
