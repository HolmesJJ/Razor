<template>
  <div class="rz-map-marker">
    <slot></slot>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch, Inject } from "vue-property-decorator";

import MapFactory from "../../sdk/factory";
import RazorMapMarker from "../../sdk/_abstract/marker";
import { MarkerConfig } from "../../types";

@Component({
  name: "MapMarker"
})
export default class RzMapMarker extends Vue {
  marker!: RazorMapMarker;

  @Inject() readonly getMap!: Function;

  @Prop([Array, Object]) position!:
    | [number, number]
    | { lng: number; lat: number };

  @Prop() offset!: { x: number; y: number };

  @Prop({ default: false }) draggable!: boolean;

  @Prop([String, Number, Object]) customData!: any;

  @Prop({ type: Boolean, default: true }) visible!: boolean;

  @Watch("position")
  onPositionChange(
    newPosition: [number, number] | { lng: number; lat: number }
  ) {
    this.marker && this.marker.setPosition(newPosition);
  }

  @Watch("draggable")
  setDraggable(draggable: boolean) {
    this.marker && this.marker.setDraggable(draggable);
  }

  @Watch("offset", { deep: true })
  setOffset(newOffset: { x: number; y: number }) {
    this.marker && this.marker.setOffset(newOffset);
  }

  @Watch("visible")
  onVisibleChange(val) {
    if (!val) {
      this.marker.hideMarker();
    } else {
      this.marker.showMarker();
    }
  }

  created() {
    this.getMap(async (map: any, type: string) => {
      this.marker = await MapFactory.createMarker(type, map);

      let markerConfig: MarkerConfig = {
        position: this.position,
        offset: this.offset,
        customData: this.customData
      }
      if (this.$slots.default) {
        markerConfig.customElement = this.$slots.default[0].elm;
      }
      this.marker.addMarker(markerConfig, this.$listeners);
      this.setDraggable(this.draggable);
      this.offset && this.setOffset(this.offset);
      if (!this.visible) this.marker.hideMarker();
      this.$emit("ready", this.customData);
    });
  }

  beforeDestroy() {
    this.marker && this.marker.removeMarker();
  }
}
</script>
