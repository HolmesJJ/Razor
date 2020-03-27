import { Point, CircleOptions } from "../../types";

abstract class RazorMapCircle {
  map!: any;

  circle!: any;

  options!: CircleOptions;

  constructor(map: any) {
    this.map = map;
  }

  abstract addCircle(center: Point, radius: number, options?: any): void;

  abstract removeCircle(): void;

  abstract setCenter(center: Point): void;
}

export default RazorMapCircle;
