import RazorMap from "../_abstract/map";

// utils
import loadFile from "../../shared/utils/loadFile";
import { bindEvent, getEventTypes } from "./utils/event";
import { transformLngLat } from "./utils/unit";

// types
import {
  Point,
  Bounds,
  RazorMapSetting,
  RazorMapStyle,
  RazorMapUrlType,
  ConfigContentType
} from "../../types";

const WIN_ROOT = window as any;

// 地图参数
interface AliMapSetting extends RazorMapSetting {
  dragable?: boolean;
  scrollWheel?: boolean;
}

export default class AliMap extends RazorMap {
  defaultOptions: AliMapSetting;

  // cache binded event handler
  _savedHandlers: { [k: string]: Function } = {};

  constructor(config: ConfigContentType) {
    super(config || {});
  }

  protected setSetting(setting: RazorMapSetting) {
    const { draggable: dragable, enableScrollWheelZoom: scrollWheel } = setting;
    this.defaultOptions = { ...setting, dragable, scrollWheel };
  }

  bindListener(listeners: Record<string, Function | Function[]>) {
    Object.keys(listeners).forEach((lKey: string) => {
      if (!getEventTypes(window.IMAP)[lKey]) return;
      // cache handler
      this._savedHandlers[lKey] = bindEvent(listeners[lKey], this.map);
      // bind event
      this.map.addEventListener(lKey, this._savedHandlers[lKey]);
    });
  }

  removeListener(listener: Record<string, Function | Function[]>) {
    Object.keys(listener).forEach((lKey: string) => {
      this.map.removeEventListener(lKey, this._savedHandlers[lKey]);
    });
  }

  /**
   * 装载地图资源文件
   */
  async _load(links: [[string, RazorMapUrlType]]) {
    return Promise.all(links.map(([link, type]) => loadFile(link, type)));
  }

  /**
   * 获取不同皮肤对应的URL
   * @param theme 皮肤样式
   */
  _getUrl(theme: RazorMapStyle) {
    const { host } = WIN_ROOT;
    const links = []; // 0:瓦片图地址 - 1:路网地址
    switch (theme) {
      case "normal":
        links.push(["http://{s}/v3/tile?x={x}&y={y}&z={z}", [`${host}:25333`]]); // 瓦片图
        links.push(`http://${host}:25888/v3/tile?x={x}&y={y}&z={z}`); // 路网层
        break;
      case "midnight":
        links.push(["http://{s}/v3/tile?x={x}&y={y}&z={z}", [`${host}:25003`]]); // 瓦片图
        links.push(`http://${host}:25033/v3/tile?x={x}&y={y}&z={z}`); // 路网层
        break;
      default:
        break;
    }
    return links;
  }

  /**
   * 初始化地图
   * @param elm dom element or dom id
   * @param config map config
   * @param setting map setting
   */
  async init(
    elm: string | HTMLElement,
    setting: RazorMapSetting,
    listener?: any
  ): Promise<any> {
    try {
      const {
        setting: mapConfig,
        content: { url, theme = "normal" }
      } = this.config;
      const { main, deps, conf } = url;

      // 加载地图资源
      if (!window.IMAP) {
        await this._load(main);
        await this._load(deps);
        await this._load(conf);
      }

      // set setting
      this.setSetting(mapConfig || setting);

      // 根据不同皮肤取URL
      const [tileUrl, roadNetUrl] = this._getUrl(theme);

      // 动态修改路网地址
      WIN_ROOT.ROADNET_URL = roadNetUrl;

      /**
       * 这里需要定时去获取MAP容器的宽高
       * 只有宽高有值的时候才能正常render地图
       * 否则会出现地图半截的情况，影响体验
       */
      WIN_ROOT.map = this.map = new window.IMAP.Map(elm, {
        ...this.defaultOptions,
        center: transformLngLat(this.defaultOptions.center),
        tileUrl,
        animation: true //设置地图缩放动画效果
      });
      WIN_ROOT.addRoadNetLayer();
      this.bindListener(listener);
      return this.map;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * set map center
   * @param center
   */
  setCenter(center: Point) {
    const position = transformLngLat(center);
    this.map.setCenter(position);
  }

  /**
   * get current map center point
   */
  getCenter(): Point {
    return this.map.getCenter();
  }

  /**
   * set map zoom
   * @param zoom
   */
  setZoom(zoom: number) {
    this.map && this.map.setZoom(zoom);
  }

  /**
   * return current map zoom level
   */
  getZoom(): number {
    return this.map.getZoom();
  }

  setBounds(bounds: Bounds) {
    const { ne: northeast, sw: southwest } = bounds;
    this.map.setBounds({ northeast, southwest });
  }

  getBounds(): Bounds {
    const {
      northeast: { lng: neX, lat: neY },
      southwest: { lng: swX, lat: swY }
    } = this.map.getBounds();
    return { ne: { lng: neX, lat: neY }, sw: { lng: swX, lat: swY } };
  }

  setViewport(points: Point[], viewportOptions?: any) {
    if (points[0] && points.length === 1) {
      this.setCenter(points[0]);
      return;
    }
    const markers = points
      .map(point => transformLngLat(point))
      .map(lnglat => new window.IMAP.Marker(lnglat));
    this.map.setFitView(markers);
  }

  /**
   * set map draggable
   * @param {boolean} draggable
   */
  setDraggable(draggable: boolean) {
    this.map.dragged(draggable);
  }

  /* to be implement 待实现者实现 */
  pointToPixel(point: Point): { x: number; y: number } {
    return { x: 0, y: 0 };
  }

  /* to be implement 待实现者实现*/
  pixelToPoint(point: { x: number; y: number }): Point {
    return { lng: 0, lat: 0 };
  }

  /* to be implement 待实现者实现*/
  containsPoint(point:Point):Boolean{
    return true
  }

  clearOverlays() {
    // todo
  }
}
