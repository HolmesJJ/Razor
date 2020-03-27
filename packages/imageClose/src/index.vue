<template>
  <div class="rz-image-close" style="position:relative">
    <rz-image :src="src" :width="width" :height="height" :bounding="bounding"></rz-image>
    <rz-close @click="emitClose"></rz-close>
  </div>
</template>

<script lang='ts'>

import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import RzImage from "pkg/image";
import RzClose from "pkg/close";
import { Boundings } from "pkg/image/src/imageCalculator";

import has from "lodash/has";

@Component({
  name: "ImageClose",
  components: {
    RzImage,
    RzClose
  }
})
export default class ImageClose extends Vue {
  @Prop() src!: string;

  @Prop() width!: string;

  @Prop() height!: string;

  @Prop() info!: string;

  @Prop({ default: false }) showInfo!: boolean;

  @Prop({
    validator(value) {
      const pass = has(value, "start") && has(value, "end");
      return pass;
    }
  })
  bounding!: Boundings;

  @Prop({ default: false }) actived?: boolean;

  @Emit("close")
  emitClose(event) {
    return event;
  }
}
</script>
