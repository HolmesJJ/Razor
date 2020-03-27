import { swallowEvent } from "rz/utils/util";
import { Size, Offset } from "./ScaleCalculator";
import { getRealSize } from './utils'
interface ZoomControllerParams {
  step?: number;
  maxScale?: number;
  minScale?: number;
  initialSize?: Size;
  parentSize?: Size;
  background?: {
    size: Size;
    position: Offset;
  };
  flexable?: boolean;
  flexbase?: number;
}
class ZoomController {
  elm: HTMLElement;
  elmSize: Size;
  initSize: Size;
  parentSize: Size;

  transform: Offset = {
    left: 0,
    top: 0
  };

  padding: Offset = {
    left: 0,
    top: 0
  };

  params: ZoomControllerParams = {
    step: 0.1,
    maxScale: 4,
    minScale: 1,
    flexable: false,
    flexbase: 100
  };

  scale: number = 1;

  lastX: number = 0;

  lastY: number = 0;

  fnCached: any = {};

  constructor(elm: HTMLElement, params?: ZoomControllerParams) {
    this.elm = elm;

    if (params) this.params = Object.assign(this.params, params);
    
    const elmStyle = getComputedStyle(this.elm);

    this.elmSize = {
      width: parseInt(elmStyle.width),
      height: parseInt(elmStyle.height)
    };

    this.initSize = this.params.initialSize;

    this.parentSize = this.params.parentSize;

    this.padding = {
      left: (this.parentSize.width - this.initSize.width) / 2,
      top: (this.parentSize.height - this.initSize.height) / 2
    };
  }

  _getSize(value: number) {
    return getRealSize(value, this.params.flexable, this.params.flexbase)
  }

  handleZoom(event) {
    swallowEvent(event);

    // 滚动时，需要将内部元素的定位设为 absolute
    this.elm.style.position = 'absolute';

    const isZoomIn = event.deltaY < 0;

    let center = { x: 0, y: 0 };
    let scaleValue: number;

    let newScale = this.scale + this.params.step * (isZoomIn ? 1 : -1);

    if (newScale > this.params.maxScale) newScale = this.params.maxScale;
    else if (newScale < this.params.minScale) newScale = this.params.minScale;

    const { left, top } = this.elm.parentElement.getBoundingClientRect();

    center.x = event.clientX - left;
    center.y = event.clientY - top;

    scaleValue = newScale / this.scale;

    this.scale = parseFloat(newScale.toFixed(1));

    let transformX = (center.x - this.transform.left) * scaleValue;
    let transformY = (center.y - this.transform.top) * scaleValue;

    this.transform.left = this.rectifyTransform(center.x - transformX, "width");
    this.transform.top = this.rectifyTransform(center.y - transformY, "height");

    this.updateStyle();
  }

  handleMoveStart(event) {
    // 当缩放到最小时禁用mousemove
    // 不然无法响应拖拽事件
    if (this.scale === this.params.minScale) {
      return;
    }

    swallowEvent(event);
    this.lastX = event.pageX;
    this.lastY = event.pageY;

    this.fnCached.mousemove = this.handleMove.bind(this);
    this.fnCached.mouseup = this.handleMoveEnd.bind(this);

    this.elm.addEventListener("mousemove", this.fnCached.mousemove);
    this.elm.addEventListener("mouseup", this.fnCached.mouseup);
  }

  handleMove(event) {
    swallowEvent(event);

    const nowX = event.pageX;
    const nowY = event.pageY;

    let moveX = nowX - this.lastX + this.transform.left;
    let moveY = nowY - this.lastY + this.transform.top;

    this.transform.left = this.rectifyTransform(moveX, "width");
    this.transform.top = this.rectifyTransform(moveY, "height");

    this.lastX = nowX;
    this.lastY = nowY;

    this.updateStyle();
  }

  handleMoveEnd(event?) {
    this.elm.removeEventListener("mousemove", this.fnCached.mousemove);
    this.elm.removeEventListener("mouseup", this.fnCached.mouseup);
  }

  updateBg() {
    const { size, position } = this.params.background;

    const bgWidth = this._getSize(size.width * this.scale);
    const bgHeight = this._getSize(size.height * this.scale);
    const bpLeft = this._getSize(-position.left * this.scale);
    const bpTop = this._getSize(-position.top * this.scale);

    const bgSize = `${bgWidth} ${bgHeight}`;
    const bgPosition = `${bpLeft} ${bpTop}`;

    this.elm.style.backgroundSize = bgSize;
    this.elm.style.backgroundPosition = bgPosition;
  }

  updateStyle() {
    const paddingLeft = this.padding.left * this.scale;
    const paddingTop = this.padding.top * this.scale;

    const elmTop = this._getSize(this.transform.top + paddingTop);
    const elmLeft = this._getSize(this.transform.left + paddingLeft);
    const elmWidth = this._getSize(this.initSize.width * this.scale);
    const elmHeight = this._getSize(this.initSize.height * this.scale);

    this.elm.style.top =  elmTop;
    this.elm.style.left =  elmLeft;

    this.elm.style.width =  elmWidth;
    this.elm.style.height =  elmHeight;

    if (this.params.background) {
      this.updateBg();
    }

  }

  rectifyTransform(value: number, type: "width" | "height") {
    const signal = -1;
    const start = 0;
    const end = this.parentSize[type] * (1 - this.scale);

    if ((value - start) * signal < 0) {
      return start;
    }
    if ((value - end) * signal > 0) {
      return end;
    }
    return value;
  }

  bind() {
    this.fnCached.wheel = this.handleZoom.bind(this);
    this.fnCached.mousedown = this.handleMoveStart.bind(this);

    this.elm.addEventListener("wheel", this.fnCached.wheel);
    this.elm.addEventListener("mousedown", this.fnCached.mousedown);
    this.elm.addEventListener("mouseleave", this.handleMoveEnd.bind(this));
  }

  unbind() {
    for (const event in this.fnCached) {
      this.elm.removeEventListener(event, this.fnCached[event]);
    }
  }
}

export default ZoomController;
