// import { Point } from "../../../types";
import isArray from "lodash/isArray";

export const getPoint = (point: any) => {
  if (isArray(point)) {
    point = {
      lng: point[0],
      lat: point[1]
    };
  }
  return new (window as any).BMap.Point(point.lng, point.lat);
};

export const getSize = (x: number, y: number) => {
  return new (window as any).BMap.Size(x, y);
};

export const getPixel = (point: any) => {
  return new (window as any).BMap.pointToPixel(point);
};