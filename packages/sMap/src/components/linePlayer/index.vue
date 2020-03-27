<template>
  <div class="rz-map-line-player">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch,
  Inject,
  Emit,
} from "vue-property-decorator";
import LinePlayer from "../../shared/canvas/linePlayer";
import MapFactory from "../../sdk/factory";

@Component({
  name: "MapLinePlayer"
})
export default class RzMapLinePlayer extends Vue {
  @Prop({
    required: true,
    type: Array
  })
  readonly lines!: any[];

  @Prop({ default: 60 })
  readonly totalStep!: number;

  @Prop({ default: 1 })
  readonly stepGap!: number;

  @Prop()
  readonly colorSteps: any[] // 轨迹颜色设置

  @Prop()
  readonly arrowOptions: any // 箭头颜色选项

  @Inject() readonly getMap!: Function;

  player: any;

  mapCanvasPlayer: any;

  map: any;

  moveTimer: any;

  canvasElem: any; // canvas 元素
  
  progress: number = 0;

  @Watch("lines")
  handleLinesChange(value) {
    if (this.map) {
      this.progress = 0;
      this.clearCanvas();
      this.setLines(value);
      this.stopDrawAnimateLines();
      this.emitAnimateFinish()
      this.emitAnimatePlay(0)
    }
  }

  @Watch("stepGap")
  handleStepGapChange() {
    if (this.map) {
      this.initPlayer(this.canvasElem);
    }
  }

  @Watch("totalStep")
  handleTotalStepChange() {
    if (this.map) {
      this.initPlayer(this.canvasElem);
    }
  }

  @Watch("colorSteps")
  handleColorStepsChange() {
    if (this.map) {
      this.initPlayer(this.canvasElem);
    }
  }

  @Emit("animate-play")
  emitAnimatePlay(progress: number) {
    this.progress = progress;
    return { progress };
  }

  @Emit("animate-finish")
  emitAnimateFinish() {
    return true
  }

  mounted() {
    this.getMap(async (map: any, type: string) => {
      this.map = map;
      this.mapCanvasPlayer = await MapFactory.createCanvasLayer(type, map, {
        update: this.updateCanvasFunc
        // scope: this
      });

      this.map.removeEventListener("zoomend", this.handleMapMove);
      this.map.removeEventListener("moveend", this.handleMapMove);
      this.map.addEventListener("zoomend", this.handleMapMove);
      this.map.addEventListener("moveend", this.handleMapMove);
    });
  }

  beforeDestroy() {
    this.map.removeEventListener("zoomend", this.handleMapMove);
    this.map.removeEventListener("moveend", this.handleMapMove);
    this.clearCanvas();
    this.mapCanvasPlayer.remove();
    this.canvasElem.remove();
    this.player.dispose();
    this.player = null;
  }

  // 坐标转换
  getLines(lines) {
    const _lines = lines.map(line => {
      const { start, end } = line;
      const startPixelPoint = this.map.pointToPixel(start);
      const endPixelPoint = this.map.pointToPixel(end);

      const _start = {
        ...start,
        x: startPixelPoint.x,
        y: startPixelPoint.y
      };

      const _end = {
        ...start,
        x: endPixelPoint.x,
        y: endPixelPoint.y
      };

      // 配置项注入 Line
      const config = this.genConfig();

      return {
        ...line,
        ...config,
        start: _start,
        end: _end
      };
    });

    return _lines;
  }

  genConfig() {
    const { totalStep, stepGap, emitAnimateFinish, emitAnimatePlay, colorSteps, arrowOptions } = this;
    const config = {
      totalStep,
      stepGap,
      emitAnimateFinish,
      emitAnimatePlay,
      colorSteps,
      arrowOptions
    };
    return config
  }

  updateCanvasFunc(canvasElem) {
    this.canvasElem = canvasElem;
    if (!this.player) {
      this.initPlayer(canvasElem);
    }
  }

  initPlayer(canvasElem) {
    
    const config = this.genConfig();

    this.player = new LinePlayer({ config });
    const containerStyle = {
      width: canvasElem.width,
      height: canvasElem.height
    };
    const lines = this.getLines(this.lines);
    this.player.init({
      containerStyle,
      canvasElem,
      lines
    });
  }

  // 处理地图动作，清空绘画
  handleMapMove() {
    const mapMove = () => {
      this.clearCanvas();
      this.setLines(this.lines);
      this.changeProgress(this.progress);
      this.emitAnimateFinish();
    };
    clearTimeout(this.moveTimer);
    this.moveTimer = setTimeout(mapMove, 200);
  }

  setLines(lines: any[]) {
    const _lines = this.getLines(lines);
    this.player.setLines(_lines);
  }

  drawLines() {
    this.player.drawLines();
  }

  drawAnimateLines() {
    this.player.startAnimate();
    this.player.drawAnimateLines();
  }

  stopDrawAnimateLines() {
    this.player.stopAnimate();
  }

  clearCanvas() {
    this.player.stopAnimate();
    this.player.clearCanvas();
  }

  changeProgress(value) {
    this.clearCanvas();
    this.progress = value;

    // 把原来走的步数全都清空掉
    const lines = this.lines.map(line => {
      const lineCopy = { ...line };
      lineCopy.step = 0;
      return lineCopy;
    });

    const percent = value / 100; // 求出走的百分比
    const stepCount = this.totalStep * lines.length * percent;
    const remainder = stepCount % this.totalStep;
    let index = Math.floor(stepCount / this.totalStep);

    if (index !== this.lines.length) {
      lines[index].step = remainder;
    }

    while (index > 0) {
      const i = index - 1;
      lines[i].step = this.totalStep;
      index -= 1;
    }

    this.setLines(lines);
    this.drawLines();
  }
}
</script>
