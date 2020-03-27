import { PolygonOptions, Point } from "../../types";

abstract class RazorMapPolygon {
  map!: any;

  polygon!: any;

  options!: PolygonOptions;

  constructor(map: any) {
    this.map = map;
  }

  abstract addPolygon(path: Point[], options?: PolygonOptions, eventListeners?: any): void;

  abstract removePolygon(): void;

  abstract getPolygon(): any;

  abstract setPath(path: Point[]): void;

  abstract getPath(): any;

  abstract setStrokeColor(color: string): void;

  abstract getStrokeColor(): any;

  abstract setFillColor(color: string): void;

  abstract getFillColor(): string;

  abstract setStrokeWeight(weight: number): void;

  abstract getStrokeWeight(): number;

  abstract setStrokeOpacity(opacity: number): void;

  abstract getStrokeOpacity(): number;

  abstract setStrokeStyle(style: "solid" | "dashed"): void;

  abstract getStrokeStyle(): "solid" | "dashed";

  abstract showPolygon(): void;

  abstract hidePolygon(): void;
}

export default RazorMapPolygon;
