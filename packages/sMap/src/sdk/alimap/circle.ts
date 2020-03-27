import { Point, CircleOptions } from "../../types";
import { getPoint } from "./utils/unit";
import RazorMapCircle from "../_abstract/circle";

class AliMapCircle extends RazorMapCircle{

  options: CircleOptions = {
    fillColor: "#fff",
    fillOpacity: 0.6,
    strokeColor: "red",
    strokeWeight: 2,
    strokeOpacity: 1,
    strokeStyle: window.IMAP.Constants.OVERLAY_LINE_SOLID
  };

  constructor(map: any) {
    super(map);
  }

  addCircle(center: Point, radius: number, options?: CircleOptions) {
    if (options) {
      this.setOptions(options);
    }
    this.circle = new window.IMAP.Circle(getPoint(center), radius, this.options);

    this.map.getOverlayLayer().addOverlay(this.circle, false);
  }

  removeCircle() {
    this.map.getOverlayLayer().removeOverlay(this.circle);
  }

  setCenter(center: Point) {
    this.circle.setCenter(getPoint(center));
  }

  setOptions(options: CircleOptions) {
    this.options = options;
  }

  setStrokeColor(color: string) {
    this.circle.setAttribute({ strokeColor: color });
  }

  getStrokeColor(): string {
    const { strokeColor } = this.circle.getAttribute();
    return strokeColor;
  }

  setStrokeWeight(weight: number) {
    this.circle.setAttribute({ strokeWeight: weight });
  }

  getStrokeWeight(): number {
    const { strokeWeight } = this.circle.getAttribute();
    return strokeWeight;
  }

  setStrokeOpacity(opacity: number) {
    this.circle.setAttribute({ strokeOpacity: opacity });
  }

  getStrokeOpacity(): number {
    const { strokeOpacity } = this.circle.getAttribute();
    return strokeOpacity;
  }

  setStrokeStyle(style: "solid" | "dashed") {
    this.circle.setAttribute({ strokeStyle: style });
  }

  getStrokeStyle(): "solid" | "dashed" {
    const { strokeStyle } = this.circle.getAttribute();
    return strokeStyle;
  }
}

export default AliMapCircle;
