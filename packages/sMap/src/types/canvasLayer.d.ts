interface BaiduCanvasLayerUpdateFunc {
  (canvas: HTMLCanvasElement, map: any, scope: any): void;
}

export interface BaiduCanvasLayerOptions {
  mapInstance: any;
  update: BaiduCanvasLayerUpdateFunc;
  scope?: any;
  paneName?: string;
  zIndex?: number;
}