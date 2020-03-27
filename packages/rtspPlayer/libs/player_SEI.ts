/* tslint-ignore */
import { PreviewInfoObjectMap, ALL_ATTRS_VALUE, OBJECT_TYPE, ATTRS_RECT_CONFIG, NONE_KEY } from "./previewinfo_config.js";
import {
  drawRoundRect
} from 'rz/utils/canvas/utils';

const PreviewInfo = (window as any).protobuf.roots["default"].sensetime.viper
  .video_process.preview_info.PreviewInfo;

// 底层提供的SEIID key， 用于判断目标SEI是否由底层提供
const PreviewInfoSEIID = new Uint8Array([
  0x7d,
  0x4b,
  0x4e,
  0xb8,
  0xcc,
  0xab,
  0x49,
  0x0f,
  0xa8,
  0x18,
  0x76,
  0x92,
  0x9f,
  0xbf,
  0xdd,
  0xd8
]).toString();

// 叠框配置项
interface PlayerSEIConfig {
  showRect: boolean;
  colors: string[];
  showAttrsInfo: boolean; // 是否显示叠框属性
  attrRectConfig?: any;
  rectWidth?: number;
}

// 画布属性
interface ContextInfo {
  width: number;
  height: number;
  scale: number;
  widthOffset: number;
  heightOffset: number;
}

interface IVertex {
  x: number;
  y: number;
}

// 播放器叠框
class PlayerSEI {
  player: any;
  videoElm: HTMLVideoElement | null = null;
  canvas: HTMLCanvasElement | null = null;

  // config
  showRect!: boolean;

  showAttrsInfo!: boolean;

  attrRectConfig: any;

  colors!: string[];

  rectWidth: number = 2;

  /**
   * 默认的框颜色，目标类型对应数组下标
   */
  config: PlayerSEIConfig = {
    showRect: true,
    showAttrsInfo: false,
    colors: [
      "blue", 
      "red", 
      "blue", 
      "blue", 
      "blue", 
      "blue", 
      "blue", 
      "blue", 
      "blue", 
      "blue", 
      "blue", 
      "blue"
    ],
    rectWidth: 2,
    attrRectConfig: ATTRS_RECT_CONFIG,
  };

  // 所有目标信息
  tracks: any = {};

  ctx!: CanvasRenderingContext2D;

  // 画框信息
  contextInfo: ContextInfo = {
    width: 0,
    height: 0,
    scale: 1,
    widthOffset: 0,
    heightOffset: 0
  };

  offscreen: any = null;

  /**
   * 播放器画框对象
   * @param player Streamedian播放器实例
   * @param videoElm video标签元素
   * @param config 配置项（可选）
   */
  constructor(
    player: any,
    videoElm: HTMLVideoElement,
    config: PlayerSEIConfig
  ) {
    this.player = player;
    this.videoElm = videoElm;
    const { showRect, colors, rectWidth, showAttrsInfo, attrRectConfig } = config;
    this.showRect = showRect;
    this.colors = colors;
    this.rectWidth = rectWidth;
    this.showAttrsInfo = showAttrsInfo;
    this.attrRectConfig = Object.assign(ATTRS_RECT_CONFIG,attrRectConfig);

    // 视频开始播放时才去获取帧和绘制canvas
    this.generateCanvas(this.videoElm).then((canvas: any) => {
      this.canvas = canvas;
      this.setSEIInterval();
      this.drawRect();
    });
  }
  // 重置更新画布;
  updateCanvas(){
    if (!this.canvas) return;
    this.ctx.clearRect(0, 0, this.contextInfo.width, this.contextInfo.height);
    this.clear();
    const root = this.videoElm.parentNode || (document.querySelector("body") as any);
      root.style.position = "relative";
      let canvas: HTMLCanvasElement = document.createElement("canvas");
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      const width = this.videoElm.offsetWidth;
      const height = this.videoElm.offsetHeight;
      /**
       * canvas变形说明：
       * 需要把canvas.style.height/width 和 canvas.height/width 设置成一致，才能保证不变形
       * https://stackoverflow.com/questions/9286483/wrong-rectangle-size-in-canvas
       */
      canvas.style.height = height + "px";
      canvas.style.width = width + "px";
      canvas.height = height;
      canvas.width = width;
      // this.offscreen = canvas.transferControlToOffscreen(); // 生成一个离屏canvas
      this.offscreen = canvas;
      root.appendChild(canvas);
      // 存储视频分辨率，大小，canvas大小等信息
      this.contextInfo = this.setContextInfo(this.videoElm, canvas);
      this.canvas = canvas;
      this.setSEIInterval();
      this.drawRect();
  }

  setShowRect(val: boolean) {
    this.showRect = val;
    if (!val) {
      this.ctx.clearRect(0, 0, this.contextInfo.width, this.contextInfo.height);
    }
  }

  setShowAttrInfo(val: boolean) {
    this.showAttrsInfo = val;
    if (!val) {
      this.ctx.clearRect(0, 0, this.contextInfo.width, this.contextInfo.height);
    }
  }

  setRectColors(colors: string[]) {
    this.colors = colors;
  }

  /**
   * 根据视频大小生成对应的canvas
   * @param elm Video标签元素
   */
  generateCanvas(elm: HTMLVideoElement) {
    const p = new Promise((resolve, reject) => {
      const root = elm.parentNode || (document.querySelector("body") as any);
      root.style.position = "relative";

      let canvas: HTMLCanvasElement = document.createElement("canvas");
      elm.addEventListener("waiting",event=>{
        // 视频源卡顿时清空叠框轨迹信息
        if (this.ctx && this.showRect){
          this.tracks = {};
          this.ctx.clearRect(0, 0, this.contextInfo.width, this.contextInfo.height);
        }
      })
      elm.addEventListener("canplay", event => {
        // 只有在视频播放时，才能获取到真实的高宽;
        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";
        /**
         * canvas变形说明：
         * 需要把canvas.style.height/width 和 canvas.height/width 设置成一致，才能保证不变形
         * https://stackoverflow.com/questions/9286483/wrong-rectangle-size-in-canvas
         */
        canvas.style.height = elm.offsetHeight + "px";
        canvas.style.width = elm.offsetWidth + "px";
        canvas.height = elm.offsetHeight;
        canvas.width = elm.offsetWidth;

        // this.offscreen = canvas.transferControlToOffscreen(); // 生成一个离屏canvas
        this.offscreen = canvas;

        root.appendChild(canvas);

        // 存储视频分辨率，大小，canvas大小等信息
        this.contextInfo = this.setContextInfo(elm, canvas);

        resolve(canvas);
      });
    });

    return p;
  }

  /**
   * 存储画布相关信息，缩放比例、横向偏移量、纵向偏移量
   * @param videoElm 视频元素
   * @param canvas canvas元素
   */
  setContextInfo(
    videoElm: HTMLVideoElement, 
    canvas: HTMLCanvasElement
    ): ContextInfo {
    const videoWidth = videoElm.videoWidth;
    const videoHeight = videoElm.videoHeight;
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    let scale = 1;
    let widthOffset = 0;
    let heightOffset = 0;

    // 获取缩放比例和偏移量
    if (videoWidth / videoHeight > canvasWidth / canvasHeight) {
      scale = canvasWidth / videoWidth;
      heightOffset = (canvasHeight - videoHeight * scale) / 2;
    } else {
      scale = canvasHeight / videoHeight;
      widthOffset = (canvasWidth - videoWidth * scale) / 2;
    }

    return {
      width: canvas.clientWidth,
      height: canvas.clientHeight,
      scale,
      widthOffset,
      heightOffset
    };
  }

  /**
   * 在canvas上画框
   */
  drawRect() {
    this.ctx = this.offscreen.getContext("2d");

    const renderLoop = () => {
      if (this.showRect) {
        this.ctx.clearRect(
          0, 
          0, 
          this.contextInfo.width, 
          this.contextInfo.height
          );

        const { scale, widthOffset, heightOffset } = this.contextInfo;
        const parser = val => parseFloat(val.toFixed(0));
        Object.keys(this.tracks).forEach((targetId: string) => {
          const target = this.tracks[targetId];
          // 开启叠框属性时，不显示骑手框
          if (this.showAttrsInfo && target.objectType === OBJECT_TYPE.CYCLIST){
            return;
          }
          const width = parser(target.box.width * scale);
          const height = parser(target.box.height * scale);
          const x = parser(target.box.x * scale + widthOffset);
          const y = parser(target.box.y * scale + heightOffset);
          this.ctx.beginPath();
          this.ctx.lineWidth = this.rectWidth;
          const index = target.objectType;
          this.ctx.strokeStyle = this.colors[index];
          this.ctx.rect(x, y, width, height);

          this.ctx.stroke();
          this.ctx.closePath();
          if (!this.showAttrsInfo || target.box.width < PreviewInfoObjectMap[target.objectType].rectWidthLimit ){
            return;
          }
          // 绘制属性信息
          target.attrItems.forEach((attr, idx) => {
            const { attrRectH, textIndent, attrRectW, textDirection, radius} =  this.attrRectConfig;
            // 处理属性框
            let startX = x + width + 8;
            let startY = y + idx * (attrRectH + 4);
            let rectWidthComputed = attrRectW;
            let textDirectionCoumputed = textDirection;
            // 文本宽度大于属性框宽度
            const text = this.ctx.measureText(attr);
            if (text.width > rectWidthComputed - textIndent * 2){
              rectWidthComputed = text.width + textIndent * 2;
            }
            // 车辆属性从车辆框左侧起
            if (target.objectType === OBJECT_TYPE.AUTOMOBILE && width > rectWidthComputed){
              startX = x + 8;
            }
            // 当属性框溢出视图，则属性框位于目标框左侧
            if (startX + rectWidthComputed > this.contextInfo.width){
              startX = x - rectWidthComputed - 8 + radius;
              textDirectionCoumputed = "rtl";
            }            
            this.drawAttrRect(
              this.ctx, 
              {
                x:startX, 
                y:startY, 
              },
              attr,
              this.colors[index],
              {
                ...this.attrRectConfig,
                attrRectW:rectWidthComputed,
                textDirection:textDirectionCoumputed
              }
            );
          });
        });
      }
      // 清空之前的框

      window.requestAnimationFrame(renderLoop);
    };
    window.requestAnimationFrame(renderLoop);
  }
  // 绘制属性框
  drawAttrRect(
    ctx: CanvasRenderingContext2D, 
    start: IVertex,
    attr: string, 
    arcColor: string,
    attrRectConfig:any,
    ) {
    const {
      textFont,
      textColor,
      textBaseline,
      textDirection,
      fillColor,
      lineColor,
      textIndent,
      attrRectW,
      attrRectH,
      radius,
      titleR
    } = attrRectConfig;
    const width = attrRectW - 2 * radius;
    const height = attrRectH - 2 * radius;
    // 画圆角矩形
    drawRoundRect(
      ctx,
      {
        start,
        width,
        height,
        radius,
      },
      {
        fillColor,
        lineColor,
        weight:this.rectWidth,
        opacity:1,
      }
    )
    // 填充文本内容
    ctx.beginPath();
    ctx.font = textFont;
    ctx.fillStyle = textColor;
    ctx.textBaseline = textBaseline;
    ctx.direction = textDirection;
    let textX = start.x + textIndent - radius;
    let arcX = textX - textIndent / 2;
    let textY = start.y + height / 2 + radius;
    // 属性框放在左侧 文本从右向左
    if ( textDirection === "rtl"){
      textX = start.x + width + radius - textIndent;
      arcX = textX + textIndent / 2;
    }
    ctx.fillText(attr, textX, textY);
    ctx.arc(arcX, textY, titleR, 0, Math.PI * 2);
    ctx.fillStyle = arcColor;
    ctx.fill();
  }

  /**
   * 获取增强位数据
   */
  setSEIInterval() {
    // 取数据
    const getOOBData = () => {
      let data = this.player.pullOOBData(
        this.videoElm && this.videoElm.currentTime + 0.01
        );
      if (data && data.length > 0) {
        const last = data[data.length - 1]; // 取最后一个oobdata
        /**
         * 结构化信息前16位为SEIID
         */
        const seiID = last.payload.subarray(0, 16).toString();
        /**
         * 判断是有效信息
         * 1. foundIDR 是否有关键帧
         * 2. PreviewInfo 是否有解码器
         * 3. SEI是否由底层提供: seiID == PreviewInfoSEIID
         * */
        if (last.foundIDR && PreviewInfo && seiID == PreviewInfoSEIID) {
          // 解码
          const pi = PreviewInfo.decode(last.payload.subarray(16));

          // 存储每一个目标的信息
          pi.objects.forEach(target => {
            // console.log("target", target);
            const targetInfo = {
              objectType: target.objectType,
              // 属性显示整理数据
              attrItems: this.assembleAttrItems(target),
              box: {
                width: 
                  target.bounding.vertices[1].x - target.bounding.vertices[0].x,
                height: 
                  target.bounding.vertices[1].y - target.bounding.vertices[0].y,
                x: target.bounding.vertices[0].x,
                y: target.bounding.vertices[0].y
              },
              ts: new Date().getTime()
            };

            this.tracks[target.trackId] = targetInfo;
          });

          Object.keys(this.tracks).forEach(key => {
            let now = new Date().getTime();
            const TIMEOUT: number = 100; // 过期时间 100ms

            if (now - this.tracks[key].ts > TIMEOUT) {
              delete this.tracks[key];
            }
          });
        }
      }

      window.requestAnimationFrame(getOOBData);
    };

    window.requestAnimationFrame(getOOBData);
  }

  /**
   * 清除叠框
   */
  clear() {
    if (this.canvas && this.videoElm) {
      const root =
        this.videoElm.parentNode ||
        (document.querySelector("body") as HTMLElement);

      const canvas = root.querySelector("canvas") as HTMLElement;
      root.removeChild(canvas);

      this.canvas = null;
      this.ctx = null;
      this.offscreen = null;
    }
  }
   /**
   * 组装属性信息
   */
  assembleAttrItems(target) {
    let res = []; 
    const { attributes } = target;
    
    if (attributes && Object.keys(attributes).length) {
      const { assemble, attrs, completion, noFiltration } = PreviewInfoObjectMap[target.objectType];
      // 组装结果
      if (assemble && Object.keys(assemble).length) {
        const attrsKeys = Object.keys(attributes);
        Object.keys(assemble).map((i) => {
          const { label, showField, completion } = assemble[i];
          if (!showField) return;
          let filterRes = [];
          // 过滤需要拼接的数据
          showField.map((key) => {
            if (attrsKeys.includes(key)) {
              const attributesValue = attributes[key];
              if (attributesValue.includes(NONE_KEY)) return;
              // 不需要匹配过滤，直接展示的字段
              if (noFiltration && noFiltration.includes(key)) res.push(attributesValue);

              let val = ALL_ATTRS_VALUE[attributesValue];
              if (val) {
                // 如果设置了completion，第一个数据将拼接上，主要用于 颜色 文案显示
                if (completion && !filterRes.length && key.includes('color')) val += completion;
                filterRes.push(val);
              }
            }
          });
          if (filterRes.length) {
            // 如果只有一个数据，在结尾追加属性名称
            if (filterRes.length === 1 && !filterRes[0].includes(label)) filterRes.push(label);
            // 返回数据
            res.push(filterRes.join(''));
          }
        })
      } else {
        for (let key in attrs) {
          const attributesValue = attributes[key];
          if (attributesValue && !attributesValue.includes(NONE_KEY) ) {
            // 不需要匹配过滤，直接展示的字段
            if (noFiltration && noFiltration.includes(key)) res.push(attributesValue);

            let value = ALL_ATTRS_VALUE[attributesValue];
            // 追加颜色
            if (key.includes("color") && completion) value += completion;
            if (value) {
              res.push(value);  
            }
          };
        }
      }
    }
    return res || [];
  }
}

export default PlayerSEI;
