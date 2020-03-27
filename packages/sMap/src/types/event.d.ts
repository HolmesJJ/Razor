import { Coordinate } from "./point";
/**
 * 基础的事件类型
 */
export interface BaseEvent {
  type: string;
  target: any;
}

export interface PositionEvent extends BaseEvent {
  point: Coordinate;
  pixel: { x: number; y: number };
  originalEvent: Event;
}


export interface ZoomEvent extends BaseEvent {
  zoom: number;
}
