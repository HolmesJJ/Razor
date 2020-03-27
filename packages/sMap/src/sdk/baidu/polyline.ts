import { Point, PolylineOptions } from "../../types";
import { getPoint } from "./utils/unit";
import RazorMapPolyline from "../_abstract/polyline";

class BaiduMapPolyline extends RazorMapPolyline {
  options: PolylineOptions = {
    strokeColor: "red",
    strokeWeight: 2,
    strokeOpacity: 1,
    strokeStyle: "solid"
  };

  constructor(map: any) {
    super(map);
  }

  genPoints(path: Point[]) {
    return path.map((p: Point) => getPoint(p));
  }

  setPath(path: Point[]) {
    this.polyline.setPath(this.genPoints(path));
  }

  getPath() {
    return this.polyline.getPath();
  }

  addPolyline(path: Point[], options?: PolylineOptions) {
    const points = this.genPoints(path);

    if (options) {
      this.setOptions(options);
    }
    if (options.arrow) {
      this.arrows = this.createArrow(points, options.strokeColor, options.strokeWeight, options.strokeOpacity);
    }
    if (options.curve) {
      this.polyline = new window.BMapLib.CurveLine(points, this.options);
    } else {
      this.polyline = new window.BMap.Polyline(points, this.options);
    }
    // 绘制折线
    this.map.addOverlay(this.polyline);
    // 如果有箭头的话绘制箭头
    if (this.arrows) {
      this.arrows.forEach((arrow) => {
        this.map.addOverlay(arrow);
      })
    }
  }

  hidePolyline() {
    this.polyline && this.polyline.hide();
    if (this.arrows) {
      this.arrows.forEach((arrow) => {
        arrow.hide();
      })
    }
  }

  showPolyline() {
    this.polyline && this.polyline.show();
    if (this.arrows) {
      this.arrows.forEach((arrow) => {
        arrow.show();
      })
    }
  }

  removePolyline() {
    this.map.removeOverlay(this.polyline);
    if (this.arrows && this.arrows.length > 0) {
      this.arrows.forEach((arrow) => {
        this.map.removeOverlay(arrow);
      })
    }
  }

  setOptions(options: PolylineOptions) {
    this.options = options;
  }

  setStrokeColor(color: string) {
    this.polyline.setStrokeColor(color);
  }

  getStrokeColor(): string {
    return this.polyline.getStrokeColor();
  }

  setStrokeWeight(weight: number) {
    this.polyline.setStrokeWeight(weight);
  }

  getStrokeWeight(): number {
    return this.polyline.getStrokeWeight();
  }

  setStrokeOpacity(opacity: number) {
    this.polyline.setStrokeOpacity(opacity);
  }

  getStrokeOpacity(): number {
    return this.polyline.getStrokeOpacity();
  }

  setStrokeStyle(style: "solid" | "dashed") {
    this.polyline.setStrokeStyle(style);
  }

  getStrokeStyle(): "solid" | "dashed" {
    return this.polyline.getStrokeStyle();
  }

  createArrow(linePoint,
    color,
    weight,
    opacity) {
    // 绘制箭头的函数
    const length = 8;
    const angleValue = Math.PI / 7;
    const arrowCount = linePoint.length;
    let arrows = [];
    for (let i = 1; i < arrowCount; i = i + 1) {
      // 在拐点处绘制箭头
      const pixelStart = this.map.pointToPixel(linePoint[i - 1]);
      const pixelEnd = this.map.pointToPixel(linePoint[i]);
      const angle = angleValue; // 箭头和主线的夹角
      const r = length; // r/Math.sin(angle)代表箭头长度
      let delta = 0; // 主线斜率，垂直时无斜率
      let param = 0; // 代码简洁考虑
      let pixelTemX;
      let pixelTemY; // 临时点坐标
      let pixelX;
      let pixelY;
      let pixelX1;
      let pixelY1; // 箭头两个点
      if (pixelEnd.x - pixelStart.x === 0) {
        // 斜率不存在时
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
          pixelTemY = pixelEnd.y + delta * r / param;
        } else {
          // 第一、四象限
          pixelTemX = pixelEnd.x - r / param;
          pixelTemY = pixelEnd.y - delta * r / param;
        }
        // 已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
        pixelX = pixelTemX + Math.tan(angle) * r * delta / param;
        pixelY = pixelTemY - Math.tan(angle) * r / param;
  
        pixelX1 = pixelTemX - Math.tan(angle) * r * delta / param;
        pixelY1 = pixelTemY + Math.tan(angle) * r / param;
      }
  
      const pointArrow = this.map.pixelToPoint({ x: pixelX, y: pixelY });
      const pointArrow1 = this.map.pixelToPoint({ x: pixelX1, y:pixelY1 });
      const arrow = new window.BMap.Polygon([pointArrow, linePoint[i], pointArrow1], {
        strokeColor: color,
        strokeWeight: weight,
        strokeOpacity: opacity,
        fillOpacity: opacity,
        fillColor: color,
      });
      arrows.push(arrow)
    };
    return arrows;
  }

  // TODO 在线体内增加小箭头的方法，暂时不需要使用，以后有空再做整理配置
  // createArrowIconSequence() {
  //   return new window.BMap.IconSequence(
  //     new window.BMap.Symbol(
  //       window.BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW,
  //       {
  //         scale: 0.7,
  //         strokeWeight: 2,
  //         rotation: 90,
  //         strokeOpacity: 0.5,
  //         fillColor: '#fff',
  //         fillOpacity: 0.5,
  //         strokeColor: '#fff',
  //       },
  //     ),
  //     '10',
  //     '80',
  //     false,
  //   )
  // }
}

export default BaiduMapPolyline;
