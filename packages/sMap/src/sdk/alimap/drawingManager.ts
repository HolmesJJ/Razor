import { bindEvent } from "./utils/event";
import RazorMapDrawingManager from "../_abstract/drawingManager";
import AliMapDrawTool from "./utils/drawTool";

class AliMapDrawingManager extends RazorMapDrawingManager {
  map!: any;
  manager!: any;
  drawTool!: any;
  overlays!: any;
  drawingMode!: string;
  keepOverlay!: boolean;
  drawingOnce!: boolean;
  _savedCompleteHandler: Function;
  _customCompleteFunc: Function | undefined;
  _savedHandlers: { [k: string]: Function } = {};
  _listeners: Record<string, Function | Function[]>;

  constructor(mapInstance: any) {
    super(mapInstance, 'hander');
    this.overlays = [];
  }

  bindListener(listeners: Record<string, Function | Function[]>) {
    Object.keys(listeners).forEach((key: string) => {
      if (key !== 'overlaycomplete') {
        this._savedHandlers[key] = bindEvent(listeners[key], this.map);
        this.manager && this.manager.addEventListener(key, this._savedHandlers[key]);
      }
    });
  }

  initTool() {
    return new Promise(resolve => {
      this.map.plugin(['IMAP.Tool'], () => {
        resolve();
      });
    })
  }

  init(styleOptions: any, listeners?: Record<string, Function | Function[]>) {
    this.drawTool = new AliMapDrawTool(this.map, styleOptions);
    this._savedCompleteHandler = this.overlaycompleteHandler.bind(this);
    this._customCompleteFunc = (listeners['drawing-complete'] as Function) ? (listeners['drawing-complete'] as Function) : undefined;
    this._listeners = listeners;
  }

  overlaycompleteHandler(e: any) {
    // 如果绘制的时候 只是点了一个点，百度仍然会抛出绘制成功 所以要过滤掉这种情况
    // if (!this.validateOverlay(e.overlay)) return;

    this.overlays.push(e.overlay);

    if (e.overlay instanceof window.IMAP.Circle) {
      e.circle = {
        center: e.overlay.getCenter(),
        radius: e.overlay.getRadius()
      };
    } else {
      const bounds = e.overlay.getBounds();
      const { northeast: ne, southwest: sw } = bounds;
      e.polygon = {
        type: this.drawingMode === 'rectangle' ? 'rectangle' : 'polygon',
        center: bounds.getCenter(),
        bounds: { sw, ne }
      }
    }

    if (this._customCompleteFunc) {
      this._customCompleteFunc(e);
    }
    // 根据配置决定是否在绘制完成之后就立刻清除
    if (!this.keepOverlay) {
      this.map.getOverlayLayer().removeOverlay(e.overlay);
    }
    // 根据配置决定是否保持连续的绘制状态
    if (this.drawingOnce) {
      this.manager && this.manager.close();
    }
    // 由于百度的库里在多边形绘制完成之后进行了异步关闭绘制工具， 所以需要手动再次开启
    if (this.drawingMode === 'polygon' && !this.drawingOnce) {
      setTimeout(() => {
        this.draw(this.drawingMode)
      }, 20);
    }
  }

  close() {
    this.drawTool && this.drawTool.close();
  }

  draw(drawingMode: string) {
    this.drawingMode = drawingMode; // = "circle";
    if (this.drawingMode === 'hander') {
      this.close();
    } else {
      this.manager = this.drawTool.getTool(drawingMode, this._savedCompleteHandler);
      this._listeners && this.bindListener(this._listeners);
    }
  }

  setKeepOverlay(shouldKeepOverlay) {
    this.keepOverlay = !!shouldKeepOverlay;
    this.drawTool && this.drawTool.setAutoClose(this.keepOverlay);
  }

  setDrawingOnce(shouldDrawingOnce) {
    this.drawingOnce = !!shouldDrawingOnce;
  }

  clearAll() {
    this.overlays.forEach((overlay: any) => {
      this.map.getOverlayLayer().removeOverlay(overlay);
    })
    this.overlays = [];
  }

  /* validateOverlay(overlay: any) {
    let isValidOverlay = true;
    // 先判断overlay的类型，如果是圆 单独处理，其他情况都是多边形
    if (overlay instanceof window.IMAP.Circle) {
      isValidOverlay = overlay.getRadius() !== 0;
    } else {
      const path = overlay.getPath();
      const center = overlay.getBounds().getCenter();
      isValidOverlay = !(path[0].lng === center.lng && path[0].lat === center.lat);
    }
    return isValidOverlay;
  } */
}

export default AliMapDrawingManager;
