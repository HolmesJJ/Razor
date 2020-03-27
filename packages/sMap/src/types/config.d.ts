import { RazorMapSetting } from "./setting";
import { Point } from './point';
import { MarkerConfig } from "./marker";

export type RazorMapType = "baidu" | "minemap" | "alimap";

export type RazorMapUrlType = "script" | "stylesheet";

export type RazorMapStyle = 'normal' | 'midnight';

export interface BaiduMapConfig {
  url?: string;
  theme?: RazorMapStyle,
  drawingManagerUrl?: string,
  drawingManagerCss?: string,
  offline?:boolean,
  offlineHome?: string,
  offlineTilesDir?: string,
}

export interface AliMapConfig {
  url: [[string, RazorMapUrlType]];
  theme?: RazorMapStyle
}

export interface MineMapConfig {
  url: string;
  cssLink: string;
  ak: string;
  host: string;
  theme: number;
}

// export type ConfigContentType = BaiduMapConfig | MineMapConfig;
export type ConfigContentType = any;

export interface RazorMapConfig {
  readonly type: RazorMapType;
  content: ConfigContentType;
  setting?: RazorMapSetting;
}
