<template>
  <div class="rz-s-image" :style="containerStyle">
    <div v-if="showImageHolder" class="rz-s-image__placeholder">
      <img :src="imageHolderSrc" alt="empty" :style="placeholderStyle" />
    </div>

    <div v-else class="rz-s-image__container" :style="containerStyle">
      <div ref="wrapper" class="rz-s-image__wrapper" :style="wrapperStyle" :draggable="draggable"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

import ScaleCalculator, {
  Size,
  Bounding,
  Offset
} from "./libs/ScaleCalculator";

import ZoomController from "./libs/ZoomController";

import * as Util from "./libs/utils";

import has from "lodash/has";

const defaultEmptyPicBase64 = Util.getDefaultEmptyPicBase64();

@Component({
  name: "SImage"
})
export default class SImage extends Vue {
  @Prop({
    required: true
  })
  src: string;

  @Prop({
    required: true
  })
  width: string | number;

  @Prop({
    required: true
  })
  height: string | number;

  @Prop() bounding: Bounding;

  @Prop({ default: 0.2 }) ratioError: number;

  @Prop({ default: false }) allowZoom: boolean;

  @Prop({ default: true }) draggable: boolean;

  @Prop(String) type: string;

  @Prop({
    type: Number,
    default: 100
  }) flexbase: number;

  @Prop({
    type: Boolean,
    default: true
  }) flexable: boolean;

  @Prop({
    type: String,
    default: defaultEmptyPicBase64
  })
  emptySrc: string;

  @Prop({
    type: String,
    default: defaultEmptyPicBase64
  })
  loadingSrc: string;

  // emptySrc: string = require("pkg/theme/dark/img/NoPicture.png");

  isLoading: boolean = true;
  @Prop()
  converter!: Function;

  isError: boolean = true;

  imgSize: Size = {
    width: 0,
    height: 0
  };

  imgOffset: Offset = {
    top: 0,
    left: 0
  };

  wrapperSize: Size = {
    width: 0,
    height: 0
  };

  boundingSize: Size = {
    width: 0,
    height: 0
  };

  currentBounding: Bounding = this.bounding;

  scaleValue: number = 1;

  zc: ZoomController;

  get containerStyle() {
    return {
      width: this.getSize(this.width),
      height: this.getSize(this.height)
    };
  }

  get hasBounding(): boolean {
    return (
      this.bounding && has(this.bounding, "start") && has(this.bounding, "end")
    );
  }

  get bgStyle() {
    if (this.hasBounding || this.type === 'face') {

      const bgWidth = this.getSize(this.imgSize.width);
      const bgHeight = this.getSize(this.imgSize.height);
      const bpLeft = this.getSize(-this.imgOffset.left);
      const bpTop = this.getSize(-this.imgOffset.top);

      return {
        backgroundSize: `${bgWidth} ${bgHeight}`,
        backgroundPosition: `${bpLeft} ${bpTop}`
      };
    } else {
      return { backgroundSize: "100% 100%" };
    }
  }

  get wrapperStyle() {
    return Object.assign(
      {
        width: this.getSize(this.wrapperSize.width),
        height: this.getSize(this.wrapperSize.height),
        backgroundImage: `url(${this.src})`,
        backgroundRepeat: "no-repeat"
      },
      this.bgStyle
    );
  }

  get containerSize(): Size {
    const width =
      typeof this.width === "string" ? parseInt(this.width) : this.width;

    const height =
      typeof this.height === "string" ? parseInt(this.height) : this.height;

    return {
      width,
      height
    };
  }

  get placeholderStyle() {
    const { width, height } = this.containerSize;
    let value = width;
    if (width > height) {
      value = height;
    }

    if (value >= 300) {
      value = 90;
    } else if (value > 60 && value < 300) {
      value = 48;
    } else {
      value = 24;
    }

    return {
      width: this.getSize(value),
      height: this.getSize(value)
    };
  }

  get showImageHolder() {
    return this.isLoading || this.isError
  }

  get imageHolderSrc() {
    return this.isLoading ? this.loadingSrc : this.emptySrc
  }

  @Watch("bounding")
  onBoundingChange() {
    this.fetchImage();
  }

  @Watch("src", { immediate: true })
  onSrcChange(val) {
    this.fetchImage();
  }

  @Watch("isError")
  onErrorChange(hasError: boolean) {
    if (!hasError) {
      this.$nextTick(() => {
        this.handleZoom();
      });
    }
  }

  @Watch("allowZoom")
  onAllowZoomChange(allow: boolean) {
    this.handleZoom();
  }

  handleZoom() {
    const base = {
      parentSize: this.containerSize,
      initialSize: this.wrapperSize,
      flexable: this.flexable,
      flexbase: this.flexbase
    };
    const params = Object.assign(base, this.hasBounding || this.type === 'face'
      ? {
        background: {
          size: this.imgSize,
          position: this.imgOffset
        }
      }
      : {});

    this.zc = this.zc
      ? this.zc
      : new ZoomController(this.$refs.wrapper as HTMLElement, params);

    if (this.allowZoom) {
      this.zc.bind();
    } else {
      this.zc.unbind();
    }
  }

  fetchImage() {
    this.isLoading = true;
    const image = new Image();
    image.src = this.src;
    image.onload = event => {
      const originSize = {
        width: image.width,
        height: image.height
      };

      this.handleImageLoad(originSize);
      this.isError = false;
      this.isLoading = false;
    };

    image.onerror = err => {
      this.isError = true;
      this.isLoading = false;
    };
  }

  handleImageLoad(originSize: Size) {
    if (this.hasBounding) this.handleBounding(originSize);
    else this.handleNoBounding(originSize);
  }

  /**
   * 处理小图
   */
  handleNoBounding(wrapperSize: Size) {

    if (this.type === 'face') {
      const scaleValue = this.containerSize.height / wrapperSize.height;

      this.wrapperSize = this.containerSize;
      this.imgSize = this.doScaleSize(wrapperSize, scaleValue);
      this.imgOffset.left = (this.imgSize.width - this.wrapperSize.width) / 2;
    } else {
      
      const containerSize = this.containerSize;

      const containerRatio = Util.getRatio(containerSize);
      const wrapperRatio = Util.getRatio(wrapperSize);

      if (this.isRatioClose(containerRatio, wrapperRatio)) {
        this.wrapperSize = this.containerSize;
        this.imgSize = this.containerSize;
      } else {
        const calculator = new ScaleCalculator(containerSize, wrapperSize);
        const scaleValue = calculator.getScaleValue();
        this.wrapperSize = this.doScaleSize(wrapperSize, scaleValue);
        this.imgSize = this.doScaleSize(wrapperSize, scaleValue);
      }
    }
    
  }

  /**
   * 处理带bounding数据的图片
   */
  handleBounding(originSize: Size) {
    this.wrapperSize = this.containerSize;
    this.boundingSize = Util.getSize(this.bounding);

    const calculator = new ScaleCalculator(
      this.containerSize,
      this.boundingSize
    );

    const scaleValue = calculator.getScaleValue();

    /**
     * 先做基本的缩放
     */
    this.doScaleBoundingImage(originSize, scaleValue);

    /**
     * 如果下面或右边有留白，则需要移动来调整图片
     */
    const needRectifyX =
      this.containerSize.width > this.imgSize.width - this.imgOffset.left;

    const needRectifyY =
      this.containerSize.height > this.imgSize.height - this.imgOffset.top;

    if (needRectifyX || needRectifyY) {
      const { x, y } = this.getRectifyValue();

      this.imgOffset.left -= x;
      this.imgOffset.top -= y;
    } else {
      /**
       * 当不需要补边时，矫正中心点
       * 使框的中心点在container的中心点，显示效果更佳
       */
      this.rectifyCenter();
    }
  }

  rectifyCenter() {
    const diffX = this.containerSize.width - this.boundingSize.width;
    const diffY = this.containerSize.height - this.boundingSize.height;

    const dx =
      this.imgOffset.left > diffX / 2 ? diffX / 2 : this.imgOffset.left;
    const dy = this.imgOffset.top > diffY / 2 ? diffY / 2 : this.imgOffset.top;

    this.imgOffset.left -= dx;
    this.imgOffset.top -= dy;
  }

  /**
   * 获取需要左右移动图片的距离值
   */
  getRectifyValue() {
    let x = 0;
    let y = 0;

    const nx = this.containerSize.width - this.boundingSize.width;
    const ny = this.containerSize.height - this.boundingSize.height;

    /**
     * 判断是否有足够的位置来进行移动
     * 如果没有，则需要拉伸图片来填满container
     */
    const deltaX = nx - this.imgOffset.left;
    const deltaY = ny - this.imgOffset.top;

    x = deltaX > 0 ? this.stretchImage("width") : nx;
    y = deltaY > 0 ? this.stretchImage("height") : ny;

    /** rectify end **/

    return {
      x,
      y
    };
  }

  /**
   * 拉伸图片
   * 按要求只拉伸某一边
   */
  stretchImage(type: "width" | "height"): number {
    const isHorizontal = type === "width";

    const offsetType = isHorizontal ? "left" : "top";

    const containerSize = this.containerSize[type];
    const boundingSize = this.boundingSize[type];
    const offset = this.imgOffset[offsetType];

    const width = isHorizontal
      ? this.boundingSize.width + this.imgOffset.left
      : this.boundingSize.width;

    const height = isHorizontal
      ? this.boundingSize.height
      : this.boundingSize.height + this.imgOffset.top;

    const wrapperSize = {
      width,
      height
    };

    const wrapperRatio = Util.getRatio(wrapperSize);
    const containerRatio = Util.getRatio(this.containerSize);

    if (this.isRatioClose(wrapperRatio, containerRatio)) {
      const scaleValue = containerSize / (offset + boundingSize);

      const delta = offset * scaleValue - offset;

      this.imgSize[type] *= scaleValue;

      this.imgOffset[offsetType] *= scaleValue;

      return delta;
    } else {
      this.wrapperSize = this.boundingSize;
      return 0;
    }
  }

  getBoundingOffset(bounding: Bounding) {
    return {
      top: bounding.start.y,
      left: bounding.start.x
    };
  }

  // 对带人脸/人体框的图片进行缩放处理
  doScaleBoundingImage(imageSize: Size, scaleValue: number) {
    this.imgSize = this.doScaleSize(imageSize, scaleValue);
    this.currentBounding = this.doScaleBounding(this.bounding, scaleValue);
    this.imgOffset = this.getBoundingOffset(this.currentBounding);
    this.boundingSize = Util.getSize(this.currentBounding);
  }

  doScaleBounding(bounding: Bounding, scaleValue: number) {
    const { start, end } = bounding;
    const scale = this.doScale.bind(this, scaleValue);

    return {
      start: {
        x: scale(start.x),
        y: scale(start.y)
      },
      end: {
        x: scale(end.x),
        y: scale(end.y)
      }
    };
  }

  doScaleSize(size: Size, value: number): Size {
    const scale = this.doScale.bind(this, value);

    return {
      width: scale(size.width),
      height: scale(size.height)
    };
  }

  doScale(scaleValue: number, item: number) {
    return Math.round(item * scaleValue);
  }

  isRatioClose(ratioA, ratioB): boolean {
    return Math.abs(ratioA - ratioB) <= this.ratioError;
  }

  getSize(value: number | string) {
    if (typeof value === 'string') {
      value = parseInt(value);
    }
    
    return Util.getRealSize(value, this.flexable, this.flexbase, this.converter);
  }

  beforeDestory() {
    this.zc && this.zc.unbind();
  }
}
</script>
