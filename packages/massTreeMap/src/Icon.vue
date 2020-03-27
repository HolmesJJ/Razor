<template>
  <rz-tooltip
    :value="show"
    placement="top"
    :visible-arrow="true"
    :content="content"
    :open-delay="0"
  >
    <img
      class="rz-tree-map-icon"
      :class="{'is-active': this.isSelected}"
      :src="imgSrc"
      alt="icon"
      @mouseover="handleMouseover"
      @mouseout="handleMouseout"
    />
  </rz-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

import RzTooltip from "pkg/tooltip";

import iconUrl from "../assets/map_track_n.png";
import iconHoverUrl from "../assets/mapPoints.png";
import iconClickUrl from "../assets/map_track_s.png";

@Component({
  name: "RzTreeMapIcon",
  components: {
    RzTooltip
  }
})
export default class RzTreeMapIcon extends Vue {
  @Prop() camera: any;

  @Prop(Boolean) isSelected: boolean;

  @Prop(String) content: string;

  @Prop(Boolean) showTooltip: boolean;

  @Prop(String) clickedCameraSerial: string;

  show: boolean = false;

  isHover: boolean = false;

  imgSrc: string = iconUrl;

  @Watch("isSelected", { immediate: true })
  onIsSelectedChange(val) {
    if (val) {
      this.imgSrc = iconClickUrl;
    } else {
      this.imgSrc = iconUrl;
    }
  }

  @Watch("isHover")
  onIsHoverChange(val) {
    if (val) {
      this.imgSrc = iconHoverUrl;
      this.show = true;
    } else {
      this.show = false;
      if (this.isSelected) {
        this.imgSrc = iconClickUrl;
      } else {
        this.imgSrc = iconUrl;
      }
    }
  }

  @Watch("clickedCameraSerial")
  onClickedChange(val: string) {
    this.show = val === this.camera.resourceSerial;
  }

  handleMouseover() {
    this.isHover = true;
  }

  handleMouseout() {
    this.isHover = false;
  }

  mounted() {
    this.$nextTick(() => {
      if (this.camera) {
        this.show = this.clickedCameraSerial === this.camera.resourceSerial;
      }
    });
  }
}
</script>
