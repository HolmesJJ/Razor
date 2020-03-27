import { BaiduCanvasLayerOptions } from '../../types'
class BaiduCanvasLayer {
  options: BaiduCanvasLayerOptions;
  paneName: string;
  zIndex: number;
  map!: any;
  lastDrawTime: number;
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;

  constructor(options) {
    window.BMap.Overlay.call(this);

    this.options = options || {};
    this.map = options.mapInstance;
    this.paneName = this.options.paneName || 'labelPane';
    this.zIndex = this.options.zIndex || 0;
    this.lastDrawTime = null;
    this.show();
  }

  initialize(map) {
    this.map = map;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.cssText = 'position:absolute;' +
        'left:0;' +
        'top:0;' +
        'z-index:' + this.zIndex + ';';
    this.adjustSize();
    this.adjustRatio(this.ctx);
    map.getPanes()[this.paneName].appendChild(this.canvas);

    map.addEventListener('resize', () => {
        this.adjustSize();
        this._draw();
    });
    return this.canvas;
  }

  adjustSize() {
    const size = this.map.getSize();
    const canvas = this.canvas;
    if (size && canvas) {
      canvas.width = size.width;
      canvas.height = size.height;
      canvas.style.width = canvas.width + 'px';
      canvas.style.height = canvas.height + 'px';
    }
  }

  adjustRatio(ctx) {
    const backingStore = ctx.backingStorePixelRatio ||
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1;
    const pixelRatio = (window.devicePixelRatio || 1) / backingStore;
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    ctx.canvas.width = canvasWidth * pixelRatio;
    ctx.canvas.height = canvasHeight * pixelRatio;
    ctx.canvas.style.width = canvasWidth + 'px';
    ctx.canvas.style.height = canvasHeight + 'px';
    // console.log(ctx.canvas.height, canvasHeight);
    ctx.scale(pixelRatio, pixelRatio);
  }

  draw() {
    // var self = this;
    // var args = arguments;
    this._draw();
    // clearTimeout(self.timeoutID);
    // self.timeoutID = setTimeout(function () {
    //   self._draw();
    // }, 15);
  }

  _draw() {
    const { map, canvas } = this;
    const size = map.getSize();
    const center = map.getCenter();

    if (center && canvas) {
        let pixel = map.pointToOverlayPixel(center);
        canvas.style.left = pixel.x - size.width / 2 + 'px';
        canvas.style.top = pixel.y - size.height / 2 + 'px';
        // this.dispatchEvent('draw');
        this.options.update && this.options.update(this.canvas, this.map, this.options.scope);
    }
  }

  getContainer() {
    return this.canvas;
  }

  getContext() {
    return this.ctx;
  }

  show() {
    if (!this.canvas) {
      this.map.addOverlay(this);
    }
    this.canvas.style.display = 'block';
  }

  hide() {
    this.canvas.style.display = 'none';
  }

  setZIndex(zIndex) {
    this.canvas.style.zIndex = zIndex;
  }

  getZIndex() {
    return this.zIndex;
  }

  remove() {
    // const pane = this.map.getPanes()[this.paneName];
    // if (pane && this.canvas) {
    //   pane.removeChild(this.canvas);
    // }
    this.canvas = undefined;
    this.ctx = undefined;
  }
}

const BaiduCanvasLayerFactory = (map: any, options: any) => {
  // 通过原型继承BMap.Overlay
  const proto = BaiduCanvasLayer.prototype;

  BaiduCanvasLayer.prototype = new window.BMap.Overlay();

  Object.getOwnPropertyNames(proto).forEach(key => {
    BaiduCanvasLayer.prototype[key] = proto[key];
  })

  return new BaiduCanvasLayer({ ...options, mapInstance: map });
}

export default BaiduCanvasLayerFactory;
