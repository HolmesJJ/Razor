<template>
  <div class="rz-rtsp-player">
    <video :id="videoPlayerId" autoplay muted ref="video">
      <source :src="videoUrl" type="application/x-rtsp" />
    </video>
  </div>
</template>

<script lang='ts'>

import { Vue, Component, Prop, Watch } from "vue-property-decorator";

// utils
import PlayerSEI from "../libs/player_SEI";
import { getRandomId } from "../libs/util";
import { drawRect } from "../../../src/utils/canvas/utils";

const RefreshTime = 15 * 60 * 1000; // 15min

@Component({
  name: "RtspPlayer"
})
export default class RtspPlayer extends Vue {
  @Prop({ default: "" }) videoUrl: string;

  @Prop({ default: "" }) videoWsHost: string;

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

  playerSEI: any;

  refreshInterval: any;

  @Watch("drawRect")
  whenNeedToDrawRect(val: boolean) {
    if (this.playerSEI) {
      this.playerSEI.setShowRect(val);
    }
  }
  @Watch("showAttrsInfo")
  onShowAttrsInfoChange(val: boolean) {
    if (this.playerSEI) {
      this.playerSEI.setShowAttrInfo(val);
    }
  }

  initialVideoPlayer() {
    this.player = (window as any).Streamedian.player(this.videoPlayerId, {
      socket: this.videoWsHost
    });

    const refVideo = this.$refs.video as HTMLVideoElement;

    refVideo.addEventListener("loadedmetadata", event => {
      this.$emit("inner-loaded", {
        width: refVideo.videoWidth,
        height: refVideo.videoHeight
      });
      this.$emit("loadedmetadata", event);
    });

    if (this.drawRect) {
      this.initialPlayerSEI();
    }

    this.refreshInterval = setTimeout(() => {
      this.refreshVideoPlayer();
    }, RefreshTime);
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
    this.refreshInterval && clearTimeout(this.refreshInterval);
  }

  initialPlayerSEI() {
    if (this.player) {
      // const colors = ["blue", "green", "red", "yellow", "orange"];
      this.playerSEI = new PlayerSEI(this.player, this.$refs.video as any, {
        showRect: this.drawRect,
        showAttrsInfo: this.showAttrsInfo,
        colors: this.colors,
        rectWidth: this.rectWidth
      });
    }
  }

  play() {
    this.initialVideoPlayer();
  }

  stop() {
    this.destroyVideoPlayer();
  }

  changeVideoSize(){
    this.$nextTick(()=>{
      if (this.playerSEI) {
        this.playerSEI.updateCanvas();
      }
    })
  }

  mounted() {
    if (this.autoPlay) {
      this.play();
    }
  }

  beforeDestroy() {
    this.destroyVideoPlayer();
  }
}
</script>
