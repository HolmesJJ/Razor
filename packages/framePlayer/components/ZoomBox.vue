<template>
  <div
    class="rz-frame-player__zoom-box"
    ref="zoombox"
    :style="zoomboxStyle"
    @wheel="handleZoom"
    @mousedown="handleMoveStart"
  >
    <!-- 画布 -->
    <canvas
      ref="cropCanvas"
      v-if="activeCrop"
      v-show="false"
      :width="outerWidth"
      :height="outerHeight"
    ></canvas>

    <div class="rz-frame-player__cropper" v-if="renderCrop">
      <!-- 垫一层 -->
      <div class="rz-frame-player__cropper-bg">
        <img :src="cropBgSrc" alt="bg" crossorigin="anonymous" :draggable="false" />
      </div>

      <!-- 蒙层 -->
      <div class="rz-frame-player__cropper-mask" ref="mask"></div>

      <!-- 截图框 -->
      <div
        v-if="renderCropBox"
        class="rz-frame-player__cropper-box"
        :style="cropBoxStyle"
        ref="cropbox"
      >
        <div class="rz-frame-player__cropper-box-wrapper">
          <img
            :src="cropBgSrc"
            crossorigin="anonymous"
            alt="bg"
            :style="cropBoxImageStyle"
            ref="cropImage"
            :draggable="false"
          />
        </div>

        <div v-show="renderCropBoxOperationBar" class="rz-frame-player__cropper-box-corner nw"></div>
        <div v-show="renderCropBoxOperationBar" class="rz-frame-player__cropper-box-corner w"></div>
        <div v-show="renderCropBoxOperationBar" class="rz-frame-player__cropper-box-corner sw"></div>
        <div v-show="renderCropBoxOperationBar" class="rz-frame-player__cropper-box-corner n"></div>
        <div v-show="renderCropBoxOperationBar" class="rz-frame-player__cropper-box-corner ne"></div>
        <div v-show="renderCropBoxOperationBar" class="rz-frame-player__cropper-box-corner e"></div>
        <div v-show="renderCropBoxOperationBar" class="rz-frame-player__cropper-box-corner se"></div>
        <div v-show="renderCropBoxOperationBar" class="rz-frame-player__cropper-box-corner s"></div>
      </div>

      <!-- 操作栏 -->
      <div
        class="rz-frame-player__cropper-ops"
        v-show="renderCropBoxOperationBar"
        ref="cropOpBar"
        :style="cropOperationBarStyle"
      >
        <div
          class="rz-frame-player__operation"
          v-for="(op, index) in cropOperations"
          :key="index"
          @click="clickMethodWrapper(op.onClick, op)"
        >
          <span>{{ op.label }}</span>
          <rz-icon :label="childrenIcon" v-if="op.children"></rz-icon>
          <div
            v-if="op.children"
            class="rz-frame-player__sub-operation"
            ref="subOperation"
            :class="subOperationClass"
            :style="{ top: subCropOperationBar.top + 'px' }"
          >
            <div>
              <div
                class="rz-frame-player__operation"
                v-for="(sop, index) in op.children"
                :key="index"
                @click="clickMethodWrapper(sop.onClick, sop)"
              >
                <span>{{ sop.label }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="rz-frame-player__operation" @click="cancelCrop">{{ t("el.framePlayer.cancel") }}</div>
      </div>
    </div>

    <div
      class="rz-frame-player__zoom-box-inner"
      v-show="!activeCrop"
      ref="inner"
      :style="innerStyle"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

import RzIcon from "pkg/icon";

import { swallowEvent } from "rz/utils/util";
import { rectifyNumRange, numRangeRectify } from "../libs/utils";

import {
  getRatio,
  getBenchmark,
  getScaleValue,
  Size
} from "pkg/image/src/utils";

import { getInt } from "../libs/utils";

import { getBase64FromCanvas, downloadFile, getCanvas } from "rz/utils/img";
import { resolve } from "dns";

import Locale from "rz/mixins/locale";

@Component({
  name: "FramePlayerZoomBox",
  components: {
    RzIcon
  },

  mixins: [Locale]
})
export default class FramePlayerZoomBox extends Vue {
  readonly t: (name: string) => string;
  // 外部容器的高宽
  @Prop() outerHeight: number;

  @Prop() outerWidth: number;

  @Prop({ default: true }) canZoom: boolean;

  @Prop() playType: "video" | "image" | "videoFile";

  @Prop({ default: false }) activeCrop: boolean;

  @Prop() cropOperations: {
    label: string;
    onClick: (base64: string) => void;
    children?: {
      label: string;
      onClick: (base64: string) => void;
    }[];
  }[];

  @Prop() menuClicked: (op) => void;

  @Prop() innerSize: Size;

  @Prop() childrenIcon: string;

  // 记录缩放
  scale: number = 1; // 缩放倍数

  maxScale: number = 4;

  minScale: number = 1;

  transformX = 0;

  transformY = 0;

  lastX: number = 0;

  lastY: number = 0;

  refInner: Element;

  refZoombox: Element;

  canToZoom: boolean = this.canZoom;

  renderCrop: boolean = false;

  renderCropBox: boolean = false;

  renderCropBoxOperationBar: boolean = false;

  cropBgSrc: string = "";

  resizeFnCache: any = null;

  // 用于记录cropbox移动之前的点
  prevPoint = null;

  cropBox = {
    center: {
      x: 0,
      y: 0
    },
    left: 0,
    top: 0,
    width: 0,
    height: 0
  };

  cropOperationBar = {
    left: 0,
    top: 0,
    width: 88,
    height: 0
  };

  subCropOperationBar = {
    direction: "right",
    top: 0
  };

  cropBoxCenterBounding = {
    bLeft: 0,
    bTop: 0,
    bRight: 0,
    bBottom: 0
  };

  cropContext: any;

  get cropBoxStyle() {
    const { left, top, width, height } = this.cropBox;
    return {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`
    };
  }

  get cropBoxImageStyle() {
    return {
      left: `${-this.cropBox.left}px`,
      top: `${-this.cropBox.top}px`
    };
  }

  get zoomboxStyle() {
    return {
      width: `${this.outerWidth}px`,
      height: `${this.outerHeight}px`
    };
  }

  get cropOperationBarStyle() {
    return {
      left: `${this.cropOperationBar.left}px`,
      top: `${this.cropOperationBar.top}px`
    };
  }

  get innerStyle() {
    return {
      width: `${getInt(this.outerWidth * this.scale)}px`,
      height: `${getInt(this.outerHeight * this.scale)}px`,
      top: `${this.transformY}px`,
      left: `${this.transformX}px`
    };
  }

  get canvasWidth() {
    return getInt(this.outerWidth * this.scale);
  }

  get canvasHeight() {
    return getInt(this.outerHeight * this.scale);
  }

  get scaleInfo() {
    return {
      scale: this.scale,
      transformX: this.transformX,
      transformY: this.transformY
    };
  }

  get subOperationClass() {
    return this.subCropOperationBar.direction === "left"
      ? "is-left"
      : "is-right";
  }

  @Watch("activeCrop")
  onCrop(val) {
    if (val) {
      this.canToZoom = false;
      this.$nextTick(() => {
        this.handleCrop();
      });
    } else {
      this.resetState();
    }
  }

  handleZoom(event: WheelEvent | number) {
    if (!this.canToZoom || !this.canZoom) {
      return;
    }

    let center = { x: 0, y: 0 };
    let scaleValue: number;

    if (event instanceof WheelEvent) {
      swallowEvent(event);
      const isZoomIn = event.deltaY < 0;

      let newScale = this.scale + 0.1 * (isZoomIn ? 1 : -1);

      if (newScale > this.maxScale) newScale = this.maxScale;
      else if (newScale < this.minScale) newScale = this.minScale;

      const { left, top } = (this.$refs
        .zoombox as Element).getBoundingClientRect();

      // 当前方案下， center point的计算有误，需要用clientX和clientY和配合容器定位计算
      center.x = event.clientX - left;
      center.y = event.clientY - top;

      scaleValue = newScale / this.scale;
      this.scale = parseFloat(newScale.toFixed(1));
    } else {
      scaleValue = event / this.scale;
      center.x = this.outerWidth / 2;
      center.y = this.outerHeight / 2;
      this.scale *= scaleValue;
    }

    let transformX = (center.x - this.transformX) * scaleValue;
    let transformY = (center.y - this.transformY) * scaleValue;
    this.transformX = rectifyNumRange(
      center.x - transformX,
      0,
      this.outerWidth * (1 - this.scale),
      numRangeRectify.OUTSIDE
    );

    this.transformY = rectifyNumRange(
      center.y - transformY,
      0,
      this.outerHeight * (1 - this.scale),
      numRangeRectify.OUTSIDE
    );

    this.$emit("zoom", this.scaleInfo);
  }

  // 放大
  zoomIn() {
    const scale = this.scale + 0.5;

    if (scale > this.maxScale) {
      return;
    }

    this.handleZoom(scale);
  }

  // 缩小
  zoomOut() {
    const scale = this.scale - 0.5;

    if (scale < this.minScale) {
      return;
    }

    this.handleZoom(scale);
  }

  // 重置缩放大小
  resetZoom() {
    const scale = 1;
    this.handleZoom(scale);
  }

  resetState() {
    this.canToZoom = true;
    this.renderCrop = false;
    this.renderCropBox = false;
    this.renderCropBoxOperationBar = false;

    // 重置框位置
    this.cropBox = {
      center: {
        x: 0,
        y: 0
      },
      left: 0,
      top: 0,
      width: 0,
      height: 0
    };
  }

  handleMoveStart(event) {
    const maskTarget = this.$refs.mask;
    const cropImageTarget = this.$refs.cropImage;
    const isCorner = event.target.className.includes(
      "rz-frame-player__cropper-box-corner"
    );

    if (event.target === maskTarget) {
      // crop!
      this.handleCropStart(event);
    } else if (event.target === cropImageTarget) {
      // move crop box
      this.handleCropBoxMove(event);
    } else if (isCorner) {
      // resize crop box
      this.handleResizeStart(event, event.target.classList[1]);
    } else {
      // just move inner
      swallowEvent(event);
      this.lastX = event.pageX;
      this.lastY = event.pageY;
      document.addEventListener("mousemove", this.handleMove);
      document.addEventListener("mouseup", this.handleMoveEnd);
    }
  }

  handleMove(e) {
    swallowEvent(e);
    const nowX = e.pageX;
    const nowY = e.pageY;
    let moveX = nowX - this.lastX + this.transformX;
    let moveY = nowY - this.lastY + this.transformY;
    this.transformX = rectifyNumRange(
      moveX,
      0,
      this.outerWidth * (1 - this.scale),
      numRangeRectify.OUTSIDE
    );
    this.transformY = rectifyNumRange(
      moveY,
      0,
      this.outerHeight * (1 - this.scale),
      numRangeRectify.OUTSIDE
    );
    this.lastX = nowX;
    this.lastY = nowY;
  }

  handleMoveEnd(e) {
    this.handleMove(e);
    document.removeEventListener("mousemove", this.handleMove);
    document.removeEventListener("mouseup", this.handleMoveEnd);
  }

  getImageData() {
    const ctx = this.cropContext;
    const { left, top, width, height } = this.cropBox;

    const imageData = ctx.getImageData(left, top, width, height);
    return imageData;
  }

  getCropBase64(imageData: ImageData) {
    let canvas = document.createElement("canvas");
    const { width, height } = this.cropBox;
    canvas.width = width;
    canvas.height = height;
    // canvas.width = this.outerWidth;
    // canvas.height = this.outerHeight;
    let context = canvas.getContext("2d");
    context.putImageData(imageData, 0, 0, 0, 0, width, height);

    // 这个就是抠图所用的数据了
    const base64 = canvas.toDataURL("image/png");

    return base64;
  }

  getDom() {
    let elem = null;
    switch (this.playType) {
      case "video":
        elem = this.refInner.querySelector(".rz-rtsp-player video");
        break;
      case "image":
        elem = this.refInner.querySelector(".rz-frame-player__image-list img");
        break;
      case "videoFile":
        elem = this.refInner.querySelector(".rz-videoFilePlayer video");
        break;
    }
    return elem;
  }

  handleCrop() {
    const canvas = this.$refs.cropCanvas as HTMLCanvasElement;

    canvas.style.backgroundColor = "#090d16";

    const ctx = canvas.getContext("2d");

    const dom: any = this.getDom();

    let { width, height, delta } = this.getCropElementSize();

    const dWidth = width;
    const dHeight = height;
    const dx = delta.x;
    const dy = delta.y;
    const scale = this.scaleInfo.scale;

    ctx.scale(scale, scale);

    ctx.translate(this.transformX / scale, this.transformY / scale);

    ctx.drawImage(dom, dx, dy, dWidth, dHeight);

    this.cropContext = ctx;

    this.cropBgSrc = canvas.toDataURL("image/png");

    this.renderCrop = true; // 等加载的图片都渲染完了之后再显示截图框;
  }

  // 开始截图
  handleCropStart(event) {
    const { left, top } = this.refZoombox.getBoundingClientRect();

    this.cropBox.left = event.clientX - left;
    this.cropBox.top = event.clientY - top;

    this.cropBox.width = 0;
    this.cropBox.height = 0;

    document.addEventListener("mousemove", this.handleCropping);
    document.addEventListener("mouseup", this.handleCropEnd);
  }

  // 截图中
  handleCropping(event) {
    this.renderCropBox = true; // 当开始拖动后才显示截图框
    this.renderCropBoxOperationBar = false; // 截图过程中隐藏掉 操作栏

    const { left, top } = this.refZoombox.getBoundingClientRect();

    // 计算框位置
    const endLeft = event.clientX - left;
    const endTop = event.clientY - top;
    const width = endLeft - this.cropBox.left;
    const height = endTop - this.cropBox.top;

    const borderWidth = 2;

    this.cropBox.width = width < 0 ? 0 : width;
    this.cropBox.height = height < 0 ? 0 : height;

    this.cropBox.width =
      width + this.cropBox.left > this.outerWidth
        ? this.outerWidth - this.cropBox.left - borderWidth
        : width;
    this.cropBox.height =
      height + this.cropBox.top > this.outerHeight
        ? this.outerHeight - this.cropBox.top - borderWidth
        : height;

    this.getCropBounding();
  }

  getCropBounding() {
    const borderWidth = 2;
    // 确定cropBox可移动的范围
    let bLeft, bTop, bRight, bBottom;

    bLeft = borderWidth + this.cropBox.width / 2;
    bTop = borderWidth + this.cropBox.height / 2;
    bRight = -borderWidth + this.outerWidth - this.cropBox.width / 2;
    bBottom = -borderWidth + this.outerHeight - this.cropBox.height / 2;

    this.cropBoxCenterBounding = {
      bLeft,
      bTop,
      bRight,
      bBottom
    };

    this.cropBox.center = {
      x: this.cropBox.left + this.cropBox.width / 2,
      y: this.cropBox.top + this.cropBox.height / 2
    };
  }

  // 截图结束
  handleCropEnd(event) {
    this.handleCropping(event);
    this.calculateOperationBarInfo();
    document.removeEventListener("mousemove", this.handleCropping);
    document.removeEventListener("mouseup", this.handleCropEnd);
  }

  handleCropBoxMove(event) {
    const cropbox = this.$refs.cropbox as Element;

    const { left, top } = this.refZoombox.getBoundingClientRect();

    // 当前点位肯定在cropbox内
    const { clientX, clientY } = event;

    this.prevPoint = {
      left: clientX - left,
      top: clientY - top
    };

    cropbox.addEventListener("mousemove", this.handleCropBoxMoving);
    cropbox.addEventListener("mouseup", this.handleCropBoxMoveEnd);
  }

  handleCropBoxMoving(event) {
    this.renderCropBoxOperationBar = false; // 隐藏掉操作栏

    const { clientX, clientY } = event;

    const { left, top } = this.refZoombox.getBoundingClientRect();

    // const { width, height } = this.cropBox;

    let newX = clientX - left;
    let newY = clientY - top;

    // 计算偏移量
    const offset = {
      left: newX - this.prevPoint.left,
      top: newY - this.prevPoint.top
    };

    // 记录新的坐标点
    this.prevPoint = {
      left: newX,
      top: newY
    };

    // 移动中心点
    let newCenterX = this.cropBox.center.x + offset.left;
    let newCenterY = this.cropBox.center.y + offset.top;

    // 确保中心点在边界内
    const { bLeft, bTop, bRight, bBottom } = this.cropBoxCenterBounding;

    newCenterX =
      newCenterX < bLeft ? bLeft : newCenterX > bRight ? bRight : newCenterX;
    newCenterY =
      newCenterY < bTop ? bTop : newCenterY > bBottom ? bBottom : newCenterY;

    // 移动中心点
    const center = {
      x: newCenterX,
      y: newCenterY
    };

    this.cropBox.center = center;

    // 移动左上顶点
    this.cropBox.left = center.x - this.cropBox.width / 2;
    this.cropBox.top = center.y - this.cropBox.height / 2;
  }

  handleCropBoxMoveEnd(event) {
    const cropbox = this.$refs.cropbox as Element;

    this.handleCropBoxMoving(event);
    this.calculateOperationBarInfo();

    // 重置保留的点
    this.prevPoint = null;

    cropbox.removeEventListener("mousemove", this.handleCropBoxMoving);
    cropbox.removeEventListener("mouseup", this.handleCropBoxMoveEnd);
  }

  // 计算操作栏的位置
  calculateOperationBarInfo() {
    // 当截图框肉眼可见时才显示，不然没意义
    if (this.cropBox.width > 4 && this.cropBox.height > 2) {
      this.renderCropBoxOperationBar = true;
    } else {
      return;
    }

    this.$nextTick(() => {
      const refCropOpBar = this.$refs.cropOpBar as Element;
      // const style = getComputedStyle(refCropOpBar);
      const width = refCropOpBar.clientWidth; // 宽
      const height = refCropOpBar.clientHeight; // 高

      const margin = 8;

      const maxLeft = this.outerWidth - width;
      const maxTop = this.outerHeight - height;

      let left = this.cropBox.left + this.cropBox.width + margin;
      let subLeft = left + width + margin;

      if (left + width > this.outerWidth) {
        left = maxLeft;
      }

      // 判断子操作栏的出现方向
      if (subLeft + width > this.outerWidth) {
        this.subCropOperationBar.direction = "left";
      } else {
        this.subCropOperationBar.direction = "right";
      }

      let top = this.cropBox.top;
      if (top + height > this.outerHeight) {
        top = maxTop;
      }

      this.cropOperationBar.left = left;
      this.cropOperationBar.top = top;

      this.$nextTick(() => {
        const refSubCropOp = this.$refs.subOperation as Element[];
        refSubCropOp.forEach(scp => {
          const scpHeight = scp.clientHeight;

          // 这里很奇怪，同一高度，点击之后这里的值会改变，目前还未找到改变的原因
          const scpTop = scp.getBoundingClientRect().top;

          // console.log("scp", { height: scpHeight, top: scpTop });

          const zoomboxTop = this.refZoombox.getBoundingClientRect().top;

          // const top = scpTop - zoomboxTop;

          // console.log("top", top);
          const offset = zoomboxTop + this.outerHeight - (scpTop + scpHeight);

          if (offset < 0) {
            this.subCropOperationBar.top = offset;
          } else {
            this.subCropOperationBar.top = 0;
          }
        });
      });
    });
  }

  // 获取元素在容器内的真实高宽，以及偏移量, 用于在画布上绘制
  getCropElementSize() {
    let elmWidth, elmHeight;

    const { width, height } = this.getRealSize(this.innerSize);

    elmWidth = parseInt(width.toFixed(0));
    elmHeight = parseInt(height.toFixed(0));

    // 计算偏移量
    let delta = {
      x: 0,
      y: 0
    };

    delta.x = getInt((this.outerWidth - elmWidth) / 2);
    delta.y = getInt((this.outerHeight - elmHeight) / 2);

    return {
      width: elmWidth,
      height: elmHeight,
      delta
    };
  }

  handleResizeStart(event, direction) {
    this.renderCropBoxOperationBar = false;
    document.addEventListener("mousemove", this.handleResize(direction));
    document.addEventListener("mouseup", this.handleResizeEnd);
  }

  handleResize(direction) {
    this.resizeFnCache = event => {
      this.handleDirectionResize(event, direction);
    };

    return this.resizeFnCache;
  }

  handleResizeEnd(event) {
    this.resizeFnCache(event);
    this.calculateOperationBarInfo();

    this.getCropBounding();

    document.removeEventListener("mousemove", this.resizeFnCache);
    document.removeEventListener("mouseup", this.handleResizeEnd);

    this.resizeFnCache = null;
  }

  handleDirectionResize(event, direction) {
    let { clientX, clientY } = event;
    const { left, top } = this.refZoombox.getBoundingClientRect();

    if (clientX < left || clientX > left + this.outerWidth) {
      return;
    }

    if (clientY < top || clientY > top + this.outerHeight) {
      return;
    }

    const newLeft = clientX - left;
    const newTop = clientY - top;

    if (direction.includes("n")) {
      this.cropBox.height -= newTop - this.cropBox.top;
      this.cropBox.top = newTop;
    }

    if (direction.includes("s")) {
      this.cropBox.height = newTop - this.cropBox.top;
    }

    if (direction.includes("w")) {
      this.cropBox.width -= newLeft - this.cropBox.left;
      this.cropBox.left = newLeft;
    }

    if (direction.includes("e")) {
      this.cropBox.width = newLeft - this.cropBox.left;
    }
  }

  getRealSize(size: Size) {
    const containerSize = {
      width: this.outerWidth,
      height: this.outerHeight
    };

    const benchmark = getBenchmark(size, containerSize);

    const videoScaleValue = getScaleValue(containerSize, benchmark);

    return {
      width: size.width * videoScaleValue,
      height: size.height * videoScaleValue
    };
  }

  getScreenshot() {
    const p = new Promise(resolve => {
      const elm = this.getDom();
      if (this.playType === "video" || this.playType === "videoFile") {
        // const elm: HTMLVideoElement = this.refInner.querySelector(
        //   ".rz-rtsp-player video"
        // );
        const width = elm.videoWidth;
        const height = elm.videoHeight;
        const base64 = getBase64FromCanvas(elm, width, height);

        resolve(base64);
      } else {
        // const elm = this.refInner.querySelector(
        //   ".rz-frame-player__image-list img"
        // );
        const src = elm.getAttribute("src");

        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = src;

        image.onload = event => {
          const width = image.width;
          const height = image.height;
          const base64 = getBase64FromCanvas(image, width, height);
          resolve(base64);
        };
      }
    });

    return p;
  }

  download() {
    this.getScreenshot().then((base64: string) => {
      const filename = new Date().getTime().toString();
      downloadFile(filename, base64);
    });
  }

  cancelCrop() {
    this.renderCropBox = false;
    this.renderCropBoxOperationBar = false;
    this.$emit("cancel-crop");
  }

  clickMethodWrapper(onClick: (base64: string, op: any) => void, op: any) {
    const base64 = this.getCropBase64(this.getImageData());
    onClick && onClick.call(this, base64, op);
    if (typeof this.menuClicked === "function") {
      this.menuClicked(op);
    }
  }

  mounted() {
    this.refInner = this.$refs.inner as Element;
    this.refZoombox = this.$refs.zoombox as Element;
  }
}
</script>
