/**
 * 坐标类型
 * lng: 经度
 * lat: 纬度
 */
export interface Coordinate {
  lng: number;
  lat: number;
}

export type Point = [number, number] | Coordinate;

export interface Bounds {
  sw: Coordinate;
  ne: Coordinate;
}
