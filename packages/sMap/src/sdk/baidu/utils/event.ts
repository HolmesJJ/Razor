import { Coordinate, Bounds, Point } from "../../../types";
export interface BaiduEvent {
  type: string;
  target: {
    [k: string]: any;
  };
  point?: Coordinate;
  pixel?: { x: number; y: number };
  domEvent?: Event;
  polygon?: { type: 'rectangle' | 'polygon', path: Point[], center: Point, bounds: Bounds };
  circle?: { center: Point, radius: number };
}

export class RazorMapEvent {
  type: string;

  target: any;

  zoom: number;

  bounds: Bounds;

  originalEvent?: Event;

  pixel?: { x: number; y: number };

  point?: Coordinate;

  polygon?: { type: 'rectangle' | 'polygon', path: Point[], center: Point, bounds: Bounds }

  circle?: { center: Point, radius: number };

  constructor(e: BaiduEvent, map: any) {
    this.type = e.type;
    this.target = e.target;
    this.zoom = map.getZoom();
    const bounds = map.getBounds();
  
    this.bounds = {
      sw: bounds.getSouthWest(),
      ne: bounds.getNorthEast()
    };

    const { pixel, point, domEvent, polygon, circle } = e;
    this.pixel = pixel;
    this.point = point;
    this.originalEvent = domEvent;
    this.polygon = polygon;
    this.circle = circle;
  }
}

export const bindEvent = (handler: Function | Function[], map: any) => {
  if (typeof handler === "function") {
    handler = [handler];
  }

  return (e: BaiduEvent) => {
    /**
     * handler is a custom function
     * e.p: handleMarkerClick($event, marker)
     */
    (handler as Function[]).forEach((h: Function) => {
      h(new RazorMapEvent(e, map));
    });
  };
};
