### RtspPlayer

:::demo

```html
<template>
  <div>
    <div>
      <p>
        <span>VideoWsHost</span>
        <rz-input v-model="videoWsHost"></rz-input>
      </p>
      <p>
        <span>Video Url</span>
        <rz-input v-model="videoUrl"></rz-input>
      </p>
    </div>
    <rz-rtsp-player
      ref="player"
      :videoUrl="videoUrl"
      :videoWsHost="videoWsHost"
      :autoPlay="autoPlay"
      :showAttrsInfo="showAttrsInfo"
      :colors="rectColors"
      :drawRect="drawRect"
    ></rz-rtsp-player>
    <rz-button type="primary" size="small" @click.native="handlePlay"
      >{{label}}</rz-button
    >
    <rz-on-off v-model="drawRect" active-text="画框"></rz-on-off>
  </div>
</template>

<script>
import { OBJECT_TYPE } from "./libs/previewinfo_config.js";

  export default {
    data() {
      return {
        isPlay: true,
        videoUrl:
          "rtsp://10.111.32.42:8554/CgQIARAmEjcI6AcSMgowCi5ydHNwOi8vMTAuMjI0LjMuMTk6NTU0LzEwMDAyMDE5MTIzMDAyMTIyMTUxODAx",
        videoWsHost: "ws://10.111.32.82:10219/rtsp-over-ws",
        autoPlay: true,
        showAttrsInfo: true,
        drawRect: true,
        rectColors:{
          [OBJECT_TYPE.FACE]:"#00E0FE",
          [OBJECT_TYPE.PEDESTRIAN]:"#8DCA3F",
          [OBJECT_TYPE.AUTOMOBILE]:"#F1B206",
          [OBJECT_TYPE.CYCLIST]:"#F1B206",
          [OBJECT_TYPE.HUMAN_POWERED_VEHICLE]:"#E5644E",
        },
      };
    },
    computed: {
      label() {
        return this.isPlay ? "暂停" : "播放";
      }
    },
    methods: {
      handlePlay() {
        if (this.isPlay) {
          this.$refs.player.stop();
        } else {
          this.$refs.player.play();
        }

        this.isPlay = !this.isPlay;
      }
    }
  };
</script>
```

:::
