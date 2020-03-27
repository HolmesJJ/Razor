import { Point } from "./point";

export interface RazorMapSetting {
  center: Point;
  zoom: number;
  draggable: boolean;
  minZoom?: number;
  maxZoom?: number;
  enableScrollWheelZoom?: boolean;
}
