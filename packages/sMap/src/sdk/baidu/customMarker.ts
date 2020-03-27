import { BaiduCustomMarkOptions } from "../../types";

class BaiduCustomMarker {
  $el: HTMLElement;
  point: any; // 百度Point
  options: BaiduCustomMarkOptions; // 自定义marker的自有数据
  map: any; // 百度地图的实例

  constructor(
    point: any,
    customElement: HTMLElement,
    options: BaiduCustomMarkOptions
  ) {
    // 继承BMap.Overlay上的实例成员和方法
    window.BMap.Overlay.call(this);

    this.point = point;
    this.options = options;
    this.$el = customElement;
  }

  initialize(map: any) {
    this.map = map;
    const wrapperEle = document.createElement("div");
    wrapperEle.style.width = "max-content";
    this.$el = wrapperEle.appendChild(this.$el);
    if (this.options.listeners) {
      this.bindEvents(this.options.listeners, this.options.customData);
    }
    map.getPanes().labelPane.appendChild(this.$el);
    return this.$el;
  }

  bindEvents(listeners, customdata?) {
    if (!customdata) {
      Object.keys(listeners).forEach(key => {
        // TODO增加marker支持的listeners的校验
        this.$el.addEventListener(key, listeners[key]);
      });
    } else {
      Object.keys(listeners).forEach(key => {
        this.$el.addEventListener(key, () => {
          if (listeners[key] && toString.call(listeners[key]) === '[object Function]') {
            listeners[key](customdata);
          }
        });
      });
    }
  }

  draw() {
    const { x, y } = this.map.pointToOverlayPixel(this.point);
    const offsetX = this.options.offset ? this.options.offset.x : 0;
    const offsetY = this.options.offset ? this.options.offset.y : 0;

    const style = {
      position: "absolute",
      cursor: "pointer",
      left: `${x + offsetX}px`,
      top: `${y + offsetY}px`
    };
    Object.assign(this.$el.style, style);
  }

  disableDragging() {
    // TODO 暂时没有自定义标注拖拽的相关需求 以后补充
  }

  enableDragging() {
    // TODO 暂时没有自定义标注拖拽的相关需求 以后补充
  }

  setPosition(newPoint) {
    this.point = newPoint;
    this.draw();
  }

  setOffset(size) {
    this.options.offset.x = size.width;
    this.options.offset.y = size.height;
    this.draw();
  }

  destroy() {
    this.$el = null;
  }
}

const BaiduCustomMarkerFactory = (
  point: any,
  customElement: any,
  options?: any
) => {
  // 通过原型继承BMap.Overlay
  const proto = BaiduCustomMarker.prototype;

  BaiduCustomMarker.prototype = new window.BMap.Overlay();

  Object.getOwnPropertyNames(proto).forEach(key => {
    BaiduCustomMarker.prototype[key] = proto[key];
  });

  return new BaiduCustomMarker(point, customElement, options);
};

export default BaiduCustomMarkerFactory;
