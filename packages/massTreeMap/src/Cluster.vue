<template>
  <div class="tree-map-cluster" :style="clusterStyle">
    <div class="tree-map-cluster__content" ref="content">{{content}}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({
  name: "RzMassTreeMapCluster"
})
export default class RzMassTreeMapCluster extends Vue {
  @Prop() camera: any;

  refContent: any;

  contentWidth: number = 0;

  defaultPadding: number = 16;

  minWidth: number = 54;

  get pointCount() {
    return this.camera.properties.point_count;
  }

  get isSelected() {
    return this.camera.properties.isSelected;
  }

  get content() {
    return this.isSelected
      ? `${this.isSelected}/${this.pointCount}`
      : `${this.pointCount}`;
  }

  get bgColor() {
    return this.isSelected
      ? "rgba(77, 169, 113, 0.7)"
      : "rgba(62, 150, 215, 0.7)";
  }

  get clusterStyle() {
    const padding = 24;
    return {
      width: this.contentWidth + padding + "px",
      height: this.contentWidth + padding + "px",
      backgroundColor: this.bgColor,
      fontSize: this.isSelected ? "14px" : "20px"
    };
  }

  mounted() {
    this.$nextTick(() => {
      this.refContent = this.$refs.content as Element;
      const contentStyle = getComputedStyle(this.refContent);
      const computedWidht = parseInt(contentStyle.width);
      this.contentWidth =
        computedWidht > this.minWidth ? computedWidht : this.minWidth;
    });
  }
}
</script>