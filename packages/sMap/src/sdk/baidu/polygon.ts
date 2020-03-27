import RazorMapPolygon from "../_abstract/polygon";
import { Point, PolygonOptions } from "../../types";
import { bindEvent, RazorMapEvent } from "./utils/event";
import { getPoint } from "./utils/unit";

class BaiduMapPolygon extends RazorMapPolygon {
  map!: any;

  polygon!: any;

  _savedHandlers: { [k: string]: Function } = {};

  constructor(map: any) {
    super(map);
  }

  genPoints(path: Point[]) {
    return path.map((p: Point) => getPoint(p));
  }

  setOptions(options: PolygonOptions) {
    this.options = options;
  }

  addPolygon(path: Point[], options?: PolygonOptions, listeners?: Record<string, Function | Function[]>) {
    const points = this.genPoints(path);

    if (options) {
      this.setOptions(options);
    }

    const Polygon = (window as any).BMap.Polygon;
    this.polygon = new Polygon(points, this.options);
    this.map.addOverlay(this.polygon);

    if (listeners) {
      Object.keys(listeners).forEach((key: string) => {
        this._savedHandlers[key] = bindEvent(listeners[key], this.map);

        this.polygon.addEventListener(key, this._savedHandlers[key]);
      })
    }
  }

  removePolygon() {
    Object.keys(this._savedHandlers).forEach((key: string) => {
      this.polygon.removeEventListener(key, this._savedHandlers[key]);
    })
    this.map.removeOverlay(this.polygon);
  }

  getPolygon(): any {
    return this.polygon;
  }

  setPath(path: Point[]) {
    this.polygon.setPath(this.genPoints(path));
  }

  getPath() {
    return this.polygon.getPath();
  }

  setStrokeColor(color: string) {
    this.polygon.setStrokeColor(color);
  }

  getStrokeColor(): string {
    return this.polygon.getStrokeColor();
  }

  setStrokeWeight(weight: number) {
    this.polygon.setStrokeWeight(weight);
  }

  getStrokeWeight(): number {
    return this.polygon.getStrokeWeight();
  }

  setStrokeOpacity(opacity: number) {
    this.polygon.setStrokeOpacity(opacity);
  }

  getStrokeOpacity(): number {
    return this.polygon.getStrokeOpacity();
  }

  setStrokeStyle(style: "solid" | "dashed") {
    this.polygon.setStrokeStyle(style);
  }

  getStrokeStyle(): "solid" | "dashed" {
    return this.polygon.getStrokeStyle();
  }

  setFillColor(color: string) {
    this.polygon.setFillColor(color);
  }

  getFillColor(): string {
    return this.polygon.getFillColor();
  }

  hidePolygon() {
    this.polygon && this.polygon.hide();
  }

  showPolygon() {
    this.polygon && this.polygon.show();
  }
}

export default BaiduMapPolygon;
