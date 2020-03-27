import { Point, CircleOptions } from "../../types";
import { getPoint } from "./utils/unit";
import RazorMapCircle from "../_abstract/circle";

class BaiduMapCircle extends RazorMapCircle{

  options: CircleOptions = {
    fillColor: "#fff",
    fillOpacity: 0.6,
    strokeColor: "red",
    strokeWeight: 2,
    strokeOpacity: 1,
    strokeStyle: "dashed"
  };

  constructor(map: any) {
    super(map);
  }

  addCircle(center: Point, radius: number, options?: CircleOptions) {
    if (options) {
      this.setOptions(options);
    }
    this.circle = new window.BMap.Circle(getPoint(center), radius, this.options);

    this.map.addOverlay(this.circle);
  }

  removeCircle() {
    this.map.removeOverlay(this.circle);
  }

  setOptions(options: CircleOptions) {
    this.options = options;
  }

  setStrokeColor(color: string) {
    this.circle.setStrokeColor(color);
  }

  getStrokeColor(): string {
    return this.circle.getStrokeColor();
  }

  setStrokeWeight(weight: number) {
    this.circle.setStrokeWeight(weight);
  }

  getStrokeWeight(): number {
    return this.circle.getStrokeWeight();
  }

  setStrokeOpacity(opacity: number) {
    this.circle.setStrokeOpacity(opacity);
  }

  getStrokeOpacity(): number {
    return this.circle.getStrokeOpacity();
  }

  setStrokeStyle(style: "solid" | "dashed") {
    this.circle.setStrokeStyle(style);
  }

  getStrokeStyle(): "solid" | "dashed" {
    return this.circle.getStrokeStyle();
  }

  setCenter(center: Point) {
    this.circle.setCenter(getPoint(center));
  }
}

export default BaiduMapCircle;
