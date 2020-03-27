<template>
  <div class="rz-videoContainer">
    <div class="rz-videoContainer__video" v-if="displayType === 'video'">
      <video :id="videoPlayerId" autoplay muted ref="video">
        <source :src="videoUrl" type="application/x-rtsp" />
      </video>
    </div>
    <div class="rz-videoContainer__imglist" v-if="displayType === 'image'">
      <img
        v-for="(item, index) in imageList"
        crossorigin="anonymous"
        :key="index"
        :src="item"
        class="rz-videoContainer__imglist--img"
        :class="{
          'is-show': currentImgIndex === index  
        }"
      />
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">

import { Vue, Component, Prop, Watch } from "vue-property-decorator";
// import "streamedian";
import { getBase64FromCanvas } from "rz/utils/img";
import PlayerSEI from "./player_SEI"; // eslint-disable-line

const refreshTime = 15 * 60 * 1000; // 15 minus
import { getRandomId } from "../util";
@Component({
  name: "VideoContainer"
})
export default class VideoContainer extends Vue {
  // Props
  @Prop({ default: "" })
  videoUrl: string;
  @Prop({
    default() {
      return [];
    }
  })
  imageList: string[];
  @Prop({ default: false })
  imageFocus: boolean;
  @Prop({ default: false })
  autoPlay: boolean;

  @Prop({ default: "image" })
  displayType: string;
  @Prop({ default: "" })
  videoWsHost: string;
  @Prop({ default: 2000 })
  duration: number;

  @Prop(Boolean) showRect: boolean;

  videoPlayerId = getRandomId();

  @Watch("showRect")
  onShowRectChange(val: boolean) {
    if (this.playerSEI) {
      this.playerSEI.setShowRect(val);
    }
  }

  created() {
    if (this.displayType === "video") {
      if (!(window as any).Streamedian || (window as any).Streamedian == null) {
        throw new Error(
          "[Razor Error]: Streamedian must import before the player mounted"
        );
      }
    }
  }

  mounted() {
    if (this.autoPlay) {
      this.play();
    }
  }

  // image
  imgInterval: any;
  currentImgIndex = 0;

  // video
  player: any;
  playerSEI: any = null;
  refreshInterval: any;

  handleVideoPlay() {
    if (this.player) {
      this.destroyVideoPlayer();
    }
    this.initVideoPlayer();
  }

  initVideoPlayer() {
    if (this.player) {
      this.destroyVideoPlayer();
    }

    const colors = ["blue", "green", "red", "yellow", "orange"];
    this.player = (window as any).Streamedian.player(this.videoPlayerId, {
      socket: this.videoWsHost
    });
    this.playerSEI = new PlayerSEI(this.player, this.$refs.video as any, {
      showRect: this.showRect,
      colors
    }); // eslint-disable-line
    this.refreshInterval = setTimeout(() => {
      this.refreshInterval = null;
      this.handleVideoPlay();
    }, refreshTime);
  }

  play() {
    if (this.displayType === "image") {
      this.handleImageList(true);
    } else {
      this.initVideoPlayer();
    }
  }

  stop() {
    if (this.displayType === "image") {
      this.handleImageList(false);
    } else {
      this.destroyVideoPlayer();
    }
  }

  destroyVideoPlayer() {
    this.player && this.player.destroy();
    this.player = null;
    this.refreshInterval && clearTimeout(this.refreshInterval);
  }

  // image
  handleImageList(state) {
    if (state) {
      this.imgInterval = setInterval(() => {
        !this.imageFocus && this.handleImgNext();
      }, this.duration);
    } else {
      clearInterval(this.imgInterval);
      this.imgInterval = null;
    }
  }

  handleImgPre() {
    this.currentImgIndex--;
    if (this.currentImgIndex < 0) {
      this.currentImgIndex = this.imageList.length - 1;
    }
  }

  handleImgNext() {
    this.currentImgIndex++;
    if (this.currentImgIndex === this.imageList.length) {
      this.currentImgIndex = 0;
    }
  }

  getBase64(imagePosition) {
    let dom: any;
    let canvasWidth = 0;
    let canvasHeight = 0;
    if (this.displayType === "video") {
      dom = this.$el.querySelector(".rz-videoContainer__video video") as any;
      canvasWidth = dom && dom.videoWidth;
      canvasHeight = dom && dom.videoHeight;
      if (!canvasWidth || !canvasHeight) {
        return "";
      }
    } else {
      dom = this.$el.querySelector(
        ".rz-videoContainer__imglist--img.is-show"
      ) as any;
      canvasWidth = dom && dom.clientWidth;
      canvasHeight = dom && dom.clientHeight;
    }
    return getBase64FromCanvas(dom, canvasWidth, canvasHeight, imagePosition);
  }

  destroyed() {
    clearInterval(this.imgInterval);
  }
}
</script>
