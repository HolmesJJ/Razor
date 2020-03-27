import { Point } from "../../types";
import { bindEvent, getEventTypes } from "./utils/event";
import RazorMapMarker from "../_abstract/marker";
import { MarkerConfig } from "../../types/marker";
import { transformLngLat, getPoint, getSize } from "./utils/unit";

export default class AliMapMarker extends RazorMapMarker {
  _savedHandlers: { [k: string]: Function } = {};

  constructor(map: any) {
    super(map);
  }

  bindListener(listeners: Record<string, Function | Function[]>) {
    Object.keys(listeners).forEach((key: string) => {
      if (!getEventTypes(window.IMAP)[key]) return;
      this._savedHandlers[key] = bindEvent(listeners[key], this.map);
      this.marker.addEventListener(key, this._savedHandlers[key]);
    });
  }

  getMarker() {
    return this.marker;
  }

  addMarker(markerConfig: MarkerConfig, listeners: Record<string, Function | Function[]>) {
    const { position, offset, customElement } = markerConfig;
    const point = transformLngLat(position);
    const { x: offsetX, y: offsetY } = offset;
    // 如果有自定义dom 那么需要使用CustomMaker
    if (customElement) {
      this.marker = new window.IMAP.Label('', {
        position: point,
        type: window.IMAP.Constants.OVERLAY_LABEL_HTML,
        anchor: window.IMAP.Constants.BOTTOM_CENTER,
        offset: new window.IMAP.Pixel(offsetX, offsetY), // marker的默认高度
      });
      this.marker.setContent(customElement);
    } else {
      this.marker = new window.IMAP.Marker(point, {
        pointStrokeColor: 'red',
        pointFillColor: 'red',
      });
    }

    this.bindListener(listeners);
    this.map.getOverlayLayer().addOverlay(this.marker, false);
  }

  removeMarker() {
    this.map.getOverlayLayer().removeOverlay(this.marker);
  }

  hideMarker() {
    this.marker && this.marker.visible(false);
  }

  showMarker() {
    this.marker && this.marker.visible(true);
  }

  setPosition(point: Point) {
    this.marker && this.marker.setPosition(getPoint(point));
  }

  setDraggable(draggable: boolean) {
    this.map.dragged(draggable);
  }

  setOffset(offset: { x: number; y: number }) {
    this.marker && this.marker.setOffset(getSize(offset.x, offset.y));
  }
}
