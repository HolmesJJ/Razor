import RazorMap from "../_abstract/map";

import bindEvent from "./bindEvent";
import isEmpty from "lodash/isEmpty";
import loadFile from "../../shared/utils/loadFile";

import {
  Point,
  RazorMapSetting,
  MineMapConfig,
  ConfigContentType,
  Bounds
} from "../../types";

interface MineMapOptions {
  minZoom?: number;
  maxZoom?: number;
}

class MineMap extends RazorMap {
  // MineMap默认设置, #TODO: 后续需要整理一下这里需要提供什么默认设置
  defaultSetting: MineMapOptions = {};

  mineMapConfig: MineMapConfig = {
    url: "",
    cssLink: "",
    ak: "",
    host: "",
    theme: 0
  };

  constructor(config: ConfigContentType) {
    super(config);
    // 由于abstract类里定义了联合类型，联合类型里的uncommon properties可能不存在，所以需要对用户传参进行MineMapConfig的校验
    // https://github.com/Microsoft/TypeScript/issues/24553
    this.checkAndSetConfig(config);
  }

  private checkAndSetConfig(config: ConfigContentType): void | never {
    let missingKeys: string[] = [];
    // 检查用户输入的config是否完全符合MineMapConfig的要求，如果没有就要抛出错误
    Object.keys(this.mineMapConfig).forEach(key => {
      if (!(key in config)) {
        missingKeys.push(key);
      }
    });
    if (isEmpty(missingKeys)) {
      this.mineMapConfig = Object.assign(this.mineMapConfig, config);
    } else {
      throw new Error(
        `MineMap初始化参数出错，缺少参数${missingKeys.join(" ,")}`
      );
    }
  }

  protected setSetting(setting: RazorMapSetting) {
    this.setting = Object.assign(setting, this.defaultSetting);
  }

  removeListener(): void {
    // todo
  }
  /**
   * 初始化地图
   * @param elm dom element or dom id
   * @param config map config
   * @param setting map setting
   */
  async init(
    elm: "" | HTMLElement,
    setting: any = this.setting,
    listener?: any
  ): Promise<any> {
    this.setSetting(setting);

    const config = this.mineMapConfig;

    try {
      // initial
      if (!(window as any).minemap) {
        await Promise.all([
          loadFile(config.url, "script"),
          loadFile(config.cssLink, "stylesheet")
        ]);
      }
      let MineMap = window.minemap;

      MineMap = Object.assign(MineMap, {
        accessToken: config.ak,
        domainUrl: config.host,
        serviceUrl: config.host,
        solution: config.theme
      });

      this.map = new MineMap.Map({
        container: elm,
        style: `http://minedata.cn/service/solu/style/id/${config.theme}`,
        center: this.setting.center,
        zoom: this.setting.zoom
      });

      this.bindListener(listener);

      return new Promise(resolve => {
        this.map.on("load", () => {
          resolve(this.map);
        });
      });
    } catch (error) {
      return Promise.reject(
        new Error(`MineMap Initialization Failed : ${error.message}`)
      );
    }
  }

  /**
   * set map center
   * @param center
   */
  setCenter(center: [number, number]) {
    this.map.panTo(center);
  }
  /**
   * return current map center
   * @return center
   */
  getCenter(): [number, number] {
    return this.map.getCenter();
  }
  /**
   * set map zoom
   * @param zoom
   */
  setZoom(zoom: number) {
    this.map.setZoom(zoom);
  }

  getZoom(): number {
    return this.map.getZoom();
  }

  setDraggable(draggable: boolean): void {
    draggable ? this.map.dragPan.enable() : this.map.dragPan.disable();
  }

  /**
   * set map scrollZoom
   * @param {boolean} isEnable
   */
  setScrollWheelZoom(isEnable: boolean) {
    isEnable ? this.map.scrollZoom.enable() : this.map.scrollZoom.disable();
  }

  /**
   * set bounds 调整视野
   * @param bounds [Point，Point] 西南角坐标，东北角坐标
   */
  setBounds(bounds: Bounds): void {
    this.map.fitBounds(bounds);
  }

  // set both center and zoom
  centerAndZoom(newCenter: Point, newZoom: number): void {
    this.map.setCenter(newCenter).setZoom(newZoom);
  }
  /**
   * 事件绑定代理，这里会处理map组件的事件绑定和具体地图的事件绑定的差异
   * @param listener { 事件名: handler } 这个对象可以包含多对kv
   */
  bindListener(listener: { [key: string]: (e: any) => void }) {
    Object.keys(listener).forEach((lKey: string) => {
      bindEvent(this.map, lKey, listener[lKey]);
    });
  }

  setViewport(points) {}

  // get bounds
  getBounds(): Bounds {
    return this.map.getBounds();
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

export default MineMap;
