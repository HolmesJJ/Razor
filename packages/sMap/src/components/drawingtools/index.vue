<template>
  <div></div>
</template>

<script lang="ts">

import { Vue, Component, Inject, Prop, Watch } from "vue-property-decorator";
import MapFactory from "../../sdk/factory";
import { PolygonOptions } from "../../types";

@Component({
  name: "MapDrawingTools"
})
export default class RzMapDrawingTools extends Vue {
  drawingManager!: any;

  @Inject() readonly getMap!: Function;

  @Prop() mode!: string;
  
  @Prop() styleOptions!: PolygonOptions;

  @Prop() keepOverlay!: boolean;

  @Prop() drawingOnce!: boolean; // 仅绘制一次就退出绘制状态

  mounted() {
    this.getMap(async (map: any, type: string) => {
      this.drawingManager = await MapFactory.createDrawingManager(type, map);
      this.drawingManager.init(this.styleOptions, this.$listeners);
      if (this.mode) {
        this.drawingManager.draw(this.mode);
      }
      if (this.keepOverlay) {
        this.drawingManager.setKeepOverlay(this.keepOverlay);
      }
      if (this.drawingOnce) {
        this.drawingManager.setDrawingOnce(this.drawingOnce);
      }
    });
  }

  @Watch('mode')
  onDrawingModeChange() {
    this.drawingManager.draw(this.mode);
  }

  @Watch('keepOverlay')
  onKeepOverlayChange() {
    this.drawingManager.setKeepOverlay(this.keepOverlay);
  }

  @Watch('drawingOnce')
  onDrawingOnceChange() {
    this.drawingManager.setDrawingOnce(this.drawingOnce);
  }

  clearAll() {
    this.drawingManager.clearAll();
  }

  beforeDestroy() {
    // drawing manager destroy
    // destroy drawing manager instance
  }
}
</script>
