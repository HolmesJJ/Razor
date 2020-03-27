import { IVertex, LinearGradientOption } from 'rz/utils/canvas/layer.d';
import {
  drawLine,
  hex2rgba,
  getNextVertex,
  getSlopeAndB,
  createLinearGradient
} from 'rz/utils/canvas/utils';

interface ILine {
  start: IVertex;
  end: IVertex;
  step?: number;
  totalStep: number;
  stepGap: number;
  weight?: number;
  colorSteps?: any[];
  arrowOptions?: ArrowOptions;
}

interface ArrowOptions {
  strokeStyle: string;
  colorFill: [string, string];
}

const defaultColor = '#68cdfa';

const defaultColorSteps = [
  { distance: 0, color: hex2rgba(defaultColor, 0.8) },
  { distance: 0.3, color: hex2rgba(defaultColor, 0.5) },
  { distance: 0.5, color: hex2rgba(defaultColor, 0.3) },
  { distance: 0.8, color: hex2rgba(defaultColor, 0.5) },
  { distance: 1, color: hex2rgba(defaultColor, 0.8) }
];

const defaultArrowOpitons: ArrowOptions = {
  strokeStyle: '#68cdfa',
  colorFill: ['#68cdfa', '#68cdfa']
};

const defaultLineWeight = 6;

export function getArrowPoint(
  pixelStart: IVertex,
  pixelEnd: IVertex,
  length: number = 15
) {
  // 绘制箭头的函数
  // const length = 12;
  const angleValue = Math.PI / 7;
  const angle = angleValue; // 箭头和主线的夹角
  const r = length; // r/Math.sin(angle)代表箭头长度
  let delta = 0; // 主线斜率，垂直时无斜率
  let param = 0; // 代码简洁考虑
  let pixelTemX = 0;
  let pixelTemY = 0; // 临时点坐标
  let pixelX = 0;
  let pixelY = 0;
  let pixelX1 = 0;
  let pixelY1 = 0; // 箭头两个点
  if (pixelEnd.x - pixelStart.x === 0) {
    // 斜率不存在是时
    pixelTemX = pixelEnd.x;
    if (pixelEnd.y > pixelStart.y) {
      pixelTemY = pixelEnd.y - r;
    } else {
      pixelTemY = pixelEnd.y + r;
    }
    // 已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
    pixelX = pixelTemX - r * Math.tan(angle);
    pixelX1 = pixelTemX + r * Math.tan(angle);
    pixelY = pixelY1 = pixelTemY;
  } else {
    // 斜率存在时
    delta = (pixelEnd.y - pixelStart.y) / (pixelEnd.x - pixelStart.x);
    param = Math.sqrt(delta * delta + 1);

    if (pixelEnd.x - pixelStart.x < 0) {
      // 第二、三象限
      pixelTemX = pixelEnd.x + r / param;
      pixelTemY = pixelEnd.y + (delta * r) / param;
    } else {
      // 第一、四象限
      pixelTemX = pixelEnd.x - r / param;
      pixelTemY = pixelEnd.y - (delta * r) / param;
    }
    // 已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
    pixelX = pixelTemX + (Math.tan(angle) * r * delta) / param;
    pixelY = pixelTemY - (Math.tan(angle) * r) / param;

    pixelX1 = pixelTemX - (Math.tan(angle) * r * delta) / param;
    pixelY1 = pixelTemY + (Math.tan(angle) * r) / param;
  }
  return {
    leftArrowPoint: {
      x: pixelX,
      y: pixelY
    },
    rightArrowPoint: {
      x: pixelX1,
      y: pixelY1
    }
  };
}

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  arrowPoints: {
    endPoint: IVertex;
    leftArrowPoint: IVertex;
    rightArrowPoint: IVertex;
  },
  options: ArrowOptions = defaultArrowOpitons
) {
  const { endPoint, leftArrowPoint, rightArrowPoint } = arrowPoints;
  // 画第一条箭头线
  ctx.beginPath();
  ctx.strokeStyle = options.strokeStyle || defaultArrowOpitons.strokeStyle;
  ctx.lineWidth = 1;
  ctx.moveTo(endPoint.x, endPoint.y);
  ctx.lineTo(leftArrowPoint.x, leftArrowPoint.y);
  ctx.lineTo(rightArrowPoint.x, rightArrowPoint.y);
  ctx.moveTo(rightArrowPoint.x, rightArrowPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  const grd = ctx.createLinearGradient(0, 0, endPoint.x, 0); // 使用渐变颜色填充,从(0,0)到(200,0) （左到右）
  grd.addColorStop(0, options.colorFill[0] || defaultArrowOpitons.colorFill[1]); // 起始颜色
  grd.addColorStop(1, options.colorFill[1] || defaultArrowOpitons.colorFill[1]); // 终点颜色
  ctx.fillStyle = grd; // 以上面定义的渐变填充
  ctx.fill(); // 闭合形状并且以填充方式绘制出来
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
  ctx.save();
}
export class Line {
  start: IVertex = { x: 0, y: 0 };

  end: IVertex = { x: 0, y: 0 };

  step: number = 0;

  animateState: boolean = true;

  b: number = 1; // 纵轴交点

  slope: number = 0; // 斜率

  totalStep: number = 60;

  stepGap: number = 6;

  canvasCtx: CanvasRenderingContext2D;

  timer: number = 0;

  index: number = 0;

  colorSteps: any[] = [];

  weight: number = 5;

  arrowOptions: ArrowOptions = defaultArrowOpitons;

  emitAnimatePlayFunc: (step: number, index: number) => void;

  constructor({
    canvasCtx,
    line,
    index,
    emitAnimatePlayFunc
  }: {
    canvasCtx: CanvasRenderingContext2D;
    line: ILine;
    index: number;
    emitAnimatePlayFunc: (step: number, index: number) => void;
  }) {
    this.canvasCtx = canvasCtx;
    const {
      start,
      end,
      step,
      totalStep,
      stepGap,
      weight,
      colorSteps,
      arrowOptions
    } = line;
    const { b, slope } = getSlopeAndB(start, end);
    this.start = start;
    this.end = end;
    this.b = b;
    this.slope = slope;
    this.step = step || 0;
    this.totalStep = totalStep;
    this.stepGap = stepGap;
    this.index = index;
    this.emitAnimatePlayFunc = emitAnimatePlayFunc;
    this.weight = weight;
    this.arrowOptions = arrowOptions || defaultArrowOpitons;
    this.colorSteps =
      colorSteps && colorSteps.length ? colorSteps : defaultColorSteps;
  }

  drawOneLine(step: number) {
    const { start, end, slope, b, colorSteps, weight } = this;
    const _weight = weight || defaultLineWeight;
    const opacity = 1;
    const color = '#f60';
    const _colorSteps =
      colorSteps && colorSteps.length ? colorSteps : defaultColorSteps;
    const option: LinearGradientOption = {
      scope: [start, end],
      colorSteps: _colorSteps
    };
    // 设置 strokeStyle
    const strokeStyle = createLinearGradient(this.canvasCtx!, option);
    this.canvasCtx.strokeStyle = strokeStyle;

    if (typeof step !== 'undefined') {
      const nextEnd = getNextVertex(start, end, slope, step, this.totalStep, b);
      drawLine(this.canvasCtx, start, nextEnd, {
        color,
        weight: _weight,
        opacity,
        noStrokeStyle: true
      });
    } else {
      drawLine(this.canvasCtx, start, end, {
        color,
        weight: _weight,
        opacity,
        noStrokeStyle: true
      });
    }
  }

  drawLine() {
    const { start, end, slope, b, colorSteps, weight } = this;
    const color = '#f60';
    const _weight = weight || defaultLineWeight;
    const opacity = 1;

    const _colorSteps =
      colorSteps && colorSteps.length ? colorSteps : defaultColorSteps;
    const option: LinearGradientOption = {
      scope: [start, end],
      colorSteps: _colorSteps
    };
    // 设置 strokeStyle
    const strokeStyle = createLinearGradient(this.canvasCtx!, option);
    this.canvasCtx.strokeStyle = strokeStyle;

    const self = this;

    const draw = (resolve: Function, reject: Function) => {
      const callback = () => {
        const nextEnd = getNextVertex(
          start,
          end,
          slope,
          this.step,
          this.totalStep,
          b
        );

        if (this.step > this.totalStep || !this.animateState) {
          this.stopAnimate();
          this.step = this.totalStep;
          resolve(true);
          return;
        }

        drawLine(this.canvasCtx, start, nextEnd, {
          color,
          weight: _weight,
          opacity,
          noStrokeStyle: true
        });

        self.emitAnimatePlayFunc(this.step, this.index);
        this.step += this.stepGap;
      };

      this.startAnimate(callback);
    };
    return new Promise(draw);
  }

  drawArrow() {
    if (this.step === this.totalStep) {
      const { start, end, arrowOptions } = this;
      /* 画箭头 */
      const arrowPoints = Object.assign(getArrowPoint(start, end), {
        endPoint: end
      });
      drawArrow(this.canvasCtx, arrowPoints, arrowOptions);
    }
  }

  startAnimate(callback: Function) {
    this.timer = setInterval(callback, 16);
  }

  stopAnimate() {
    this.changeAnimateState(false);
    clearInterval(this.timer);
  }

  changeAnimateState(state: boolean) {
    this.animateState = state;
  }

  resetAnimate() {
    this.step = 0;
  }

  dispose() {
    clearInterval(this.timer);
    Object.getOwnPropertyNames(this).forEach(key => {
      this[key] = null;
    });
  }
}
