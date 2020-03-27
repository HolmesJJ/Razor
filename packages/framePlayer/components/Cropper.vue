<template>
  <div class="rz-frame-player__cropper" ref="cropper">
    <!-- 垫一层 -->
    <div class="rz-frame-player__cropper-bg">
      <img :src="imageSrc" alt="cropper-bg" />
    </div>

    <!-- 蒙层 -->
    <div class="rz-frame-player__cropper-mask" ref="mask"></div>

    <!-- 截图框 -->
    <div class="rz-frame-player__cropper-box" v-if="renderCropBox" ref="cropBox">
      <div class="rz-frame-player__cropper-box-wrapper">
        <img :src="imageSrc" alt="cropper" ref="cropImage" :draggable="false" />
      </div>
    </div>

    <div class="rz-frame-player__cropper-ops"></div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class FramePlayerCropper extends Vue {
  @Prop(String) imageSrc: string;

  renderCropBox: boolean = false;

  renderCropOperation: boolean = false;
}
</script>