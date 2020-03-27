import { bindEvent, RazorMapEvent } from "./utils/event";
import RazorMapDrawingManager from "../_abstract/drawingManager";

export default class BaiduDrawingManager extends RazorMapDrawingManager {
  map!: any;
  manager!: any;
  overlays!: any;
  drawingMode!: string;
  keepOverlay!: boolean;
  drawingOnce!: boolean;
  _savedCompleteHandler: Function;
  _customCompleteFunc: Function | undefined;
  _savedHandlers: { [k: string]: Function } = {};

  constructor(mapInstance: any) {
    super(mapInstance, "hander");

    this.overlays = [];
  }

  bindListener(listeners: Record<string, Function | Function[]>) {
    Object.keys(listeners).forEach((key: string) => {
      if (key !== "overlaycomplete") {
        this._savedHandlers[key] = bindEvent(listeners[key], this.map);

        this.manager.addEventListener(key, this._savedHandlers[key]);
      }
    });
  }

  init(styleOptions: any, listeners?: Record<string, Function | Function[]>) {
    require("./baiduMapDrawingTool/baiduMapDrawManager.js");
    // require("./baiduMapDrawingTool/baiduMapDrawManager.css");
    this.manager = new window.BMapLib.DrawingManager(this.map, {
      isOpen: false, //是否开启绘制模式
      enableDrawingTool: false, //是否显示工具栏
      circleOptions: styleOptions, //圆的样式
      polylineOptions: styleOptions, //线的样式
      polygonOptions: styleOptions, //多边形的样式
      rectangleOptions: styleOptions //矩形的样式
    });
    listeners && this.bindListener(listeners);

    this._savedCompleteHandler = this.overlaycompleteHandler.bind(this);
    this._customCompleteFunc = (listeners["drawing-complete"] as Function)
      ? (listeners["drawing-complete"] as Function)
      : undefined;

    this.manager.addEventListener(
      "overlaycomplete",
      this._savedCompleteHandler
    );
  }

  overlaycompleteHandler(e: any) {
    // 如果绘制的时候 只是点了一个点，百度仍然会抛出绘制成功 所以要过滤掉这种情况
    if (!this.validateOverlay(e.overlay)) return;

    this.overlays.push(e.overlay);

    if (e.overlay instanceof window.BMap.Circle) {
      e.circle = {
        center: e.overlay.getCenter(),
        radius: e.overlay.getRadius()
      };
    } else {
      const bounds = e.overlay.getBounds();
      e.polygon = {
        type: this.drawingMode === "rectangle" ? "rectangle" : "polygon",
        path: e.overlay.getPath(),
        center: bounds.getCenter(),
        bounds: {
          sw: bounds.getSouthWest(),
          ne: bounds.getNorthEast()
        }
      };
    }

    if (this._customCompleteFunc) {
      this._customCompleteFunc(new RazorMapEvent(e, this.map));
    }
    // 根据配置决定是否在绘制完成之后就立刻清除
    if (!this.keepOverlay) {
      this.map.removeOverlay(e.overlay);
    }
    // 根据配置决定是否保持连续的绘制状态
    if (this.drawingOnce) {
      this.close();
    }
    // 由于百度的库里在多边形绘制完成之后进行了异步关闭绘制工具， 所以需要手动再次开启
    if (this.drawingMode === "polygon" && !this.drawingOnce) {
      setTimeout(() => {
        this.draw(this.drawingMode);
      }, 20);
    }
  }

  close() {
    this.manager.close();
  }

  draw(drawingMode: string) {
    this.drawingMode = drawingMode;
    if (this.drawingMode === "hander") {
      this.manager.close();
      if (!this.keepOverlay) {
        this.manager.clearOverlay();
      }
    } else if (this.drawingMode === "clear") {
      this.manager.close();
      this.manager.clearOverlay();
    } else {
      this.manager.setDrawingMode(this.drawingMode);
      this.manager.open();
    }
  }

  setKeepOverlay(shouldKeepOverlay) {
    this.keepOverlay = !!shouldKeepOverlay;
  }

  setDrawingOnce(shouldDrawingOnce) {
    this.drawingOnce = !!shouldDrawingOnce;
  }

  clearAll() {
    this.overlays.forEach((overlay: any) => {
      this.map.removeOverlay(overlay);
    });
    this.overlays = [];
  }

  validateOverlay(overlay: any) {
    let isValidOverlay = true;
    // 先判断overlay的类型，如果是圆 单独处理，其他情况都是多边形
    if (overlay instanceof window.BMap.Circle) {
      isValidOverlay = overlay.getRadius() !== 0;
    } else {
      const path = overlay.getPath();
      const center = overlay.getBounds().getCenter();
      isValidOverlay = !(
        path[0].lng === center.lng && path[0].lat === center.lat
      );
    }
    return isValidOverlay;
  }
}
