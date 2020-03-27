import RazorMapPolygon from "../_abstract/polygon";
import { Point, PolygonOptions } from "../../types";
import { getPoint } from "./utils/unit";

class AliMapPolygon extends RazorMapPolygon {
  map!: any;

  polygon!: any;

  constructor(map: any) {
    super(map);
  }

  genPoints(path: Point[]) {
    return path.map((p: Point) => getPoint(p));
  }

  setOptions(options: PolygonOptions) {
    this.options = options;
  }

  addPolygon(path: Point[], options?: PolygonOptions) {
    const points = this.genPoints(path);

    if (options) {
      this.setOptions(options);
    }

    // const Polygon = new window.IMAP.Polygon;
    this.polygon = new window.IMAP.Polygon(points, this.options);
    this.map.getOverlayLayer().addOverlay(this.polygon, false);
  }

  removePolygon() {
    this.map.getOverlayLayer().removeOverlay(this.polygon);
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
    this.polygon.setAttribute({ strokeColor: color });
  }

  getStrokeColor(): string {
    const { strokeColor } = this.polygon.getAttribute();
    return strokeColor;
  }

  setStrokeWeight(weight: number) {
    this.polygon.setAttribute({ strokeWeight: weight });
  }

  getStrokeWeight(): number {
    const { strokeWeight } = this.polygon.getAttribute();
    return strokeWeight;
  }

  setStrokeOpacity(opacity: number) {
    this.polygon.setAttribute({ strokeOpacity: opacity });
  }

  getStrokeOpacity(): number {
    const { strokeOpacity } = this.polygon.getAttribute();
    return strokeOpacity;
  }

  setStrokeStyle(style: "solid" | "dashed") {
    this.polygon.setAttribute({ strokeStyle: style });
  }

  getStrokeStyle(): "solid" | "dashed" {
    const { strokeStyle } = this.polygon.getAttribute();
    return strokeStyle;
  }

  setFillColor(color: string) {
    this.polygon.setAttribute({ fillColor: color });
  }

  getFillColor(): string {
    const { fillColor } = this.polygon.getAttribute();
    return fillColor;
  }

  hidePolygon() {
    this.polygon && this.polygon.visible(false);
  }

  showPolygon() {
    this.polygon && this.polygon.visible(true);
  }
}

export default AliMapPolygon;
