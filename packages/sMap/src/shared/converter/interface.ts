import { mapPrecision } from "./constant";

export interface CoordinatePoint {
  lng: number;
  lat: number;
}

export type ConverterFn = (point: CoordinatePoint) => CoordinatePoint;

export abstract class ConverteStrategy {
  precision: number;

  constructor(unit = "m") {
    this.precision = mapPrecision[unit];
  }

  abstract doConvert(Point: CoordinatePoint): CoordinatePoint;
}
