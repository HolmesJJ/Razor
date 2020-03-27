import { Point, PolylineOptions } from "../../types";

abstract class RazorMapPolyline {
  map!: any;

  polyline!: any;

  arrows!: any[];

  options!: PolylineOptions;

  constructor(map: any) {
    this.map = map;
  }

  abstract addPolyline(path: Point[], options?: any): void;

  abstract removePolyline(): void;

  abstract setPath(path: Point[]): void;

  abstract getPath(): any;

  abstract setStrokeColor(color: string): void;

  abstract getStrokeColor(): string;

  abstract setStrokeWeight(weight: number): void;

  abstract getStrokeWeight(): number;

  abstract setStrokeOpacity(opacity: number): void;

  abstract getStrokeOpacity(): number;

  abstract setStrokeStyle(style: "solid" | "dashed"): void;

  abstract getStrokeStyle(): "solid" | "dashed";

  abstract hidePolyline(): void;

  abstract showPolyline(): void;
}

export default RazorMapPolyline;
