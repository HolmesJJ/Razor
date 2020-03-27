import { ContainerStyle } from 'rz/utils/canvas/layer.d';
import { Line } from './line';

import { clearCanvas } from 'rz/utils/canvas/utils';

function getCanvasContext(
  canvasElm: HTMLCanvasElement
): CanvasRenderingContext2D {
  const ctx: CanvasRenderingContext2D = canvasElm.getContext('2d');
  return ctx;
}

const defaultLineOption = {
  step: 0
};

const defaultConfig = {
  totalStep: 60,
  stepGap: 1,
  emitAnimateFinish: () => {
    return true;
  },
  emitAnimatePlay: (progress:number) => { return {progress: 0}},
};

class LinePlayer {
  canvasCtx!: CanvasRenderingContext2D;

  canvasElm!: HTMLCanvasElement;

  config: any = {};

  timer!: number;

  lines: any[] = [];

  containerStyle: ContainerStyle = {
    width: 0,
    height: 0
  };

  animateState: boolean = false;

  activeLineIndex: number = 1;

  constructor({ config = defaultConfig }) {
    this.config = config;
  }

  init({
    canvasElem,
    containerStyle,
    lines
  }: {
    canvasElem: HTMLCanvasElement;
    containerStyle: ContainerStyle;
    lines: any[];
  }) {
    // 初始化尺寸
    const { width, height } = containerStyle;
    this.containerStyle = containerStyle;
    this.canvasElm = canvasElem as HTMLCanvasElement;
    this.canvasElm.width = width;
    this.canvasElm.height = height;

    this.canvasCtx = getCanvasContext(canvasElem) || null;

    this.setLines(lines);
  }

  drawLines() {
    let i = 0;
    const lines = this.lines;
    let step = 0;
    this.stopAnimate();
    for (; i < lines.length; i++) {
      step = lines[i].step;
      lines[i].drawOneLine(step);
      lines[i].drawArrow();
    }
  }

  stopAnimate() {
    this.changeState(false);
    let i = 0;
    const lines = this.lines;
    for (; i < lines.length; i++) {
      lines[i].stopAnimate();
    }
  }

  startAnimate() {
    this.changeState(true);
    let i = 0;
    const lines = this.lines;
    for (; i < lines.length; i++) {
      lines[i].changeAnimateState(true);
    }
  }

  async drawAnimateLines() {
    this.clearCanvas();
    const lines = this.lines;
    let i = 0;
    let done;
    let j = 0;

    for (; i < lines.length; i++) {
      if (this.animateState) {
        done = await lines[i].drawLine();
      }
      this.clearCanvas();

      if (this.animateState) {
        j = i + 1;
        while (j) {
          lines[j - 1].drawOneLine();
          lines[j - 1].drawArrow();
          j--;
        }
      }

      if (!done) {
        console.error('第' + i + '条出错');
        break;
      }
    }

    this.animateDoneCallback();
  }

  animateDoneCallback() {
    this.lines.forEach(line => {
      line.resetAnimate();
    });
    this.config.emitAnimateFinish();
  }

  changeState(state: boolean) {
    this.animateState = state;
  }

  clearCanvas() {
    const { width, height } = this.containerStyle;
    clearCanvas(this.canvasCtx, { width, height });
  }

  setLines(lines: any[] = []) {
    const { emitProgress, canvasCtx } = this;
    this.lines = lines.map(
      (line, index) =>
        new Line({
          ...defaultLineOption,
          ...this.config,
          canvasCtx,
          index,
          line,
          emitAnimatePlayFunc: emitProgress.bind(this)
        })
    );
  }

  emitProgress(step, index) {
    const totalStep = this.lines.length * this.config.totalStep;
    const stepCount = index * this.config.totalStep + step;
    const progress = Number(((stepCount / totalStep) * 100).toFixed(0));
    if(step === this.config.totalStep && index !== this.lines.length - 1){
      // 屏蔽掉已经画了，还往外冒进度
      return;
    }
    this.config.emitAnimatePlay(progress);
  }

  dispose() {
    this.lines.forEach(line => line.dispose());
    this.lines = [];
    Object.getOwnPropertyNames(this).forEach(key => {
      this[key] = null;
    });
  }
}

export default LinePlayer;
