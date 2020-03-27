import {
  mergeOptions,
  drawCircle,
  drawPolygon,
  drawLine,
  drawRect,
  clearCanvas,
  getArrowPoint,
  drawArrow,
  ArrowOptions
} from './utils';
import {
  IVertex,
  DrawLineOption,
  DrawCircleOption,
  DrawPolygonOption,
  DrawRectOption,
  ContainerStyle,
  Polygon
} from './layer.d';
import eventManager from './eventManager';

export const drawerEvents: any = {
  drawPolygonFinish: {
    eventName: 'draw-polygon-finish'
  },
  drawLineFinish: {
    eventName: 'draw-line-finish'
  },
  drawArrowLineFinish: {
    eventName: 'draw-arrowline-finish'
  },
  drawRectFinish: {
    eventName: 'draw-rect-finish'
  }
};

export function transformVertex(event): IVertex {
  const { offsetX: x, offsetY: y } = event;
  return { x, y };
}

enum DrawMode {
  polygon = 0,
  line = 1,
  arrowLine = 2,
  rect = 3
}
interface Line {
  vertexes: IVertex[];
  options: any;
}
interface ArrowLine {
  vertexes: IVertex[];
  options: any;
}

interface Rect {
  vertexes: [IVertex, IVertex];
  options: any;
}

interface DrawArrowLineOption extends ArrowOptions {
  color: string;
  weight: number;
  opacity: number;
}

const _drawLineOption: DrawLineOption = {
  color: '#f60',
  weight: 1,
  opacity: 0.8,
  fillColor: '#f80',
  hasArrow: false
};

const _drawCircleOption: DrawCircleOption = {
  lineColor: 'rgba(66,88,99)',
  weight: 1,
  opacity: 0.8,
  radius: 10,
  fillColor: '#f60'
};

const _drawPolygonOption: DrawPolygonOption = {
  lineColor: '4285f4',
  fillColor: '#f60',
  weight: 10,
  opacity: 0.5
};

const _drawArrowLineOption: DrawArrowLineOption = {
  color: '#f60',
  weight: 1,
  opacity: 0.8,
  strokeStyle: '#68cdfa',
  colorFill: ['#68cdfa', '#68cdfa']
};

const _drawRectOption: DrawRectOption = {
  lineColor: '#f2211e',
  fillColor: '#ff9900',
  weight: 2,
  opacity: 0.5,
};

const _drawErrorLineOption: DrawLineOption = {
  color: '#ff6600',
  weight: 5,
  opacity: 0.8,
  fillColor: '#f80',
}

const _config = { containerStyle: {}, hintDistance: 10, convexPolygonJudge: false };

const DrawModeMap = {
  polygon: DrawMode.polygon,
  line: DrawMode.line,
  arrowLine: DrawMode.arrowLine,
  rect: DrawMode.rect
};

interface Options {
  drawLineOption?: DrawLineOption;
  drawCircleOption?: DrawCircleOption;
  drawPolygonOption?: DrawPolygonOption;
  drawArrowLineOption?: DrawArrowLineOption;
  drawRectOption?: DrawRectOption;
  drawErrorLineOption?: DrawLineOption;
}
export class Drawer extends eventManager {
  options: Options = {
    drawLineOption: _drawLineOption,
    drawCircleOption: _drawCircleOption,
    drawPolygonOption: _drawPolygonOption,
    drawArrowLineOption: _drawArrowLineOption,
    drawRectOption: _drawRectOption,
    drawErrorLineOption: _drawErrorLineOption,
  };

  startVertex: IVertex = {
    x: 0,
    y: 0
  };

  drawing: boolean = false;

  vertexes: IVertex[] = [];

  canvasElem: any;

  canvasCtx: any;

  containerStyle: ContainerStyle | any = {};

  drawState: boolean = false;

  hintDistance: number = 0;

  polygons: Polygon[] = [];

  drawMode: DrawMode = DrawMode.polygon; // 绘画模式

  lines: Line[] = [];

  arrowLines: ArrowLine[] = [];

  rects: Rect[] = [];

  convexPolygonJudge: boolean = true;

  constructor(
    canvasElem,
    config = _config,
    options = {},
    polygons: Polygon[] = [],
    lines = [],
    arrowLines = [],
    rects: Rect[] = []
  ) {
    super();

    const { containerStyle, hintDistance, convexPolygonJudge } = config;

    this.canvasElem = canvasElem;

    this.hintDistance = hintDistance;

    this.convexPolygonJudge = convexPolygonJudge;

    this.setPolygons(polygons);

    this.setLines(lines);

    this.setArrowLines(arrowLines);

    this.setRects(rects);

    this.initCanvas(containerStyle);

    this.initOption(options);

    this.drawPolygons(polygons);

    this.drawStaticLines(lines);

    this.drawArrowLines(arrowLines);

    this.drawRects(rects);
  }

  setPolygons(polygons: Polygon[]) {
    this.polygons = polygons;
  }

  setLines(lines: Line[]) {
    this.lines = lines;
  }

  setArrowLines(arrowLines: ArrowLine[]) {
    this.arrowLines = arrowLines;
  }

  initOption(options) {
    mergeOptions(this.options, options);
  }

  /* 作为更改绘画模式的入口 */
  changeDrawMode(drawMode: DrawMode) {
    this.drawMode = drawMode;
    this.resetDrawer(this.polygons, this.lines, this.arrowLines, this.rects);
  }

  startDraw() {
    // 开启绘画
    this.drawing = true;
  }

  stopDraw() {
    // 关闭绘画
    this.drawing = false;
  }

  initCanvas(containerStyle) {
    const canvas = this.canvasElem as any;
    const { width, height } = containerStyle;
    if (!width || !height) {
      throw new Error(`[Razor Error] width is ${width},height is ${height}`);
    }
    canvas.width = width;
    canvas.height = height;
    // 获取画笔
    this.canvasCtx = canvas.getContext('2d');
    this.containerStyle = containerStyle;
  }

  // 根据 vertexes 画线
  drawLines(drawArrowLineOption?): [IVertex, IVertex][] {
    const lines: [IVertex, IVertex][] = [];
    if (!this.vertexes.length) {
      return;
    }
    this.vertexes.reduce(
      (
        preVertex: IVertex,
        curVertex: IVertex,
        // currentIndex: number,
        // arr: any[]
      ) => {
        lines.push([preVertex, curVertex]);

        let { drawLineOption } = this.options;
        drawLineOption = drawArrowLineOption || drawLineOption;

        const ctx = this.canvasCtx;

        drawLine(ctx, preVertex, curVertex, drawLineOption);

        return curVertex;
      }
    );
    return lines;
  }

  drawStaticLines(lines: Line[] = []) {
    const ctx = this.canvasCtx;
    lines.forEach(line => {
      const {
        vertexes: [preVertex, curVertex],
        options
      } = line;
      drawLine(ctx, preVertex, curVertex, options);
    });
  }

  drawArrowLines(arrowLines: ArrowLine[] = []) {
    this.drawStaticLines(arrowLines);
    this.drawStaticArrows(arrowLines);
  }

  /* 画已存在的箭头 */
  drawStaticArrows(arrowLines: ArrowLine[] = []) {
    arrowLines.forEach(line => {
      const { vertexes, options } = line;
      this.drawArrow(vertexes, options);
    });
  }

  addVertex(vertex: IVertex): IVertex {
    if (!this.drawing) {
      return;
    }

    switch (this.drawMode) {
      case DrawModeMap.polygon:
        this.addPolygonVertex(vertex);
        break;
      case DrawModeMap.line:
        this.addLineVertex(vertex);
        break;
      case DrawModeMap.arrowLine:
        this.addArrowLineVertex(vertex);
        break;
      case DrawModeMap.rect:
        this.addRectVertex(vertex);
        break;
      default:
        break;
    }

    return vertex;
  }

  addPolygonVertex(vertex: IVertex) {
    if (this.vertexes.length >= 4) {
      const distance = this.calculateDistance(vertex, this.vertexes[0]);

      if (distance < this.hintDistance) {
        this.vertexes.splice(this.vertexes.length - 1, 1, this.vertexes[0]);
        this.finishDraw();
        this.drawing = false;
      } else {

        /* 需要凸多边形判断的话,进行判断,不满足就不加入点 */
        if (this.convexPolygonJudge) {
          const isConvexPolygon = this.judge(this.vertexes);
          if (!isConvexPolygon) {
            this.drawing = true;
            return
          }
        }

        this.vertexes.push(vertex);
        this.drawing = true;
      }
    } else {
      this.vertexes.push(vertex);
      this.drawing = true;
    }
  }

  addLineVertex(vertex: IVertex) {
    if (this.vertexes.length > 2) {
      this.drawing = false;
      return;
    }

    if (this.vertexes.length === 2) {
      this.vertexes.splice(this.vertexes.length - 1, 1, vertex);
    } else {
      this.vertexes.push(vertex);
    }

    if (this.vertexes.length >= 2) {
      this.drawing = false;
      this.finishDraw();
    }
  }

  addArrowLineVertex(vertex: IVertex) {
    /* 画箭头线与画线逻辑一致,故直接使用画线逻辑 */
    this.addLineVertex(vertex);
  }

  addRectVertex(vertex: IVertex) {
    /* 画矩形与画线逻辑一致,故直接使用画线逻辑 */
    this.addLineVertex(vertex);
  }

  transformAndAddVertex(event) {
    event.preventDefault();
    const vertex: IVertex = transformVertex(event);
    this.addVertex(vertex);
  }

  changeDrawedData() {
    // const { drawPolygonOption } = this.options;
    // switch (this.drawMode) {
    //   case DrawModeMap.polygon:
    //     this.addPolygonData();
    //     break;
    //   case DrawModeMap.line:
    //     this.addLineData();
    //     break;
    //   case DrawModeMap.arrowLine:
    //     this.addArrowLineData();
    //     break;
    //   default:
    //     break;
    // }
  }

  addPolygonData() {
    // const { drawPolygonOption } = this.options;
    // this.polygons.push({
    //   vertexes: this.vertexes,
    //   options: JSON.parse(JSON.stringify(drawPolygonOption))
    // });
  }

  addLineData() {
    // const { drawLineOption } = this.options;
    // this.lines.push({
    //   vertexes: this.vertexes,
    //   options: JSON.parse(JSON.stringify(drawLineOption))
    // });
  }

  addArrowLineData() {
    // const { drawLineOption } = this.options;
    // this.arrowLines.push({
    //   vertexes: this.vertexes,
    //   options: JSON.parse(JSON.stringify(drawLineOption))
    // });
  }

  // 判断落在起点的范围后,结束绘画
  finishDraw() {
    this.clearCanvas();

    /* 改变当前模式下的绘画数据 */
    // this.changeDrawedData();

    // 绘制所有图层
    this.drawLayers();

    /* 事件广播 */
    this.emitEvents();

    // 清空顶点
    this.vertexes = [];
  }

  /* 这里要画所有的数据类型图案 */
  drawLayers() {
    this.drawPolygons(this.polygons);

    this.drawStaticLines(this.lines);

    this.drawArrowLines(this.arrowLines);
  }

  emitEvents() {
    const {
      drawPolygonOption,
      drawLineOption,
      drawArrowLineOption,
      drawRectOption
    } = this.options;

    switch (this.drawMode) {
      case DrawModeMap.polygon:
        this.emit(drawerEvents.drawPolygonFinish.eventName, {
          vertexes: this.vertexes,
          options: JSON.parse(JSON.stringify(drawPolygonOption))
        });

        break;
      case DrawModeMap.line:
        this.emit(drawerEvents.drawLineFinish.eventName, {
          vertexes: this.vertexes,
          options: JSON.parse(JSON.stringify(drawLineOption))
        });

        break;
      case DrawModeMap.arrowLine:
        this.emit(drawerEvents.drawArrowLineFinish.eventName, {
          vertexes: this.vertexes,
          options: JSON.parse(JSON.stringify(drawArrowLineOption))
        });

        break;
      case DrawModeMap.rect:
        this.emit(drawerEvents.drawRectFinish.eventName, {
          vertexes: this.vertexes,
          options: JSON.parse(JSON.stringify(drawRectOption))
        });

        break;
      default:
        break;
    }
  }

  drawPolygons(polygons) {
    polygons.forEach(polygon => {
      const { options, vertexes } = polygon;
      const ctx = this.canvasCtx;
      drawPolygon(ctx, vertexes, options);
    });
  }

  handleCanvasMouseMove(event) {
    if (!this.drawing) {
      return false;
    }
    event.preventDefault();
    this.clearCanvas();
    this.drawPolygons(this.polygons);
    this.drawStaticLines(this.lines);
    this.drawArrowLines(this.arrowLines);
    this.drawRects(this.rects);

    const vertex = transformVertex(event);

    switch (this.drawMode) {
      case DrawModeMap.polygon:
        this.drawPolygonMousemove(vertex);
        break;
      case DrawModeMap.line:
        this.drawLineMousemove(vertex);
        break;
      case DrawModeMap.arrowLine:
        this.drawArrowMousemove(vertex);
        break;
      case DrawModeMap.rect:
        this.drawRectmove(vertex);
        break;
      default:
        break;
    }
  }

  drawPolygonMousemove(vertex: IVertex) {
    if (this.vertexes.length < 1) {
      return;
    } else if (this.vertexes.length === 1) {
      this.vertexes.push(vertex);
    } else {
      // 至少有一个点才能进这里
      this.vertexes.splice(this.vertexes.length - 1, 1, vertex);
    }
    /* 判断是否靠近起点 */
    const distance = this.calculateDistance(vertex, this.vertexes[0]);
    const isClose = distance < this.hintDistance;
    /* 非 靠近起点, 开启凸凹判断, 顶点数目满足要求*/
    if (!isClose && this.convexPolygonJudge && this.vertexes.length >= 3) {
      /* 判断是否为凸多边形 */
      const isConvexPolygon = this.judge(this.vertexes);

      if (!isConvexPolygon) {
        const { drawErrorLineOption } = this.options;
        this.drawLines(drawErrorLineOption)
      } else {
        this.drawLines();
      }

    } else {
      this.drawLines();
    }


    const hintDistance: number = this.calculateDistance(
      vertex,
      this.vertexes[0]
    );

    // 距离满足且点有三个以上
    const isHintShow =
      hintDistance < this.hintDistance && this.vertexes.length > 3;
    this.drawHint(isHintShow);
  }

  drawLineMousemove(vertex: IVertex, drawArrowLineOption?: DrawArrowLineOption) {
    if (this.vertexes.length < 1) {
      return;
    } else if (this.vertexes.length === 1) {
      this.vertexes.push(vertex);
    } else {
      // 至少有一个点才能进这里
      this.vertexes.splice(this.vertexes.length - 1, 1, vertex);
    }

    this.drawLines(drawArrowLineOption);
  }

  drawArrowMousemove(vertex: IVertex) {
    /* 画线 */
    this.drawLineMousemove(vertex, this.options.drawArrowLineOption);
    /* 画箭头 */
    if (this.vertexes.length >= 1) {
      this.drawArrow(this.vertexes, this.options.drawArrowLineOption);
    }
  }

  /* 画正在移动的箭头 */
  drawArrow(vertexes, options?) {
    const arrowLength = 15; /* 后续如果有改变箭头大小 ,在这里根据 options 改动 */

    const [start, end] = vertexes;

    const { leftArrowPoint, rightArrowPoint } = getArrowPoint(
      start,
      end,
      arrowLength
    );

    const ctx = this.canvasCtx;

    const arrowPoints = {
      endPoint: end,
      leftArrowPoint,
      rightArrowPoint
    };

    const _options = options || this.options.drawArrowLineOption;

    drawArrow(ctx, arrowPoints, _options);
  }

  drawRectmove(vertex: IVertex) {
    if (this.vertexes.length < 1) {
      return;
    } else if (this.vertexes.length === 1) {
      this.vertexes.push(vertex);
    } else {
      // 至少有一个点才能进这里
      this.vertexes.splice(this.vertexes.length - 1, 1, vertex);
    }

    if (this.vertexes.length === 2) {
      const { canvasCtx: ctx } = this;
      drawRect(ctx, this.vertexes as [IVertex, IVertex], this.options.drawRectOption)
    }
  }

  calculateDistance(firstVertex: IVertex, secondVertex: IVertex) {
    const distance: number = Math.sqrt(
      Math.pow(firstVertex.x - secondVertex.x, 2) +
      Math.pow(firstVertex.y - secondVertex.y, 2)
    );
    return distance;
  }

  drawHint(show: boolean) {
    if (show) {
      this.showHint();
    } else {
      this.hideHint();
    }
  }

  showHint() {
    const vertex = this.vertexes[0];
    const { drawCircleOption } = this.options;
    const radius = drawCircleOption.radius;
    const ctx = this.canvasCtx;
    drawCircle(ctx, vertex, radius, drawCircleOption);
  }

  hideHint() { }

  resetDrawer(polygons, lines, arrowLines, rects): void {
    this.vertexes = [];

    this.setPolygons(polygons);
    this.setLines(lines);
    this.setArrowLines(arrowLines);
    this.setRects(rects);

    this.clearCanvas();

    this.drawPolygons(polygons);
    this.drawStaticLines(lines);
    this.drawArrowLines(arrowLines);
    this.drawRects(rects);
  }

  clearDrawer() {
    this.resetCatch();
    this.clearCanvas();
  }

  resetCatch() {
    this.polygons = [];
    this.arrowLines = [];
    this.lines = [];
    this.rects = [];
    this.vertexes = [];
  }

  clearCanvas() {
    const { width, height } = this.containerStyle;
    const ctx = this.canvasCtx;
    clearCanvas(ctx, { width, height });
  }

  dispose() {
    this.teardown();
  }

  setRects(rects: Rect[] = []) {
    this.rects = rects;
  }

  drawRects(rects: Rect[] = []) {
    const { canvasCtx: ctx } = this;
    rects.forEach((rect) => {
      const { vertexes, options } = rect;
      drawRect(ctx, vertexes, options)
    })
  }

  judge(data) {
    var interiorAngle = 0;
    for (var i = 0, l = data.length; i < l; i++) {
      const vector1 = { x: 0, y: 0 };
      const vector2 = { x: 0, y: 0 };
      if (i == l - 1) {
        vector1.x = data[l - 1].x - data[0].x;
        vector1.y = data[l - 1].y - data[0].y;
        vector2.x = data[1].x - data[0].x;
        vector2.y = data[1].y - data[0].y;
      } else if (i == l - 2) {
        vector1.x = data[i].x - data[l - 1].x;
        vector1.y = data[i].y - data[l - 1].y;
        vector2.x = data[0].x - data[l - 1].x;
        vector2.y = data[0].y - data[l - 1].y;
      } else {
        vector1.x = data[i].x - data[i + 1].x;
        vector1.y = data[i].y - data[i + 1].y;
        vector2.x = data[i + 2].x - data[i + 1].x;
        vector2.y = data[i + 2].y - data[i + 1].y;
      }
      interiorAngle += this.vectorAngle(
        vector1.x,
        vector2.x,
        vector1.y,
        vector2.y
      );
    }
    if (isNaN(interiorAngle)) {
      return "repeat";
    } else if (
      interiorAngle >= (l - 2) * 180 - 1 &&
      interiorAngle <= (l - 2) * 180 + 1
    ) {
      return true;
    } else {
      return false;
    }
  }

  vectorAngle(x1, x2, y1, y2) {
    /**
     * 已知向量a, b
     * a = (x1, y1)
     * b = (x1,y1)
     * ab = |a||b|cosα
     * cosα = ab / |a||b|
     * a = ab => x1 * x2 + y1 * y2
     * |a| =>  x1^2 + y1^2 求平方根
     * |b| =>  x2^2 + y2^2 求平方根
     * d = |a||b|
     * a/d > ab / |a||b|
     *
     * */

    var a = x1 * x2 + y1 * y2; // 两个向量相乘
    var b = Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2)); // 计算模
    var c = Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2)); // 计算模
    var d = b * c;
    var cos = a / d;
    var acos = (Math.acos(cos) / Math.PI) * 180;
    return acos;
  }

  setConvexPolygonJudge(value) {
    this.convexPolygonJudge = value;
  }
}
