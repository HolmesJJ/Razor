import { RazorMapSetting, ConfigContentType, Point, Bounds } from "../../types";

abstract class RazorMap {
  map: any = null;

  config: ConfigContentType;

  setting!: RazorMapSetting;

  constructor(config: ConfigContentType) {
    this.config = config;
  }

  getOriginalMap() {
    return this.map;
  }

  protected setSetting(setting: RazorMapSetting) {
    this.setting = setting;
  }

  protected initSetting() {
    // implement by concreate map
  }

  abstract removeListener(
    listener: Record<string, Function | Function[]>
  ): void;

  abstract init(
    elm: string | HTMLElement,
    setting: object,
    listener?: any
  ): Promise<any>;

  abstract setCenter(center: Point): void;

  abstract getCenter(): Point;

  abstract setZoom(zoom: number): void;

  abstract getZoom(): number;

  abstract setBounds(bounds: Bounds): void;

  abstract getBounds(): Bounds;

  abstract setDraggable(dragable: boolean): void;

  abstract bindListener(listener: any): void;

  abstract setViewport(points: Point[], viewportOptions: any): void;

  abstract pointToPixel(point: Point): { x: number; y: number };

  abstract pixelToPoint(point: { x: number; y: number }): Point;

  abstract containsPoint(point: Point): Boolean

  abstract clearOverlays(): void;
}

export default RazorMap;
