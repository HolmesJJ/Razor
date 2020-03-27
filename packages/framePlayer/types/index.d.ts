import { Boundings } from "pkg/image/src/imageCalculator";

export interface VideoConfig {
  needSwitcher: boolean;
  needVideo: boolean;
  needPlay: boolean;
  needImg: boolean;
  needDownload: boolean;
  needZoom: boolean;
  needFullScreen: boolean;
  needCut: boolean;
  needFaceRect: boolean;
  showFaceRect: boolean;
  needBodyRect: boolean;
  showBodyRect: boolean;
  showController: boolean;
  canZoom: boolean;
}

export interface LabelConfig {
  play: string;
  pause: string;
  zoom: string;
  download: string;
  fullscreen: string;
  cut: string;
  image: string;
  video: string;
  pre: string;
  next: string;
  faceRect: string;
  bodyRect: string;
}

export interface ZoomInfo {
  scale: number;
  transformX: number;
  transformY: number;
}

export type OperationType = "cut" | "display";

export interface ImageList {
  src: string;
  faceBounding?: Boundings;
  bodyBounding?: Boundings;
}
