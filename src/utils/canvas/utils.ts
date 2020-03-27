import {
  IVertex,
  Ellipse,
  DrawPolygonOption,
  DrawLineOption,
  DrawCircleOption,
  DrawEllipseOption,
  DrawRectOption,
  LinearGradientOption,
  DrawRoundRectConfig,
} from './layer.d';

/**
 * 16进制颜色值转为 rgba
 * @param hexColor ("#ffffff")
 * @param opacity number
 */
export function hex2rgba(hexColor, opacity) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const result = `rgba(${r}, ${g}, ${b}, ${opacity})`;
  return result;
}
/**
 *
 * @param target {object}
 */
export function isObject(target) {
  return (
    Object.prototype.toString.call(target).toLowerCase() === '[object object]'
  );
}

/**
 *
 * @param target {string | any}
 */
export function isString(target) {
  return (
    Object.prototype.toString.call(target).toLowerCase() === '[object string]'
  );
}

/**
 *
 * @param target {object}
 * @param options {object}
 */
export function mergeOptions(target, options) {
  if (!isObject(target) || !isObject(options)) {
    throw new Error('params must be object');
  }

  Object.keys(options).forEach(key => {
    if (options[key] && !target[key]) {
      target[key] = options[key];
      return;
    }

    if (isObject(target[key]) && isObject(options[key])) {
      mergeOptions(target[key], options[key]);
    } else {
      const isType =
        Object.prototype.toString.call(options[key]).toLowerCase() ===
        Object.prototype.toString.call(target[key]).toLowerCase();
      if (!isType && target[key] != undefined) {
        throw new Error(`params ${key}  must be ${typeof target[key]}`);
      } else {
        target[key] = options[key];
      }
    }
  });
}

/**
 *
 * @param ctx
 * @param vertex
 * @param radius
 * @param options
 */
export const drawCircle = (
  ctx: any,
  vertex: IVertex,
  radius,
  options: DrawCircleOption
) => {
  if (!options.hasOwnProperty('dashed') || options.dashed === false) {
    ctx.setLineDash([]);
  } else {
    const _dashedConfig =
      options.dashedConfig && options.dashedConfig.length
        ? options.dashedConfig
        : [5, 5, 5];
    ctx.setLineDash(_dashedConfig);
  }
  const { lineColor, weight, opacity, fillColor } = options;
  ctx.beginPath();
  ctx.arc(vertex.x, vertex.y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = hex2rgba(fillColor, opacity);
  ctx.fill();
  ctx.lineWidth = weight;
  ctx.strokeStyle = lineColor;
  ctx.stroke();
};

/**
 *
 * @param ctx
 * @param vertexes
 * @param drawPolyOption
 */
export const drawPolygon = (
  ctx: any,
  vertexes: IVertex[],
  drawPolyOption: DrawPolygonOption
) => {
  const { lineColor, fillColor, weight, opacity } = drawPolyOption;
  ctx.fillStyle = hex2rgba(fillColor, opacity);
  ctx.lineWidth = weight;
  ctx.strokeStyle = hex2rgba(lineColor, opacity);
  ctx.beginPath();
  ctx.moveTo(vertexes[0].x, vertexes[0].y);
  for (let i = 1; i < vertexes.length; i++) {
    const { x, y } = vertexes[i];
    ctx.lineTo(x, y);
  }
  ctx.lineTo(vertexes[0].x, vertexes[0].y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

/**
 *
 * @param ctx
 * @param start
 * @param end
 * @param drawLineOption
 */
export const drawLine = (
  ctx: any,
  start: IVertex,
  end: IVertex,
  drawLineOption: DrawLineOption
): any => {
  const { color, weight, opacity, strokeStyle, noStrokeStyle } = drawLineOption;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);

  if (!noStrokeStyle) {
    const style = hex2rgba(color, opacity);
    ctx.strokeStyle = strokeStyle ? strokeStyle : style;
  }

  ctx.lineWidth = weight;
  ctx.stroke();
  return {
    start,
    end
  };
};

export function drawRect(
  ctx: any,
  rect: [IVertex, IVertex],
  drawRectOption: DrawRectOption
) {
  const {
    lineColor,
    fillColor,
    weight,
    opacity,
    dashed,
    dashedConfig
  } = drawRectOption;
  ctx.beginPath();

  // 虚线设置
  if (dashed) {
    const _dashedConfig =
      dashedConfig && dashedConfig.length ? dashedConfig : [5, 5, 5];
    ctx.setLineDash(_dashedConfig);
  } else {
    ctx.setLineDash([]);
  }

  ctx.lineWidth = weight;
  ctx.strokeStyle = hex2rgba(lineColor, opacity);
  if (fillColor) { ctx.fillStyle = hex2rgba(fillColor, opacity) };

  const [{ x: startX, y: startY }, { x: endX, y: endY }] = rect;
  const width = endX - startX;
  const height = endY - startY;

  ctx.rect(startX, startY, width, height);

  fillColor && ctx.fill()

  ctx.stroke();
  return rect;
}

export function drawEllipse(
  ctx: any,
  ellipse: Ellipse,
  drawEllipseOption: DrawEllipseOption
) {
  const {
    vertex: { x, y },
    radius: { minorAxis, macroAxis }
  } = ellipse;
  const {
    fillColor,
    opacity,
    linearFlag,
    linearStartPoint,
    linearEndPoint,
    startRadius,
    endRadius,
    colorItems
  } = drawEllipseOption;
  ctx.save();
  let grd = null;
  if (linearFlag) {
    grd = ctx.createLinearGradient(
      linearStartPoint.x,
      linearStartPoint.y,
      linearEndPoint.x,
      linearEndPoint.y
    );
    colorItems.forEach(item => {
      grd.addColorStop(item.position, item.color);
    });
  } else {
    grd = ctx.createRadialGradient(x, y, startRadius, x, y, endRadius);
    colorItems.forEach(item => {
      grd.addColorStop(item.position, item.color);
    });
  }

  ctx.fillStyle = grd;
  var step = minorAxis > macroAxis ? 1 / minorAxis : 1 / macroAxis;
  ctx.beginPath();
  ctx.moveTo(x + minorAxis, y);
  for (let i = 0; i < 2 * Math.PI; i += step) {
    ctx.lineTo(x + minorAxis * Math.cos(i), y + macroAxis * Math.sin(i));
  }
  ctx.closePath();
  ctx.fill();
}

/**
 *
 * @param ctx
 * @param rect
 */
export const clearCanvas = (
  ctx: any,
  rect: { width: number; height: number }
) => {
  const { width, height } = rect;
  ctx.clearRect(0, 0, width, height);
};

/**
 *
 * @param event {mouseEvent}
 */
export function transformVertex(event, zoom = 1): IVertex {
  const { offsetX: x, offsetY: y } = event;
  return { x: x / zoom, y: y / zoom };
}

export function isInRect(vertex: IVertex, rect: [IVertex, IVertex]): boolean {
  if (
    vertex.x > rect[0].x &&
    vertex.x < rect[1].x &&
    vertex.y > rect[0].y &&
    vertex.y < rect[1].y
  ) {
    return true;
  }
  return false;
}
/**
 * 在 canvas 上下文新建一个渐变区域
 * @param ctx 
 * @param option 
 */
export const createLinearGradient = (
  ctx: CanvasRenderingContext2D,
  option: LinearGradientOption
) => {
  const { scope, colorSteps } = option;
  const [start, end] = scope;
  const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);

  colorSteps.forEach((step, index) => {
    gradient.addColorStop(step.distance, step.color);
  });
  return gradient;
};

/**
 * 获取两个点连线的方向
 * @param start IVetex
 * @param end IVetex
 */
export function getDirection(start: IVertex, end: IVertex) {
  let left: boolean = false;
  let top: boolean = false;
  let right: boolean = false;
  let bottom: boolean = false;

  if (start.x <= end.x) {
    right = true;
  } else {
    left = true;
  }

  if (start.y <= end.y) {
    bottom = true;
  } else {
    top = true;
  }

  return {
    left,
    top,
    right,
    bottom
  };
}

/**
 * @param start IVertex
 * @param end IVertex
 *  知道两点, 获取两点连线 斜率 和 纵轴交点
 */
export function getSlopeAndB(
  start: IVertex,
  end: IVertex
): { slope: number; b: number } {
  const { y: y1, x: x1 } = start;
  const { y: y2, x: x2 } = end;
  const xDistance = x1 - x2;
  const yDistance = y1 - y2;
  const b = y1 - x1 * (yDistance / xDistance);

  return {
    b,
    slope: yDistance / xDistance
  };
}

/**
 * 按照斜率方程(斜率/纵轴交点) 和 步数以及总步数来 算出下一个点的坐标
 * @param start: IVertex,
 * @param end: IVertex,
 * @param slope: number,
 * @param stepIndex: number,
 * @param totalStep: number,
 * @param b: number
 */
export function getNextVertex(
  start: IVertex,
  end: IVertex,
  slope: number,
  stepIndex: number,
  totalStep: number,
  b: number
): IVertex {
  const { y: y1, x: x1 } = start;
  const { y: y2, x: x2 } = end;

  const xDistance = Math.abs(x1 - x2) * (stepIndex / totalStep);

  const direction = getDirection(start, end);
  let x = x1 + xDistance;

  if (direction.left) {
    x = x1 - xDistance;
  }

  const y = slope * x + b;

  return { x, y };
}

export interface ArrowOptions {
  strokeStyle: string;
  colorFill: [string, string];
}

const defaultArrowOpitons: ArrowOptions = {
  strokeStyle: '#68cdfa',
  colorFill: ['#68cdfa', '#68cdfa']
};

/* 获取画箭头两端的点 */
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

/* 根据计算出来的箭头的点, 画箭头 */
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

/**
 * 绘制圆角矩形
 * @param ctx
 * @param roundRect: DrawRoundRectConfig 圆角矩形配置结构
 * @param options : DrawRectOption  圆角矩形样式
 */
export function drawRoundRect(
  ctx:CanvasRenderingContext2D,
  roundRect:DrawRoundRectConfig,
  options:DrawRectOption
){
  // start 为左上角第一个顶点坐标
  const {
    start,
    width,
    height,
    radius,
  } = roundRect;
  const {x,y} = start;
  ctx.beginPath();
  ctx.moveTo(x, y);
  // 上边线
  ctx.lineTo(x + width, y);
  // 右上圆角
  ctx.arcTo(x + width + radius, y, x + width + radius, y + radius, radius);
  // 右边线
  ctx.lineTo(x + width + radius, y + height + radius);
  // 右下圆角
  ctx.arcTo(x + width + radius, y + height + 2 * radius, x + width, y + height + 2 * radius, radius);
  // 下边线
  ctx.lineTo(x, y + height + 2 * radius);
  // 左下圆角
  ctx.arcTo(x - radius, y + height + 2 * radius, x + -radius, y + height + radius, radius);
  // 左边线
  ctx.lineTo(x - radius, y + radius);
  // 左上圆角
  ctx.arcTo(x - radius, y, x, y, radius);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fillStyle = options.fillColor;
  ctx.lineWidth = options.weight;
  ctx.strokeStyle = options.lineColor;
  ctx.stroke();
  ctx.fill();
}


