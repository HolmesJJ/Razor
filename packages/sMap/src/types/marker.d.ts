import { Point } from './point';

export interface Offset {
  x: number,
  y: number
}
export interface MarkerConfig {
  icon?: IconConfig,
  customElement?: any
  position: Point,
  offset?: Offset,
  customData?: any
}

export interface IconConfig {
  url: string;
  width: number;
  height: number;
}

export interface BaiduCustomMarkOptions {
  offset: Offset,
  listeners?:  Record<string, Function | Function[]>,
  customData?: any;
}