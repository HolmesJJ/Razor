<template>
  <div class="rz-PolygonDrawer">
    <slot name="container"></slot>
    <canvas
      ref="canvas"
      class="rz-PolygonDrawer__board"
      v-show="showCanvas"
      @mousedown="transformAndAddVertex"
      @mousemove="handleCanvasMouseMove"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from "vue-property-decorator";

import {
  Drawer,
  drawerEvents,
  transformVertex
} from "rz/utils/canvas/polygonDrawer";
import { IVertex } from "rz/utils/canvas/layer";

enum DrawMode {
  polygon = 0,
  line = 1,
  arrowLine = 2,
  rect = 3
}
/**
 * 1. 鼠标按下,添加顶点
 * 2. Drawer 添加顶点
 * 3. Drawer 接受到顶点
 * 4. Drawer 根据目前的绘画模式,绘画不同的 layer
 * 5. 每次添加顶点, 判断当前模式,再对应使用不同的添加顶点的方式
 * 6. 鼠标在画板上移动的时候,每次需要绘制之前已有的数据,并根据绘画模式绘制当前所画图形
 * 7. 绘画完毕, 通过事件通知 Vue Component 执行 callback 采用 EventManager 的管理
 * 8. 具体绘制方法都抽离放在 src/utils/canvas/utils.ts
 * 9. 绘画结束会把数据往外 emit
 * 10. 外部组件,接收到数据,改变数据, 并关闭绘画状态
 *
 *  初始化流程:
 *  外界需要输入数据 :
 *    options : 绘画各个图形的 选项 ,
 *    polygons : 需要第一次加载就绘画的多边形
 *    lines: 需要第一次加载就绘画的直线
 *    rects: 需要第一次加载就绘画的矩形
 *    arrowLines: 需要第一次加载就绘画的带箭头直线
 *    drawMode: 默认可以不传, 作为改变绘画模式的一个标志
 *    showDrawer: 控制绘画器的显示隐藏
 */

@Component({
  name: "PolygonDrawer"
})
export default class PolygonDrawer extends Vue {
  @Prop({ type: Boolean, default: false, required: true })
  readonly drawState: boolean;

  @Prop({ type: Boolean, default: true })
  readonly showDrawer: boolean;

  @Prop({ type: Array, default: () => [], required: true })
  readonly polygons: any[];

  @Prop({ type: Array, default: () => [], required: false })
  readonly lines: any[];

  @Prop({ type: Array, default: () => [], required: false })
  readonly rects: any[];

  @Prop({ type: Array, default: () => [], required: false })
  readonly arrowLines: any[];

  @Prop({ type: Boolean, default: false })
  readonly convexPolygonJudge: boolean;

  @Prop({
    type: Object,
    default() {
      return {};
    }
  })
  readonly options: any;

  @Prop({ type: Number, default: 0 })
  readonly drawMode: DrawMode; // 绘画模式

  @Prop({ type: Number, default: 0 })
  readonly delay: number; // 延迟delay

  containerStyle: any = {};

  canvasMoveDebounceTime: number; // it will not be observe

  Drawer: any; // it will not be observe

  drawerEvents: any; // it will not be observe

  @Watch("drawState")
  drawStateChange(state) {
    if (!state) {
      this.resetDrawer(this.polygons, this.lines, this.arrowLines, this.rects);
    } else {
      this.startDraw();
    }
  }

  @Watch("options", { deep: true })
  handleOptionsChange(val = {}) {
    this.Drawer.initOption(val);
  }

  @Watch("drawMode")
  handleDrawModeChange(val = 0) {
    this.Drawer.changeDrawMode(val);
  }

  @Watch("convexPolygonJudge")
  handleConvexPolygonJudgeChange(val) {
    this.Drawer.setConvexPolygonJudge(val);
  }

  get showCanvas() {
    return this.drawState || this.showDrawer;
  }

  setDrawerPolygons(polygons) {
    this.Drawer.setPolygons(polygons);
  }

  transformAndAddVertex(event) {
    event.preventDefault();
    const vertex: IVertex = transformVertex(event);
    this.Drawer.addVertex(vertex);
  }

  getContainer() {
    const containers: any[] = this.$slots.container;
    if (containers && containers.length === 1) {
      const container = containers[0].elm as HTMLElement;
      return container;
    } else
      throw new Error(
        "[Razor Error] the slot container must exist and be unique "
      );
  }

  getComputedStyle() {
    const container = this.getContainer();
    this.containerStyle = container.getBoundingClientRect();

    if (!this.containerStyle.height) {
      throw new Error("[Razor Error] the container height is unset");
    }
    return this.containerStyle;
  }

  init() {
    let containerStyle = this.getComputedStyle();

    const {
      polygons,
      options,
      lines,
      arrowLines,
      rects,
      convexPolygonJudge
    } = this;
    const config = { containerStyle, hintDistance: 5, convexPolygonJudge };
    const canvasElem = this.$refs.canvas;

    this.Drawer = new Drawer(
      canvasElem,
      config,
      options,
      polygons,
      lines,
      arrowLines,
      rects
    );

    if (this.drawMode) {
      this.Drawer.changeDrawMode(this.drawMode);
    }

    this.onDrawerEvent("drawPolygonFinish");

    this.onDrawerEvent("drawLineFinish");

    this.onDrawerEvent("drawArrowLineFinish");

    this.onDrawerEvent("drawRectFinish");
  }

  @Emit("draw-polygon-finish")
  handleDrawPolygonFinish(polygon) {
    return polygon;
  }

  @Emit("draw-line-finish")
  handleDrawLineFinish(line) {
    return line;
  }

  @Emit("draw-arrowline-finish")
  handleDrawArrowLineFinish(arrowLine) {
    return arrowLine;
  }

  @Emit("draw-rect-finish")
  handleDrawRectFinish(rect) {
    return rect;
  }

  handleCanvasMouseMove(event) {
    event.preventDefault();
    if (!this.drawState) {
      return;
    }
    this.Drawer.handleCanvasMouseMove(event);
  }

  drawPolygon() {}

  drawPolygons() {
    this.Drawer.drawPolygons(this.polygons);
  }

  resetDrawer(polygons = [], lines = [], arrowLines = [], rects = []) {
    this.Drawer.resetDrawer(polygons, lines, arrowLines, rects);
    this.Drawer.stopDraw();
  }

  clearDrawer() {
    this.Drawer.clearDrawer();
    this.Drawer.stopDraw();
  }

  startDraw() {
    this.Drawer.startDraw();
  }

  onDrawerEvent(key) {
    this.Drawer.on(
      this.drawerEvents[key].eventName,
      this.drawerEvents[key].callback
    );
  }

  removeDrawerEvent(key) {
    this.Drawer.remove(
      this.drawerEvents[key].eventName,
      this.drawerEvents[key].callback
    );
  }

  removeDrawerListeners() {
    Object.keys(this.drawerEvents).forEach(key => {
      this.removeDrawerEvent(key);
    });
  }

  initEvents() {
    function merge(eventHandles, drawerEvents) {
      Object.keys(eventHandles).forEach(event => {
        eventHandles[event].eventName = drawerEvents[event].eventName;
      });
      return eventHandles;
    }
    const eventHandles = {
      drawPolygonFinish: {
        callback: this.handleDrawPolygonFinish
      },
      drawLineFinish: {
        callback: this.handleDrawLineFinish
      },
      drawArrowLineFinish: {
        callback: this.handleDrawArrowLineFinish
      },
      drawRectFinish: {
        callback: this.handleDrawRectFinish
      }
    };
    this.drawerEvents = merge(eventHandles, drawerEvents);
  }

  created() {
    this.initEvents();
  }

  mounted() {
    if (this.delay) {
      setTimeout(this.init, this.delay);
    } else {
      this.init();
    }
  }

  deactivated() {
    this.Drawer && this.Drawer.dispose();
    this.Drawer = null;
  }

  beforeDestroy() {
    this.Drawer && this.Drawer.dispose();
    this.Drawer = null;
  }
}
</script>
