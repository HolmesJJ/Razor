import RazorMap from '../_abstract/map';

// utils
import loadFile from '../../shared/utils/loadFile';
import { loadGlobalVar } from '../../shared/utils/loadFile';
import bindEventAsync from '../../shared/utils/bindEventAsync';
import { bindEvent, RazorMapEvent, BaiduEvent } from './utils/event';
import { getPoint } from './utils/unit';

// themes
import themes from './themes';

// types
import {
  Point,
  RazorMapSetting,
  ConfigContentType,
  Bounds,
  Coordinate
} from '../../types';
/**
 * 百度地图 `type` 值
 * http://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference_3_0.html#a5b0
 */
type BaiduMapType =
  | 'BMAP_NORMAL_MAP'
  | 'BMAP_SATELLITE_MAP'
  | 'BMAP_HYBRID_MAP';

/**
 * 百度地图 `MapOptions`
 * http://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference_3_0.html#a0b1
 */
interface BaiduMapOptions {
  minZoom?: number;
  maxZoom?: number;
  mapType?: BaiduMapType;
  enableHighResolution?: boolean;
  enableAutoResize?: boolean;
  enableMapClick?: boolean;
}

class BaiduMap extends RazorMap {
  // 百度地图默认设置
  // http://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference_3_0.html#a0b1
  defaulOptions: BaiduMapOptions = {
    enableMapClick: false, // 该选项百度地图默认为true 会导致出现百度默认的POI信息
    maxZoom: 18,
    minZoom: 3
  };

  // cache binded event handler
  _savedHandlers: { [k: string]: Function } = {};

  constructor(config: ConfigContentType) {
    super(config);
  }

  protected setSetting(setting: RazorMapSetting) {
    const { minZoom, maxZoom } = setting;
    this.defaulOptions.minZoom = minZoom;
    this.defaulOptions.maxZoom = maxZoom;
    this.setting = setting;
  }

  protected initSetting() {
    const { center, zoom, enableScrollWheelZoom, draggable } = this.setting;
    if (enableScrollWheelZoom) this.map.enableScrollWheelZoom();

    if (this.config.theme) {
      const styleJson = themes[this.config.theme] || themes.midnight;
      this.map.setMapStyle({ styleJson });
    }

    this.setDraggable(draggable);
    this.map.centerAndZoom(getPoint(center), zoom);
  }

  bindListener(listeners: Record<string, Function | Function[]>) {
    Object.keys(listeners).forEach((lKey: string) => {
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
    // this.map.removeEventListener('tilesloaded', this.tilesloadedHandler);
  }

  tilesloadedHandler(event: BaiduEvent, resolve: Function, map: any) {
    resolve(new RazorMapEvent(event, map));
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
    // set setting
    this.setSetting(setting);

    const protocolStr = document.location.protocol
    switch (protocolStr) {
      case 'https:':
        // 指定https访问类型，具体见 https://juejin.im/post/5a9259ef5188251c85637e25
        (window as any).HOST_TYPE = '2'
        break
      default:
        break
    }

    try {
      // initial
      if (!this.config.offline) {
        !window.BMap && (await loadFile(this.config.url, 'script'));
      } else {
        !window.BMap &&
          (await loadGlobalVar(
            this.config.offlineTilesDir,
            this.config.offlineHome
          ));
        !window.BMap &&
          (await Promise.all([
            loadFile(`${this.config.offlineHome}map.js`, 'script'),
            loadFile(`${this.config.offlineHome}css/map.css`, 'stylesheet')
          ]));
      }
      // 引入附属工具库 - 鼠标绘制lib
      !(window.BMapLib && window.BMapLib.DrawingManager) &&
        (await this.loadDrawingManager());

      !(window.BMapLib && window.BMapLib.CurveLine) &&
        (await this.loadCurveLineLib());

      this.map = new (window as any).BMap.Map(elm, this.defaulOptions);

      this.initSetting();

      this.bindListener(listener);

      return await bindEventAsync(
        this.map,
        'tilesloaded',
        this.tilesloadedHandler
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private loadDrawingManager() {
    const configProperties = Object.keys(this.config);

    if (
      configProperties.includes('drawingManagerCss') &&
      configProperties.includes('drawingManagerUrl')
    ) {
      // const loadUrl = loadFile((this.config as any).drawingManagerUrl, "script");
      const loadUrl = loadFile(
        (this.config as any).drawingManagerUrl,
        'script'
      );
      const loadCss = loadFile(
        (this.config as any).drawingManagerCss,
        'stylesheet'
      );
      return Promise.all([loadUrl, loadCss]);
    } else {
      return;
    }
  }

  private loadCurveLineLib() {
    require('./curveLine.js');
  }

  /**
   * set map center
   * @param center
   */
  setCenter(center: Point) {
    // #TO IMPROVE
    setTimeout(() => {
      this.map && this.map.panTo(getPoint(center));
    }, 100);
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
  setCenterAndZoom(center, zoom) {
    this.map.centerAndZoom(getPoint(center), zoom);
  }

  setBounds(bounds: Bounds) {
    this.map.setBounds(bounds);
  }

  getBounds(): Bounds {
    const originalBounds = this.map.getBounds();
    return {
      sw: originalBounds.getSouthWest(),
      ne: originalBounds.getNorthEast()
    };
  }

  setViewport(points: Point[], viewportOptions?: any) {
    return new Promise((resolve, reject) => {
      const bmapPoints = points.map(p => getPoint(p));
      this.map.setViewport(bmapPoints, viewportOptions);
      setTimeout(() => {
        resolve();
      }, 100);
    });
  }

  getViewport(points: Point[], viewportOptions?: any) {
    const bmapPoints = points.map(p => getPoint(p));
    return this.map.getViewport(bmapPoints, viewportOptions);
  }

  /**
   * set map draggable
   * @param {boolean} draggable
   */
  setDraggable(draggable: boolean) {
    draggable ? this.map.enableDragging() : this.map.disableDragging();
  }

  /**
   * set map scrollWheelZoom
   * @param {boolean} isEnable
   */
  setScrollWheelZoom(isEnable: boolean) {
    isEnable
      ? this.map.enableScrollWheelZoom()
      : this.map.disableScrollWheelZoom();
  }

  pixelToPoint(pixel) {
    const px = new (window as any).BMap.Pixel(pixel.x, pixel.y);
    return this.map.pixelToPoint(px);
  }

  pointToPixel(point: Point) {
    return getPoint(point);
  }

  clearOverlays() {
    this.map && this.map.clearOverlays();
  }

  containsPoint(point: Coordinate):Boolean {
    const pixelPoint = this.map.pointToPixel(point);
    const bounds = this.map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const swPixelPoint = this.map.pointToPixel(sw);
    const nePixelPoint = this.map.pointToPixel(ne);
    
    let flag = true;
    /* 纵轴判定 */
    if (pixelPoint.y > swPixelPoint.y || pixelPoint.y < nePixelPoint.y) {
      flag = false;
    }

    /* 横轴判定 */
    if (pixelPoint.x > nePixelPoint.x || pixelPoint.x < swPixelPoint.x) {
      flag = false;
    }

    return flag;
  }
}

export default BaiduMap;
