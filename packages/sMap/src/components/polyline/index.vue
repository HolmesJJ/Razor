<template>
  <div class="rz-map-polyline"></div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch, Inject } from "vue-property-decorator";
import { Point } from "../../types";

import MapFactory from "../../sdk/factory";

import RazorMapPolyline from "../../sdk/_abstract/polyline";

@Component({
  name: "MapPolyline"
})
export default class RzMapPolyline extends Vue {
  polyline!: RazorMapPolyline;

  @Inject() readonly getMap!: Function;

  @Prop({ type: Boolean, default: false }) readonly curve!: boolean;

  @Prop(Array) path!: Point[];

  @Prop({ type: String, default: "red" }) strokeColor!: string;

  @Prop({ type: [String, Number], default: 2 }) strokeWeight!: string | number;

  @Prop({ type: [String, Number], default: 1 }) strokeOpacity!: string | number;

  @Prop({ type: String, default: "solid" }) strokeStyle!: "solid" | "dashed";

  @Prop({ type: Boolean, default: true }) enableClicking!: boolean;

  @Prop({ type: Boolean, default: true }) draw!: boolean;

  @Prop({ type: Boolean, default: false }) visible!: boolean;

  @Prop({ type: Boolean, default: false }) arrow!: boolean;

  get options() {
    return {
      strokeColor: this.strokeColor,
      strokeWeight: this.strokeWeight,
      strokeOpacity: this.strokeOpacity,
      strokeStyle: this.strokeStyle,
      enableClicking: this.enableClicking,
      curve: this.curve,
      arrow: this.arrow
    };
  }

  @Watch("path", { deep: true })
  onPathChange() {
    this.$nextTick(()=>{
      this.mapZoomHandler()
    })
  }

  @Watch("strokeColor")
  onStrokeColorChange(color: string) {
    this.polyline && this.polyline.setStrokeColor(color);
  }

  @Watch("strokeWeight")
  onStrokeWeight(weight: string | number) {
    this.polyline && this.polyline.setStrokeWeight(Number(weight));
  }

  @Watch("strokeOpacity")
  onStrokeOpacityChange(opacity: string | number) {
    this.polyline && this.polyline.setStrokeOpacity(Number(opacity));
  }

  @Watch("strokeStyle")
  onStrokeStyleChange(style: "solid" | "dashed") {
    this.polyline && this.polyline.setStrokeStyle(style);
  }

  @Watch("draw")
  onDrawStatusChange(val) {
    if (val) {
      this.polyline.addPolyline(this.path, this.options);
    } else {
      this.polyline.removePolyline();
    }
  }

  @Watch("visible")
  onVisibleChange(val) {
    if (!val) {
      this.polyline.removePolyline();
    } else {
      this.mapZoomHandler();
    }
  }

  created() {
    this.getMap(async (map: any, type: string) => {
      this.polyline = await MapFactory.createPolyline(type, map);
      if (this.draw) this.polyline.addPolyline(this.path, this.options);
      if (!this.visible) this.polyline.hidePolyline();
      map.addEventListener("zoomend", this.mapZoomHandler);
    });
  }

  beforeDestroy() {
    this.polyline.removePolyline();
    this.getMap(async (map: any) => {
      map.removeEventListener("zoomend", this.mapZoomHandler);
    });
  }

  mapZoomHandler() {
    this.polyline.removePolyline();
    if (this.draw) this.polyline.addPolyline(this.path, this.options);
    if (!this.visible) this.polyline.hidePolyline();
  }
}
</script>
