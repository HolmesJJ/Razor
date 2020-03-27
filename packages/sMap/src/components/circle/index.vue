<template>
  <div class="rz-map-circle"></div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch, Inject } from "vue-property-decorator";
import { Point } from "../../types";

import MapFactory from "../../sdk/factory";

import RazorMapCircle from "../../sdk/_abstract/circle";

@Component({
  name: "MapCircle"
})
export default class RzMapCircle extends Vue {
  circle!: RazorMapCircle;

  @Inject() readonly getMap!: Function;

  @Prop([Array,Object]) center!: Point;

  @Prop() radius!: number;

  @Prop({ type: String, default: "#fff" }) fillColor!: string;

  @Prop({ type:[String, Number], default: 0.4 }) fillOpacity!: number;

  @Prop({ type: String, default: "#4285f4" }) strokeColor!: string;

  @Prop({ type: [String, Number], default: 2 }) strokeWeight!: string | number;

  @Prop({ type: [String, Number], default: 1 }) strokeOpacity!: string | number;

  @Prop({ type: String, default: "dashed" }) strokeStyle!: "solid" | "dashed";

  @Prop({ type: Boolean, default: true }) enableClicking!: boolean;

  @Prop({ type: Boolean, default: false }) visible!: boolean;

  get options() {
    return {
      fillColor: this.fillColor,
      fillOpacity: this.fillOpacity,
      strokeColor: this.strokeColor,
      strokeWeight: this.strokeWeight,
      strokeOpacity: this.strokeOpacity,
      strokeStyle: this.strokeStyle,
      enableClicking: this.enableClicking
    };
  }

  @Watch("center", { deep: true })
  onCenterChange(center: Point) {
    this.circle && this.circle.setCenter(center);
  }

  // @Watch("strokeColor")
  // onStrokeColorChange(color: string) {
  //   this.polyline && this.polyline.setStrokeColor(color);
  // }

  // @Watch("strokeWeight")
  // onStrokeWeight(weight: string | number) {
  //   this.polyline && this.polyline.setStrokeWeight(Number(weight));
  // }

  // @Watch("strokeOpacity")
  // onStrokeOpacityChange(opacity: string | number) {
  //   this.polyline && this.polyline.setStrokeOpacity(Number(opacity));
  // }

  // @Watch("strokeStyle")
  // onStrokeStyleChange(style: "solid" | "dashed") {
  //   this.polyline && this.polyline.setStrokeStyle(style);
  // }
  @Watch("visible")
  handleCircleVisibleChange(val) {
    if (val) {
      this.circle.addCircle(this.center, this.radius, this.options);
    } else {
      this.circle.removeCircle();
    }
  }

  created() {
    this.getMap(async (map: any, type: string) => {
      this.circle = await MapFactory.createCircle(type, map);

      this.visible && this.circle.addCircle(this.center, this.radius, this.options);
    });
  }

  destroyed() {
    this.circle.removeCircle();
  }
}
</script>
