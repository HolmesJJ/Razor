// import "../libs/protobuf.min.js";
// import "../libs/previewinfo_static.js";

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
}

// 画布属性
interface ContextInfo {
  width: number;
  height: number;
  scale: number;
  widthOffset: number;
  heightOffset: number;
}

// 播放器叠框
class PlayerSEI {
  player: any;
  videoElm: HTMLVideoElement | null = null;
  canvas: HTMLCanvasElement | null = null;

  // config
  showRect!: boolean;

  colors!: string[];

  /**
   * 默认的框颜色，目标类型对应数组下标
   */
  config: PlayerSEIConfig = {
    showRect: true,
    colors: ["blue", "green", "red", "yellow", "orange"]
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
    const { showRect, colors } = config;
    this.showRect = showRect;
    this.colors = colors;

    // 视频开始播放时才去获取帧和绘制canvas
    this.generateCanvas(this.videoElm).then((canvas: any) => {
      this.canvas = canvas;
      this.setSEIInterval();
      this.drawRect();
    });
  }

  setShowRect(val: boolean) {
    this.showRect = val;
    if (!val) {
      this.ctx &&
        this.ctx.clearRect(
          0,
          0,
          this.contextInfo.width,
          this.contextInfo.height
        );
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

      let canvas: any = document.createElement("canvas");

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

        this.offscreen = canvas.transferControlToOffscreen(); // 生成一个离屏canvas

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
          const width = parser(target.box.width * scale);
          const height = parser(target.box.height * scale);
          const x = parser(target.box.x * scale + widthOffset);
          const y = parser(target.box.y * scale + heightOffset);
          this.ctx.beginPath();
          this.ctx.lineWidth = 2;
          const index = target.objectType;
          this.ctx.strokeStyle = this.colors[index];
          this.ctx.rect(x, y, width, height);

          this.ctx.stroke();
        });
      }
      // 清空之前的框

      window.requestAnimationFrame(renderLoop);
    };
    window.requestAnimationFrame(renderLoop);
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
         * 1. seenIDR 是否有关键帧
         * 2. PreviewInfo 是否有解码器
         * 3. SEI是否由底层提供: seiID == PreviewInfoSEIID
         * */
        if (last.seenIDR && PreviewInfo && seiID == PreviewInfoSEIID) {
          // 解码
          const pi = PreviewInfo.decode(last.payload.subarray(16));

          // 存储每一个目标的信息
          pi.objects.forEach(target => {
            // console.log("target", target);
            const targetInfo = {
              objectType: target.objectType,
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
}

export default PlayerSEI;
