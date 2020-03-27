import {
  drawCircle,
  mergeOptions,
  clearCanvas,
  isInRect,
  drawRect
} from 'rz/utils/canvas/utils';
import {
  ContainerStyle,
  DrawCircleOption,
  DrawRectOption,
  MouseType,
  ScreenShot,
  IVertex
} from 'rz/utils/canvas/layer.d';
import EventManager from 'rz/utils/canvas/eventManager';
import { calculator, Rect } from './calculate';

const imageWidth = 1920;
const imageHeight = 1080;
const containerWidth = 840;
const containerHeight = 540;
const result = calculator(
  imageWidth,
  imageHeight,
  containerWidth,
  containerHeight
);

export const stateMap = {
  none: 0,
  circle: 1,
  screenShot: 2,
  drawRects: 3
};

export const mouseType: MouseType = {
  move: 'move',
  down: 'down',
  up: 'up'
};

const _drawRectOption: DrawRectOption = {
  lineColor: '#68cdfa',
  fillColor: '',
  weight: 2,
  opacity: 0.8,
  dashed: false,
  dashedConfig: [5, 5, 5]
};

const _defaultCricleLength = 10;

const _config = {
  ContainerStyle: {
    width: 0,
    heights: 0
  },
  circleLength: _defaultCricleLength
};

const _drawCircleOption: DrawCircleOption = {
  lineColor: '#ccc',
  weight: 3,
  opacity: 0.5,
  radius: 10,
  fillColor: '#ff6600'
};

export const Events = {
  drawCircles: 'drawCircles',
  drawCircleDone: 'drawCircleDone',
  changeDrawState: 'changeDrawState'
};

export const judgeState = state => {
  let flag = false;
  for (const key in stateMap) {
    if (stateMap[key] === state) {
      flag = true;
      break;
    }
  }
  return flag;
};

export class Editor extends EventManager {
  state: number = stateMap.none;

  canvasCtx: any;

  containerStyle: ContainerStyle | any = {};

  options: any = { drawCircleOption: _drawCircleOption };

  config: any = {};

  image: HTMLImageElement;

  circles: { vertex: IVertex; options: any }[] = [];

  transformCircles: { vertex: IVertex }[] = [];

  scale: number = 0;

  rect: Rect; // 绘画区域
  // containerStyle: containerStyle | any = {};

  screenShot: ScreenShot = {
    vertexes: []
  };

  rects: any[]; // 矩形列表

  zoomLevel: number = 1; //

  canvas: any = null;

  constructor(
    canvasElem,
    config: {
      containerStyle?: ContainerStyle | any;
      circleLength?: number;
      imageSize?: any;
    } = _config,
    options = {},
    image: HTMLImageElement
  ) {
    super();
    if (!canvasElem) {
      throw new Error('canvas Element no found | 没有 canvas Element');
    }
    const { containerStyle, circleLength, imageSize } = config;
    this.config = { containerStyle, circleLength, imageSize };

    mergeOptions(this.options, options);

    this.init(canvasElem, containerStyle, image);
  }

  init(canvasElem, containerStyle, image) {
    this.canvas = canvasElem as any;
    const { width, height } = containerStyle;
    if (!width || !height) {
      throw new Error(`[Razor Error] width is ${width},height is ${height}`);
    }
    this.canvas.width = width;
    this.canvas.height = height;
    // 获取画笔
    this.canvasCtx = this.canvas.getContext('2d');
    this.containerStyle = containerStyle;
    this.image = image;
    this.drawImage();
  }

  drawImage() {
    const {
      width: containerWidth,
      height: containerHeight
    } = this.containerStyle;

    const {
      imageSize: { width: imageWidth, height: imageHeight }
    } = this.config;

    this.rect = calculator(
      imageWidth,
      imageHeight,
      containerWidth,
      containerHeight
    );

    const { scale, vertexes } = this.rect;
    const [vertexStart, vertexEnd] = vertexes;

    const scaleImageWidth = imageWidth / scale; // imageWidth;
    const scaleImageHeight = imageHeight / scale; // imageHeight;
    /**
     * @param image Image
     * @param vertexStart 起点坐标
     * @param vertexStart.x // 绘画的起点横坐标
     * @param vertexStart.y // 绘画的起点纵坐标
     * @param scaleImageWidth / scale 后图片的宽度
     * @param scaleImageHeight scale 后图片的高度
     * */
    this.canvasCtx.drawImage(
      this.image,
      vertexStart.x,
      vertexStart.y,
      scaleImageWidth,
      scaleImageHeight
    );
  }

  addCircle(vertex) {
    if (this.state !== stateMap.circle) {
      return;
    }
    const { circleLength } = this.config;
    if (this.circles.length >= circleLength) {
      return;
    }
    // 如果添加的点不在图片区域内不处理
    if (!this.isInImageArea(vertex)) {
      return;
    }

    const { drawCircleOption, radius } = this.options;
    const ctx = this.canvasCtx;

    drawCircle(ctx, vertex, radius / this.zoomLevel, drawCircleOption);

    this.circles.push({ vertex, options: drawCircleOption });

    const transformVertex = this.transformVertex(vertex);
    this.transformCircles.push({ vertex: transformVertex });

    this.emit(Events.drawCircles, this.transformCircles);

    if (this.circles.length === circleLength) {
      this.emit(Events.drawCircleDone, this.transformCircles);
    }
  }

  isCircleExist(vertex) {
    let index = -1;
    if (!this.circles.length) {
      return index;
    }
    const { radius } = this.options;
    let i = 0;
    for (; i < this.circles.length; i++) {
      const { vertex: targetVertex } = this.circles[i];
      if (
        vertex.x >= targetVertex.x - radius &&
        vertex.x <= targetVertex.x + radius &&
        vertex.y >= targetVertex.y - radius &&
        vertex.y <= targetVertex.y + radius
      ) {
        index = i;
      }
    }
    return index;
  }

  removeCircle(index) {
    this.circles.splice(index, 1);
    this.transformCircles.splice(index, 1);
    this.emit(Events.drawCircles, this.transformCircles);
    this.drawCircles();
  }

  drawCircles() {
    this.clearAndDrawImage();
    this.circles.forEach(circle => {
      const { drawCircleOption, radius } = this.options;
      const ctx = this.canvasCtx;
      drawCircle(ctx, circle.vertex, radius / this.zoomLevel, drawCircleOption);
    });
  }

  isInImageArea(vertex: IVertex): boolean {
    const { vertexes } = this.rect;
    const [vertexStart, vertexEnd] = vertexes;
    /**
     * 大于左上角的坐标 x y
     * 小于右下角的坐标 x y
     * 则落入区域
     */
    const flag =
      vertex.x >= vertexStart.x &&
      vertex.y >= vertexStart.y &&
      vertex.x <= vertexEnd.x &&
      vertex.y <= vertexEnd.y;
    return flag;
  }

  addScreenShotVertex(vertex: IVertex): boolean | IVertex {
    // 如果添加的点不在图片区域内不处理
    if (!this.isInImageArea(vertex) || this.state !== stateMap.screenShot) {
      this.screenShot.vertexes = []; // 清空旧有的顶点
      return false;
    }
    this.screenShot.vertexes = [vertex];
    return vertex;
  }

  drawScreenshot(vertex: IVertex, drawRectOption: DrawRectOption) {
    if (!this.screenShot.vertexes[0]) {
      return;
    }
    this.clearAndDrawImage();
    const { x: startX, y: startY } = this.screenShot.vertexes[0];
    let { x, y } = vertex;
    if (x > this.rect.vertexes[0].x) {
      x = Math.min(x, this.rect.vertexes[1].x);
    } else {
      x = Math.max(x, this.rect.vertexes[0].x);
    }

    if (y > this.rect.vertexes[0].y) {
      y = Math.min(y, this.rect.vertexes[1].y);
    } else {
      y = Math.max(y, this.rect.vertexes[0].y);
    }

    const vertexes: [IVertex, IVertex] = [{ x: startX, y: startY }, { x, y }];
    const ctx = this.canvasCtx;
    this.screenShot.vertexes.length === 1
      ? this.screenShot.vertexes.push({ x, y })
      : this.screenShot.vertexes.splice(1, 1, { x, y });
    drawRect(ctx, vertexes, drawRectOption || _drawRectOption);
  }

  drawRects(rects: any[]) {
    this.clearAndDrawImage();
    const ctx = this.canvasCtx;
    this.rects = rects;
    rects.forEach(rect => {
      const { vertexes, options: drawRectOption } = rect;
      drawRect(ctx, vertexes, drawRectOption || _drawRectOption);
    });
  }

  selectRect(vertex: IVertex): number {
    let i = this.rects.length;
    let leftTop: IVertex = { x: 0, y: 0 };
    let rightBottom: IVertex = { x: 0, y: 0 };
    let targetIndex: number = -1;
    const indexArr = [];
    while (i--) {
      if (this.rects[i].vertexes[0].x < this.rects[i].vertexes[1].x) {
        leftTop = this.rects[i].vertexes[0];
        rightBottom = this.rects[i].vertexes[1];
      } else {
        leftTop = this.rects[i].vertexes[1];
        rightBottom = this.rects[i].vertexes[0];
      }
      if (isInRect(vertex, [leftTop, rightBottom])) {
        targetIndex = i;
        indexArr.push({ index: targetIndex, leftTop });
      }
    }
    if (indexArr.length > 1) {
      let j = 1;
      let item = indexArr[0];
      targetIndex = item.index;
      for (; j < indexArr.length; j++) {
        if (indexArr[j].leftTop.x > item.leftTop.x) {
          targetIndex = indexArr[j].index;
          item = indexArr[j];
        }
      }
    }
    return targetIndex;
  }

  getScreeShot() {
    const vertexes = this.screenShot.vertexes.map(vertex =>
      this.transformVertex(vertex)
    );
    if (this.screenShot.vertexes.length < 2) {
      return false;
    }
    const leftTop = {
      x: Math.min(vertexes[0].x, vertexes[1].x),
      y: Math.min(vertexes[0].y, vertexes[1].y)
    };
    const rightBottom = {
      x: Math.max(vertexes[0].x, vertexes[1].x),
      y: Math.max(vertexes[0].y, vertexes[1].y)
    };
    return [leftTop, rightBottom];
  }

  transformVertex(vertex): IVertex {
    const { scale, vertexes } = this.rect;
    const [vertexStart] = vertexes;
    const x = (vertex.x - vertexStart.x) * scale;
    const y = (vertex.y - vertexStart.y) * scale;
    const transformVertex: IVertex = { x, y };
    return transformVertex;
  }

  shrinkVertex(vertex) {
    const { scale, vertexes } = this.rect;
    const [vertexStart] = vertexes;
    const x = vertex.x / scale + vertexStart.x;
    const y = vertex.y / scale + vertexStart.y;
    const transformVertex: IVertex = { x, y };
    return transformVertex;
  }

  zoom(zoom) {
    this.zoomLevel = zoom;
    switch (this.state) {
      // 圆跟着缩放
      case stateMap.circle:
        this.drawCircles();
    }
  }

  changeState(state: number) {
    this.state = state;
    this.clearAndDrawImage();
    this.circles = []; // 置空 标注圆
    this.transformCircles = []; // 置空转换的标注圆
    this.screenShot.vertexes = []; // 置空 screenShot 的顶点

    this.emit(Events.changeDrawState, state);
  }

  clear() {
    const { width, height } = this.containerStyle;
    const ctx = this.canvasCtx;
    clearCanvas(ctx, { width, height });
  }

  clearAndDrawImage() {
    this.clear();
    this.drawImage();
  }

  dispose() {
    this.changeState(stateMap.none);
    this.clear();
  }
}
