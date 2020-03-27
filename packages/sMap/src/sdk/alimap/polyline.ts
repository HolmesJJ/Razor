import { Point, PolylineOptions } from "../../types";
import { getPoint } from "./utils/unit";
import RazorMapPolyline from "../_abstract/polyline";

class AliMapPolyline extends RazorMapPolyline {
  options: PolylineOptions = {
    strokeColor: "red",
    strokeWeight: 2,
    strokeOpacity: 1,
    strokeStyle: window.IMAP.Constants.OVERLAY_LINE_SOLID
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
    if (!path.length) return;

    const points = this.genPoints(path);

    if (options) {
      this.setOptions(options);
    }
    if (options.curve) {
      // 暂不支持弧形
    } else {
      this.polyline = new window.IMAP.Polyline(points, this.options);
    }
    // 绘制折线
    this.map.getOverlayLayer().addOverlay(this.polyline, false);
  }

  hidePolyline() {
    this.polyline && this.polyline.visible(false);
  }

  showPolyline() {
    this.polyline && this.polyline.visible(true);
  }

  removePolyline() {
    this.map.getOverlayLayer().removeOverlay(this.polyline);
  }

  setOptions(options: PolylineOptions) {
    this.options = options;
  }

  setStrokeColor(color: string) {
    this.polyline.setAttribute({ strokeColor: color });
  }

  getStrokeColor(): string {
    const { strokeColor } = this.polyline.getAttribute();
    return strokeColor;
  }

  setStrokeWeight(weight: number) {
    this.polyline.setAttribute({ strokeWeight: weight });
  }

  getStrokeWeight(): number {
    const { strokeWeight } = this.polyline.getAttribute();
    return strokeWeight;
  }

  setStrokeOpacity(opacity: number) {
    this.polyline.setAttribute({ strokeOpacity: opacity });
  }

  getStrokeOpacity(): number {
    const { strokeOpacity } = this.polyline.getAttribute();
    return strokeOpacity;
  }

  setStrokeStyle(style: "solid" | "dashed") {
    this.polyline.setAttribute({ strokeStyle: style });
  }

  getStrokeStyle(): "solid" | "dashed" {
    const { strokeStyle } = this.polyline.getAttribute();
    return strokeStyle;
  }
}

export default AliMapPolyline;
