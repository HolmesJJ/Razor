<template>
  <!-- 编写 mapTool 组件 -->
  <div class="rz-map-tool" :class="classes">
    <div class="rz-map-tool__reset" @click="handleClick">
      <img :src="resetIcon" alt="reset-ico" />
    </div>
    <div class="rz-map-tool__zoomin" @click="handleZoomin">
      <i class="rz-icon-plus"></i>
    </div>
    <div class="rz-map-tool__zoomout" @click="handleZoomout">
      <i class="rz-icon-minus"></i>
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  name: "MapTool"
})
export default class MapTool extends Vue {
  @Prop({
    type: String,
    default: "bottom-right"
  })
  position: string;

  resetIcon = require("./targeting.png");

  get classes() {
    return {
      "is-top-left": this.position === "top-left",
      "is-top-right": this.position === "top-right",
      "is-bottom-left": this.position === "bottom-left",
      "is-bottom-right": this.position === "bottom-right"
    };
  }

  handleClick() {
    this.$emit("reset");
  }

  handleZoomin() {
    this.$emit("zoom-in");
  }

  handleZoomout() {
    this.$emit("zoom-out");
  }
}
</script>
