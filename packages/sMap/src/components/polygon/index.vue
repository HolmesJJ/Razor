<template>
  <div class="rz-map-polygon"></div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch, Inject } from "vue-property-decorator";
import { Point } from "../../types";

import MapFactory from "../../sdk/factory";

import RazorMapPolygon from "../../sdk/_abstract/polygon";

@Component({
  name: "MapPolygon"
})
export default class RzMapPolygon extends Vue {
  polygon!: RazorMapPolygon;

  @Inject() readonly getMap!: Function;

  @Prop(Array) path!: Point[];

  @Prop({ type: String, default: "red" }) strokeColor!: string;

  @Prop({ type: [String, Number], default: 2 }) strokeWeight!: string | number;

  @Prop({ type: [String, Number], default: 1 }) strokeOpacity!: string | number;

  @Prop({ type: String, default: "solid" }) strokeStyle!: "solid" | "dashed";

  @Prop({ type: String, default: "blue" }) fillColor!: string;

  @Prop({ type: Boolean, default: false }) visible!: boolean;

  // @Prop({ type: Boolean, default: true }) enableClicking!: boolean;

  @Watch("path", { deep: true })
  onPathChange(path: Point[]) {
    this.polygon && this.polygon.setPath(path);
  }

  @Watch("strokeColor")
  onStrokeColorChange(color: string) {
    this.polygon && this.polygon.setStrokeColor(color);
  }

  @Watch("strokeWeight")
  onStrokeWeight(weight: string | number) {
    this.polygon && this.polygon.setStrokeWeight(Number(weight));
  }

  @Watch("strokeOpacity")
  onStrokeOpacityChange(opacity: string | number) {
    this.polygon && this.polygon.setStrokeOpacity(Number(opacity));
  }

  @Watch("strokeStyle")
  onStrokeStyleChange(style: "solid" | "dashed") {
    this.polygon && this.polygon.setStrokeStyle(style);
  }

  @Watch("fillColor")
  onFillColorChange(color: string) {
    this.polygon && this.polygon.setFillColor(color);
  }

  @Watch("visible")
  onVisibleChange(val) {
    if (!val) {
      this.polygon.hidePolygon();
    } else {
      this.polygon.showPolygon();
    }
  }

  get options() {
    return {
      strokeColor: this.strokeColor,
      strokeWeight: Number(this.strokeWeight),
      strokeOpacity: Number(this.strokeOpacity),
      strokeStyle: this.strokeStyle,
      fillColor: this.fillColor
    };
  }

  created() {
    this.getMap(async (map: any, type: string) => {
      this.polygon = await MapFactory.createPolygon(type, map);
      this.polygon.addPolygon(this.path, this.options, this.$listeners);
      if (!this.visible) this.polygon.hidePolygon();
    });
  }

  destroyed() {
    this.polygon.removePolygon();
  }
}
</script>
