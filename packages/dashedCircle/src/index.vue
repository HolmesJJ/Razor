<template>
  <!-- 编写 dashedCircle 组件 -->
  <div class="rz-dashedCircle">
    <canvas
      ref="canvas"
      v-for="item in circles"
      :key="item.id"
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseleave"
      @mousemove="handleMousemove"
      :style="{
        width:`${diameter}px`,
        height:`${diameter}px`,
      }"
      :width="diameter"
      :height="diameter"
    ></canvas>
  </div>
</template>

<script lang='ts'>

import { Vue, Component, Prop, Watch } from "vue-property-decorator";
const onePercentPI = (2 / 100) * Math.PI;
const mileSecond = 16;

@Component({
  name: "DashedCircle"
})
export default class DashedCircle extends Vue {
  @Prop({
    required: true,
    default() {
      return [];
    }
  })
  readonly circles: any[];

  canvas: HTMLCanvasElement;
  ctx: any;
  center1: { x: number; y: number } = { x: 75, y: 75 };
  timer = null;
  timer1 = null;
  canvas1 = null;
  ctx1 = null;
  radius: number = 250;
  annulusArr = [];
  canvasList = [];
  lineWidth = 50;
  i = 0;

  @Watch("circles")
  handleCriclesChange(value) {
    this.init();
  }

  get diameter() {
    return this.radius * 2;
  }
  get center(): { x: number; y: number } {
    return { x: this.radius, y: this.radius };
  }

  mounted() {
    const a0 = 10 * onePercentPI;
    const a1 = 1 * onePercentPI;
    const a2 = 15 * onePercentPI;
    this.annulusArr = [a0, a1, a2];
  }
  init() {
    this.$nextTick(() => {
      const canvasNodes = this.$el.childNodes;
      Array.from(canvasNodes).forEach(element => {
        const ctx = (element as HTMLCanvasElement).getContext("2d");
        const { x, y } = this.center;
        ctx.translate(x, y);
        this.initCircle(element);
      });
    });
  }

  initCircle(element) {
    const ctx = (element as HTMLCanvasElement).getContext("2d");
    let radius = this.radius;
    let rotateFlag = true;
    const { x, y } = this.center;

    const timer = setInterval(() => {
      this.drawCircles(ctx, x, y, radius, rotateFlag);
    }, mileSecond);

    this.canvasList.push({
      ctx,
      timer
    });
    element.__data = {
      ctx,
      timer
    };
  }

  // handleMouseenter1(event) {
  //   // clearInterval(this.timer);
  //   clearInterval(this.timer1);
  // }
  timeroo = null;
  handleMouseenter(event) {
    this.canvas = this.$refs.canvas as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");
    const ctx = this.ctx;
    const { x, y } = this.center;
    let radius = this.radius;
    let rotateFlag = false;
    clearInterval(this.timer);
    clearInterval(this.timeroo);

    this.timeroo = setInterval(() => {
      this.drawCircles(ctx, x, y, radius, rotateFlag);
    }, 16);
    // clearInterval(this.timer1);
  }

  handleMouseleave() {
    // event
    this.canvas = this.$refs.canvas as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");
    const ctx = this.ctx;
    const { x, y } = this.center;
    let radius = this.radius;
    let rotateFlag = true;
    clearInterval(this.timer);
    clearInterval(this.timeroo);
    this.timer = setInterval(() => {
      this.drawCircles(ctx, x, y, radius, rotateFlag);
    }, mileSecond);
  }

  handleMousemove(event) {
    // console.log(2222, event);
  }
  drawCircles(ctx, x, y, radius, rotateFlag) {
    const [a0, a1, a2] = this.annulusArr;
    ctx.translate(-x, -y);
    ctx.clearRect(0, 0, this.diameter, this.diameter);
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = this.lineWidth;
    ctx.translate(x, y);
    ctx.beginPath();

    ctx.strokeStyle = "#016Fa7";
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, a0);
    ctx.stroke();

    ctx.strokeStyle = "transparent";
    ctx.beginPath();
    ctx.arc(0, 0, radius, a0, a0 + a1);
    ctx.stroke();

    ctx.strokeStyle = "#016FB7";
    ctx.beginPath();
    ctx.arc(0, 0, radius, a0 + a1, a0 + a1 + a2);
    ctx.stroke();

    let angle = rotateFlag ? 1 : -1;
    if (rotateFlag) {
      this.i++;
      if (this.i >= 360) {
        this.i = this.i - 360;
      }
      ctx.rotate((angle * Math.PI) / 180);
    } else {
      if (this.i >= 0) {
        let ang = this.i % 5 ? 5 : this.i % 5;
        ctx.rotate((-ang * Math.PI) / 180);
        this.i = this.i - 5;
      } else {
        clearInterval(this.timeroo);
      }
    }
    //   ctx.rotate((-angle * Math.PI) / 180);

    // if (!rotateFlag) {
    //   let anglegap = this.i > 10 ? 10 : this.i
    //   ctx.rotate((-angle * Math.PI) / 180);
    //   this.i = this.i - 10;
    //   if (this.i <= 0) {
    //     clearInterval(this.timeroo);
    //     clearInterval(this.timer);
    //     return;
    //   }
    // }
  }
}
</script>
