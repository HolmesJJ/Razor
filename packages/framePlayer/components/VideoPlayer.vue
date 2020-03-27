<template>
  <div class="rz-videoFilePlayer">
    <video :src="videoUrl" :id="videoPlayerId" :autoPlay="autoPlay" muted ref="video"></video>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator";

// utils
// import PlayerSEI from "pkg/rtspPlayer/libs/player_SEI";
import { getRandomId } from "pkg/rtspPlayer/libs/util";

@Component({
  name: "VideoPlayer"
})
export default class VideoPlayer extends Vue {
  @Prop({ default: "" }) videoUrl: string;

  @Prop({ default: false }) autoPlay: boolean;

  @Prop({ default: false }) drawRect: boolean;

  @Prop({ default: false }) showAttrsInfo: boolean;

  @Prop({
    default() {
      return [
        "blue",
        "red",
        "blue",
        "blue",
        "blue",
        "blue",
        "blue",
        "blue",
        "blue",
        "blue",
        "blue",
        "blue"
      ];
    }
  })
  colors: string[];

  @Prop({ default: 2 }) rectWidth: number;

  videoPlayerId = getRandomId();

  player: any;

  // playerSEI: any;

  // @Watch("drawRect")
  // whenNeedToDrawRect(val: boolean) {
  //   if (this.playerSEI) {
  //     this.playerSEI.setShowRect(val);
  //   }
  // }
  // @Watch("showAttrsInfo")
  // onShowAttrsInfoChange(val: boolean) {
  //   if (this.playerSEI) {
  //     this.playerSEI.setShowAttrInfo(val);
  //   }
  // }

  initialVideoPlayer() {
    const refVideo = this.$refs.video as HTMLVideoElement;
    refVideo.play();
  }

  refreshVideoPlayer() {
    if (this.player) {
      this.destroyVideoPlayer();
    }
    this.initialVideoPlayer();
  }

  destroyVideoPlayer() {
    this.player && this.player.destroy();
    this.player = null;
  }

  // initialPlayerSEI() {
  //   // const colors = ["blue", "green", "red", "yellow", "orange"];
  //   this.playerSEI = new PlayerSEI(this.player, this.$refs.video as any, {
  //     showRect: this.drawRect,
  //     showAttrsInfo: this.showAttrsInfo,
  //     colors: this.colors,
  //     rectWidth: this.rectWidth,
  //   });
  // }

  play() {
    this.initialVideoPlayer();
  }

  stop() {
    const refVideo = this.$refs.video as HTMLVideoElement;
    refVideo.pause();
  }

  // changeVideoSize() {
  //   this.$nextTick(() => {
  //     if (this.playerSEI) {
  //       this.playerSEI.updateCanvas();
  //     }
  //   });
  // }

  mounted() {
    // if (this.drawRect) {
    //   this.initialPlayerSEI();
    // }
    const refVideo = this.$refs.video as HTMLVideoElement;

    refVideo.addEventListener("loadedmetadata", event => {
      this.$emit("inner-loaded", {
        width: refVideo.videoWidth,
        height: refVideo.videoHeight
      });
      this.$emit("loadedmetadata", event);
    });
    if (this.autoPlay) {
      this.play();
    }
  }

  beforeDestroy() {
    this.destroyVideoPlayer();
  }
}
</script>
