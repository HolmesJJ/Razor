import { Point } from "./point";

export interface HeatmapPoint {
  lng: number;
  lat: number;
  count: number;
}

export interface HeatmapConfig {
  radius: number;
  opacity: number;
  gradient: object;
}
