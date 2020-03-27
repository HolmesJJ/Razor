<template>
  <!-- 编写 imageEditor 组件 -->
  <div class="rz-imageEditor">
    <canvas
      ref="canvas"
      class="rz-imageEditor__board"
      :style="canvasStyle"
      @wheel="handleWheel"
      @mousedown="handleMouseDown"
      @mousemove="handleCanvasMouseMove"
      v-show="showCanvas"
    ></canvas>
    <img ref="image" style="display:none" :src="this.imageSrc" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import {
  Editor,
  Events,
  stateMap,
  mouseType,
  judgeState
} from "../editor/index";
import { transformVertex } from "rz/utils/canvas/utils";
import { rotateImage, flipImage } from "rz/utils/canvas/image";
import { dataURItoBlob } from "rz/utils/file";

@Component({
  name: "ImageEditor"
})
export default class ImageEditor extends Vue {
  @Prop({ type: Number, default: 0, required: true })
  readonly drawState: number;

  @Prop({ type: Boolean, default: true })
  readonly showDrawer: boolean;

  @Prop({ type: String, default: "", required: true })
  readonly imageSrc: string;

  @Prop({
    type: Object,
    default() {
      return {};
    }
  })
  readonly options: any;

  @Prop({
    type: Object,
    default() {
      return {};
    }
  })
  readonly config: any;

  @Prop({
    type: Array,
    required: true,
    default() {
      return [];
    }
  })
  readonly rects: any[];

  @Prop({
    type: String,
    default: "radio" // multiple 多选 radio 单选
  })
  readonly mode: string;

  containerStyle: any = {};

  Editor: any; // it will not be observe

  mouseState: string = "";

  scale: number = 1;

  // 缩放配置
  maxScale: number = 5;
  minScale: number = 1;
  canvasPosition = {
    x: 0,
    y: 0
  };

  canvasStyle = {};
  currentPosition: {
    clientX: number;
    clientY: number;
  } = {
    clientX: 0,
    clientY: 0
  };
  /* 记录之前位置 ,以避免画标注时,移动画布还画标注 */
  prevPosition: {
    clientX: number;
    clientY: number;
  } = {
    clientX: 0,
    clientY: 0
  };

  selectedRects: any[] = [];

  get showCanvas() {
    return this.showDrawer || this.drawState;
  }

  @Watch("imageSrc")
  handleImageChange() {
    this.destroyEditor();
    this.init();
  }

  @Watch("drawState")
  handleDrawStateChange(state) {
    const flag = judgeState(state);
    if (!flag) {
      throw new Error(
        "drawState is no found | 绘画状态没有找到,请确认绘画状态 drawState 是否合法"
      );
    }
    this.Editor && this.Editor.changeState(state);
    // 状态是画多个矩形 ,需要立马画出
    if (this.Editor && state === stateMap.drawRects) {
      this.drawRects();
    }
  }

  @Emit("draw-circles")
  handleDrawCircles(circles) {
    return circles;
  }

  @Emit("draw-circle-done")
  handleDrawCircleDone(circles) {
    return circles;
  }

  @Emit("change-state")
  handleChangeState(state) {
    return state;
  }

  @Emit("screenshot-done")
  handleScreenShotDone(screenShot) {
    return screenShot;
  }

  @Emit("select-rect")
  handleSelectRect(rect, index, selectedRects) {
    return { rect, selectedRects, index };
  }

  @Emit("rotate-image")
  async rotate(url, deg = 90, quality = 1) {
    const base64File = await rotateImage(url, deg, quality);
    const imageUrl = URL.createObjectURL(dataURItoBlob(base64File));
    this.resetStyle();
    return { base64File, imageUrl };
  }

  @Emit("flip-image")
  async flip(url, horizontal = true, quality = 1) {
    const base64File = await flipImage(url, horizontal, quality);
    const imageUrl = URL.createObjectURL(dataURItoBlob(base64File));
    this.resetStyle();
    return { base64File, imageUrl };
  }
  resetStyle() {
    this.canvasPosition = { x: 0, y: 0 };
    this.currentPosition = { clientX: 0, clientY: 0 };
    this.scale = 1;
    this.canvasStyle = this.getCanvasStyle();
  }

  mounted() {
    this.init();
    this.addDocumentListen();
  }

  beforeDestroy() {
    document.removeEventListener("mouseup", this.handleMouseUp);
    this.destroyEditor();
  }
  addDocumentListen() {
    document.removeEventListener("mouseup", this.handleMouseUp);
    document.addEventListener("mouseup", this.handleMouseUp);
  }

  getImageDom() {
    if (!this.imageSrc) {
      throw new Error("[Razor Error] the imageSrc must exist and be unique ");
    }
    const image: HTMLImageElement = this.$refs.image as HTMLImageElement;
    // eslint-disable-next-line
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      image.onload = event => {
        const target = event.target;
        const {
          naturalWidth: width,
          naturalHeight: height
        } = target as HTMLImageElement;

        const containerStyle = this.$el.getBoundingClientRect();

        resolve({
          containerStyle: containerStyle,
          imageSize: { width, height },
          image: event.target
        });
      };
    });
  }

  async getComputedStyle(): Promise<any> {
    // eslint-disable-next-line
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      this.getImageDom().then(({ containerStyle, imageSize, image }) => {
        this.containerStyle = containerStyle;
        if (!this.containerStyle.height) {
          throw new Error("[Razor Error] the container height is unset");
        }
        resolve({ containerStyle: this.containerStyle, image, imageSize });
      });
    });
  }

  async init() {
    const { containerStyle, image, imageSize } = await this.getComputedStyle();

    const { circleLength } = this.config;
    const config = { containerStyle, imageSize, circleLength };
    const canvasElem = this.$refs.canvas;
    const options = this.options;

    this.Editor = new Editor(canvasElem, config, options, image);

    this.Editor.on(Events.drawCircles, this.handleDrawCircles);
    this.Editor.on(Events.drawCircleDone, this.handleDrawCircleDone);
    this.Editor.on(Events.changeDrawState, this.handleChangeState);
    if (this.drawState === stateMap.drawRects && this.rects.length) {
      this.drawRects();
    }
  }

  handleMouseDown(event) {
    this.mouseState = mouseType.down;
    this.currentPosition = {
      clientX: event.clientX,
      clientY: event.clientY
    };
    this.prevPosition = {
      clientX: event.clientX,
      clientY: event.clientY
    };
    const vertex = transformVertex(event, this.scale);
    switch (this.drawState) {
      case stateMap.circle:
        break;
      case stateMap.screenShot:
        this.Editor.addScreenShotVertex(vertex);
        break;
      case stateMap.drawRects:
        break;
      default:
        console.warn(
          "[ Razor warn ] drawState not found | 绘画状态 drawState 没有找到"
        );
        return;
    }
  }

  handleCanvasMouseMove(event) {
    // 判断是不是鼠标按下
    if (this.mouseState === mouseType.down) {
      this.mouseState = mouseType.move;
    }
    // 不是画矩形的状态 关闭
    if (this.mouseState !== mouseType.move) {
      return;
    }
    if (this.drawState === stateMap.screenShot) {
      const vertex = transformVertex(event, this.scale);
      this.Editor.drawScreenshot(vertex);
    } else {
      this.moveCanvas(event);
    }
  }

  handleMouseUp(event) {
    this.mouseState = mouseType.up; // 把鼠标的状态改为 up 避免handleCanvasMouseMove 在执行
    let screenShot;
    if (!event || !this.$el.contains(event.target)) {
      // 鼠標移出容器的兼容
      if (this.drawState === stateMap.screenShot) {
        screenShot = this.Editor.getScreeShot();
        if (!screenShot) {
          return;
        }
        this.handleScreenShotDone(screenShot);
      }
      this.currentPosition = null;
      return;
    }

    const vertex = transformVertex(event, this.scale);
    let circleIndex = -1;

    switch (this.drawState) {
      case stateMap.circle:
        if (
          // 鼠标移动了则不画标注
          this.prevPosition.clientX !== this.currentPosition.clientX ||
          this.prevPosition.clientY !== this.currentPosition.clientY
        ) {
          break;
        }
        circleIndex = this.Editor.isCircleExist(vertex);
        if (this.Editor.circles.length && circleIndex >= 0) {
          this.Editor.removeCircle(circleIndex);
        } else {
          this.Editor.addCircle(vertex);
        }
        break;
      case stateMap.screenShot:
        screenShot = this.Editor.getScreeShot();
        if (!screenShot) {
          break;
        }
        this.handleScreenShotDone(screenShot);
        break;
      case stateMap.drawRects:
        this.selectRect(vertex);
        break;
      default:
        break;
    }
    this.currentPosition = null;
  }

  handleWheel(event, scaleStep = 0.1) {
    this.swallowEvent(event);
    const scaleFlag = event.deltaY < 0;
    let newScale = this.scale + scaleStep * (scaleFlag ? 1 : -1);
    if (newScale > this.maxScale) {
      newScale = this.maxScale;
    } else if (newScale < this.minScale) {
      newScale = this.minScale;
    }
    const canvasElem = this.$refs.canvas as HTMLCanvasElement;
    // 当前位置
    const boundingRect = canvasElem.getBoundingClientRect();

    const x = event.clientX - boundingRect.left;
    const y = event.clientY - boundingRect.top;
    const changeRate = newScale / this.scale;
    this.scale = newScale;

    if (newScale === this.minScale) {
      this.canvasPosition = {
        x: 0,
        y: 0
      };
    } else {
    // 换算后新的位置
      this.canvasPosition = {
        x: this.canvasPosition.x - (changeRate - 1) * x,
        y: this.canvasPosition.y - (changeRate - 1) * y
      };
    }
    this.canvasStyle = this.getCanvasStyle();
    this.Editor.zoom(this.scale);
  }

  moveCanvas(event) {
    this.swallowEvent(event);
    const { clientX, clientY } = event;
    const movementX = clientX - this.currentPosition.clientX;
    const movementY = clientY - this.currentPosition.clientY;
    /* 距离太小不做操作 */
    if (
      (movementX > 0 && movementX < 5) ||
      (movementY > 0 && movementY < 5) ||
      (movementX < 0 && movementX > -5) ||
      (movementY < 0 && movementY > -5)
    ) {
      return;
    }
    this.canvasPosition.x += movementX;
    this.canvasPosition.y += movementY;
    this.canvasStyle = this.getCanvasStyle();
    this.currentPosition = { clientX, clientY };
  }
  // 设置canvas的位置
  getCanvasStyle() {
    const { width, height } = this.containerStyle;
    return {
      width: `${width * this.scale}px`,
      height: `${height * this.scale}px`,
      top: `${this.canvasPosition.y}px`,
      left: `${this.canvasPosition.x}px`
    };
  }

  swallowEvent(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  drawRects() {
    const rects = this.rects.map(rect => {
      const vertexes = rect.vertexes.map(vertex =>
        this.Editor.shrinkVertex(vertex)
      );
      return { ...rect, vertexes };
    });
    if (rects.length) this.Editor.drawRects(rects);
  }

  getScreeShot() {
    this.Editor.getScreeShot();
  }

  selectRect(vertex) {
    if (!this.rects || !this.rects.length) {
      console.warn("[Razor Warning] no rects exist");
      return;
    }
    let targetIndex = -1;
    targetIndex = this.Editor.selectRect(vertex);
    let i = this.rects.length;
    let isRectSelected = true; // 多选模式下使用 , 是选中还是反选

    if (targetIndex < 0) {
      return;
    }
    while (i--) {
      if (this.mode === "radio") {
        // 单选
        if (i === targetIndex) {
          this.rects[i].options.dashed = false; // 命中
        } else {
          this.rects[i].options.dashed = true;
        }
      } else {
        // 多选
        if (i === targetIndex) {
          this.rects[i].options.dashed = !this.rects[i].options.dashed; // 命中
          isRectSelected = !this.rects[i].options.dashed;
        }
      }
    }
    this.drawRects();
    const { vertexes, options } = this.Editor.rects[targetIndex];
    let _vertexes = vertexes.map(vertex => {
      return this.Editor.transformVertex(vertex);
    });
    const start = _vertexes[0];
    const end = _vertexes[1];
    // 防止坐标起点跟右下角反了
    if (start.x >= end.x) {
      _vertexes = [end, start];
    }
    if (this.mode === "radio") {
      // 单选
      this.selectedRects = [_vertexes];
    } else {
      // 多选
      this.selectedRects = this.getSelectedRects(
        this.selectedRects,
        _vertexes,
        isRectSelected
      );
    }

    this.handleSelectRect(
      { vertexes: _vertexes, options },
      targetIndex,
      this.selectedRects
    );
  }

  getSelectedRects(selectedRects, _vertexes, isRectSelected) {
    let _selectedRects = [...selectedRects];

    if (isRectSelected) {
      // 避免有已选的坐标重复的情况
      const isExist = _selectedRects.findIndex(rect => {
        return (
          rect[0].x === _vertexes[0].x &&
          rect[0].y === _vertexes[0].y &&
          rect[1].x === _vertexes[1].x &&
          rect[1].y === _vertexes[1].y
        );
      });

      if (isExist > -1) {
        return _selectedRects;
      }

      _selectedRects.push(_vertexes);
    } else {
      _selectedRects = selectedRects.filter(rect => {
        return (
          rect[0].x !== _vertexes[0].x &&
          rect[0].y !== _vertexes[0].y &&
          rect[1].x !== _vertexes[1].x &&
          rect[1].y !== _vertexes[1].y
        );
      });
    }
    return _selectedRects;
  }

  destroyEditor() {
    this.Editor.dispose();
    this.Editor = null;
  }

  handleZoom(scaleFlag) {
    const rect = (this.$refs.canvas as HTMLElement).getBoundingClientRect();
    const event = {
      clientX: (rect.left + rect.right) / 2,
      clientY: (rect.top + rect.bottom) / 2,
      deltaY: 1,
      stopPropagation() {},
      preventDefault() {}
    };
    if (scaleFlag) {
      event.deltaY = -1;
    } else {
      event.deltaY = 1;
    }
    const scaleStep = 0.3;
    this.handleWheel(event, scaleStep);
  }
}
</script>
