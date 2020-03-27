import RazorMapMarker from "../_abstract/marker";
import { MarkerConfig, IconConfig } from "../../types";

export default class MineMapMarker extends RazorMapMarker {
  defaultMarkerConfig: any = {
    offset: [0, 0]
  }

  constructor(map: any) {
    super(map);
  }
  /**
   * 由于minemap没有提供icon参数，所以根据icon创造出html element再createMarker
   * @param icon icon类型的marker配置，url / width / height
   */
  private createElementFromIconConfig(icon: IconConfig | undefined): HTMLElement | never{
    if (!icon) {
      throw new Error(`创建Mine Map地图marker出错，没有指定的icon`);
    }
    let elem = document.createElement('div');
    elem.style.backgroundImage = `url("${icon.url}")`;
    elem.style.backgroundSize = "cover";
    elem.style.height = `${icon.height}px`;
    elem.style.width = `${icon.width}px`;
    return elem;
  }

  // 创建marker, 这里需要返回各自地图的marker实例
  addMarker(markerConfig: MarkerConfig): any {
    // 拿到渲染marker的html / 策略是 如果有slot 那么就不使用icon
    const customElement = markerConfig.customElement ? markerConfig.customElement : this.createElementFromIconConfig(markerConfig.icon);

    markerConfig = Object.assign(this.defaultMarkerConfig, markerConfig);
    const { position, offset } = markerConfig;
    
    // 调用mine map方法创建marker
    const Minemap = window.minemap;
    this.marker = new Minemap.Marker(customElement, { offset })
      .setLngLat(position)
      .addTo(this.map);
  }

  removeMarker() {
    // TODO
  }

  setDraggable() {}

  setOffset() {}

  setPosition() {}

  hideMarker() {}

  showMarker() {}
}