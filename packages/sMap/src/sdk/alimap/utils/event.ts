import { Coordinate, Bounds, Point } from "../../../types";

// 映射事件模型
export const getEventTypes = IMAP => ({
  "click": IMAP.Constants.CLICK, // 点击点击覆盖物
  "dbclick": IMAP.Constants.DBCLICK, // 鼠标左键双击覆盖物
  "resize": IMAP.Constants.RESIZE, // 地图可视区大小发生变化
  "mouseup": IMAP.Constants.MOUSE_UP, // 鼠标左键按下覆盖物触发
  "mousedown": IMAP.Constants.MOUSE_DOWN, // 鼠标左键抬起覆盖物触发
  "mousemove": IMAP.Constants.MOUSE_MOVE, // 鼠标在地图上移动触发
  "mouseover": IMAP.Constants.MOUSE_OVER, // 鼠标移入覆盖物触发
  "mouseout": IMAP.Constants.MOUSE_OUT, // 鼠标移出覆盖物触发
  "mousecontextmenu": IMAP.Constants.MOUSE_CONTEXTMENU, // 鼠标右键单击覆盖物触发
  "dragstart": IMAP.Constants.DRAG_START, // 鼠标左键拖拽覆盖物开始触发
  "draging": IMAP.Constants.DRAG_ING, // 鼠标左键拖拽过程中触发
  "dragend": IMAP.Constants.DRAG_END, // 鼠标左键拖拽结束触发
  "zoomstart": IMAP.Constants.ZOOM_START, // 地图缩放开始
  "zoomend": IMAP.Constants.ZOOM_END, // 地图缩放结束
  "zoomchange": IMAP.Constants.ZOOM_CHANGE, // 地图缩放改变时触发
  "movestart": IMAP.Constants.MOVE_START, // 地图移动开始时触发
  "moving": IMAP.Constants.MOVING, // 地图移动过程中触发
  "moveend": IMAP.Constants.MOVE_END, // 地图移动结束触发
  "addoverlay": IMAP.Constants.ADD_OVERLAY, // 添加一个覆盖物
  "removeoverlay": IMAP.Constants.REMOVE_OVERLAY, // 移出覆盖物
})

export interface AliEvent {
  type: string; // 事件类型
  target: { // 事件对象
    [k: string]: any;
  };
  zoom?: number; // 缩放层级
  size?: any; // 地图大小
  center?: Coordinate; // 中心点
  lnglat?: Coordinate; // 点的经纬度
  pixel?: { x: number; y: number }; // 经纬度像素
  cenpixel?: { x: number; y: number }; // 拖拽事件像素坐标
  overlay?: any; // 覆盖物对象
}

export class AliMapEvent {
  type: string;

  target: any;

  zoom?: number;

  center?: Point;

  point?: Point;

  pixel?: { x: number; y: number };

  cenpixel?: { x: number; y: number };

  overlay?: any;

  bounds?: Bounds;

  constructor(evt: AliEvent, map: any) {
    const {
      type,
      target,
      zoom,
      center,
      lnglat,
      pixel,
      cenpixel,
      overlay
    } = evt;

    this.type = type;
    this.target = target;
    this.zoom = zoom || map.getZoom();
    this.center = center || map.getCenter();
    this.point = lnglat;
    this.pixel = pixel;
    this.cenpixel = cenpixel;
    this.overlay = overlay;

    const bounds = map.getBounds();
    this.bounds = {
      sw: bounds.getSouthWest(),
      ne: bounds.getNorthEast()
    };
  }
}

export const bindEvent = (handler: Function | Function[], map: any) => {
  if (typeof handler === "function") {
    handler = [handler];
  }
  return (e: AliEvent) => {
    /**
     * handler is a custom function
     * e.p: handleMarkerClick($event, marker)
     */
    (handler as Function[]).forEach((h: Function) => {
      h(new AliMapEvent(e, map));
    });
  };
};
