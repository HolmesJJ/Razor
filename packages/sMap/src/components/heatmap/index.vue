<template>
  <div class="rz-map-heatmap"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject, Watch } from "vue-property-decorator";

import { HeatmapPoint } from "../../types/heatmap";
import MapFactory from "../../sdk/factory";
import RazorMapHeatmap from "../../sdk/baidu/heatmap";

@Component({
  name: "MapHeatmap"
})
export default class RzMapHeatmap extends Vue {
  @Inject() readonly getMap: Function;

  @Prop({
    default() {
      return [];
    }
  })
  data: HeatmapPoint[];

  @Prop({ default: 100 }) max: number;

  @Prop({ default: 50 }) radius: number;

  @Prop({
    default() {
      return {
        0: "rgb(102, 255, 0)",
        0.5: "rgb(255, 170, 0)",
        1: "rgb(255, 0, 0)"
      };
    }
  })
  gradient: object;

  @Prop({ default: 50 }) opacity: number;

  heatmap: RazorMapHeatmap;

  @Watch("max")
  onMaxChange(val: number) {
    const { data, gradient, radius, opacity } = this;
    this.heatmap.reload(data, val, { gradient, radius, opacity });
  }

  @Watch("radius")
  onRadiusChange(val: number) {
    const { gradient, opacity } = this;
    this.heatmap.setConfig({
      radius: val,
      gradient,
      opacity
    });
  }

  @Watch("gradient", { deep: true })
  onGradientChange(val: object) {
    const { radius, opacity } = this;
    this.heatmap.setConfig({
      radius,
      gradient: val,
      opacity
    });
  }

  @Watch("opacity")
  onOpacityChange(val: number) {
    const { gradient, radius } = this;
    this.heatmap.setConfig({
      radius,
      gradient,
      opacity: val
    });
  }

  @Watch("data")
  onDataChange(val: HeatmapPoint[]) {
    const { gradient, radius, opacity } = this;
    this.heatmap.reload(val, this.max, { gradient, radius, opacity });
  }

  created() {
    this.getMap(async (map: any, type: string) => {
      const { radius, gradient, opacity } = this;
      this.heatmap = await MapFactory.createHeatmap(type, map, {
        radius,
        gradient,
        opacity
      });
      this.heatmap.addHeatmap(this.data, this.max);
    });
  }

  // 更新热力图
  refreshHeatMap() {
    const { max, data, gradient, radius, opacity } = this;
    this.heatmap.reload(data, max, { gradient, radius, opacity });
  }

  beforeDestroy() {
    this.heatmap.destroyHeatmap();
  }
}
</script>