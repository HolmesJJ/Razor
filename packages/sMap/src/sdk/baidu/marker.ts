import { getPoint, getSize } from "./utils/unit";
import { Point } from "../../types";
import { bindEvent } from "./utils/event";
import RazorMapMarker from "../_abstract/marker";
import { MarkerConfig } from "../../types/marker";
import BaiduCustomMarkerFactory from "./customMarker";

class BaiduMapMarker extends RazorMapMarker {
  _savedHandlers: { [k: string]: Function } = {};

  constructor(map: any) {
    super(map);
  }

  bindListener(listeners: Record<string, Function | Function[]>) {
    Object.keys(listeners).forEach((key: string) => {

      this._savedHandlers[key] = bindEvent(listeners[key], this.map);

      this.marker.addEventListener(key, this._savedHandlers[key]);
    });
  }
  getMarker() {
    return this.marker;
  }

  addMarker(markerConfig: MarkerConfig, listeners: Record<string, Function | Function[]>) {
    // 如果有自定义dom 那么需要使用CustomMaker
    if (markerConfig.customElement) {
      this.marker = BaiduCustomMarkerFactory(
        getPoint(markerConfig.position),
        markerConfig.customElement,
        { offset: markerConfig.offset, listeners});
    } else {
      const markerOpts = markerConfig.offset ? getSize(markerConfig.offset.x, markerConfig.offset.y) : undefined;
      this.marker = new window.BMap.Marker(getPoint(markerConfig.position), markerOpts);
      this.bindListener(listeners);
    }

    this.map.addOverlay(this.marker);
  }

  removeMarker() {
    this.map.removeOverlay(this.marker);
  }

  hideMarker() {
    this.marker && this.marker.hide();
  }

  showMarker() {
    this.marker && this.marker.show();
  }

  setPosition(position: Point) {
    this.marker.setPosition(getPoint(position));
  }

  setDraggable(draggable: boolean) {
    draggable ? this.marker.enableDragging() : this.marker.disableDragging();
  }

  setOffset(offset: { x: number; y: number }) {
    this.marker && this.marker.setOffset(getSize(offset.x, offset.y));
  }
}

export default BaiduMapMarker;
