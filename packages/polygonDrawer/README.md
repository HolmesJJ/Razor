### PolygonDrawer 多边形绘画器

:::demo

```html
<template>
  <div>
    <rz-polygon-drawer
      ref="drawer"
      @draw-polygon-finish="handleDrawPolygonFinish"
      @draw-line-finish="handleDrawLineFinish"
      @draw-arrowline-finish="handleDrawArrowLineFinish"
      @draw-rect-finish="handleDrawRectFinish"
      :convex-polygon-judge="convexPolygonJudge"
      :drawMode="drawMode"
      :lines="lines"
      :arrowLines="arrowLines"
      :showDrawer="true"
      :polygons="polygons"
      :rects="rects"
      :drawState="drawState"
      :options="options"
    >
      <div
        style="width:100%;height:500px; background:rgba(60, 60, 60, 0.3);border:1px dashed rgb(62, 150, 215)"
        slot="container"
      ></div>
    </rz-polygon-drawer>
    <div style="margin:10px;">
      <rz-button type="success" @click="changeOptions"
        >change options</rz-button
      >
      <rz-button type="primary" @click="startDraw">start draw</rz-button>
      <rz-button type="warning" @click="cancelDrawing">stop drawing</rz-button>
      <rz-button type="default" @click="clearDrawer">clear drawer</rz-button>
      <rz-button type="danger" @click="resetDrawer">reset drawer</rz-button>
    </div>
    <div style="margin:10px;">
      <rz-radio-group class="ctrl-group" v-model="drawMode" size="medium" @change="changeDrawMode">
        <rz-radio-button v-for="(choice, idx) in drawModes" :key="choice.mode" :label="choice.mode">{{ choice.modeText }}</rz-radio-button>
      </rz-radio-group>
    </div>
    <div style="margin:10px;">
      多边形凸凹检测 : <rz-on-off v-model="convexPolygonJudge"></rz-on-off>
    </div>
  </div>
</template>

<script>
  const options = {
    drawLineOption: {
      color: '#4285f4',
      weight:3,
      opacity:0.8
    },
    drawCircleOption: {
      lineColor: '#4285f4',
      weight:1,
      opacity:0.8
    },
    drawPolygonOption: {
      lineColor: '#4285f4',
      fillColor: '#f8545c',
      weight:3,
      opacity:0.5
    },
    drawArrowLineOption: {
      color: '#3395f4',
      weight:3,
      opacity:0.8,
      strokeStyle: '#68cdfa',
      colorFill: ['#68cdfa', '#68cdfa']
    },
    drawRectOption:{
      lineColor: '#f2211e',
      fillColor: '#ff9900',
      weight:2,
      opacity:0.5,
    }
  };

  const drawMode = {
    polygon:0,
    line:1,
    arrowLine:2,
    rect:3
  };
  /* 简单复制对象 */
  function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  export default {
    data() {
      return {
        drawState: false,
        drawMode:0,
        drawModes:[
          {
            mode:0,
            modeText: '多边形'
          },
          {
            mode:1,
            modeText: '直线'
          },
          {
            mode:2,
            modeText: '箭头线'
          },
          {
            mode:3,
            modeText: '矩形'
          }
        ],
        lines: [
          {
            vertexes: [{ x: 153, y: 334 }, { x:128, y:82 }],
            options: {
              color: '#9154f4',
              weight:3,
              opacity:0.8
            }
          },
          {
            vertexes: [{ x:22, y:33 }, { x:221, y:82 }],
            options: copy(options.drawLineOption)
          },
          {
            vertexes: [{ x:34, y:334 }, { x:98, y:82 }],
            options: copy(options.drawLineOption)
          }
        ],
        arrowLines: [
          {
            vertexes: [{ x:100, y:334 }, { x:600, y:82 }],
            options: copy(options.drawArrowLineOption)
          }
        ],
        polygons: [
          {
            vertexes: [
              { x:153, y:334 },
              { x:425, y:82 },
              { x:472, y:328 },
              { x:153, y:334 }
            ],
            options: copy(options.drawPolygonOption)
          }
        ],
        options: copy(options), // 防止引用
        
        rects:[
          {
            vertexes: [{ x:34, y:334 }, { x:98, y:82 }],
            options: copy(options.drawRectOption)
          }
        ],

        convexPolygonJudge: false
      };
    },
    methods: {
      startDraw() {
        this.drawState = true;
      },
      cancelDrawing() {
        this.drawState = false;
      },
      clearDrawer() {
        this.polygons = [];
        this.lines = [];
        this.arrowLines = [];
        this.rects = [];
        this.$refs.drawer.clearDrawer();
        this.drawState = false;
      },

      handleDrawPolygonFinish(polygon) {
        this.drawState = false;
        this.polygons.push(polygon);
      },
      changeOptions() {
        const color = Math.floor(Math.max(Math.random(), 0.2) * 999999);
        const lineColor = Math.floor(Math.max(Math.random(), 0.2) * 999999);

        if (this.drawMode === drawMode.polygon) {
          this.options.drawPolygonOption = {
            lineColor: `#${lineColor}`,
            fillColor: `#${color}`,
            weight:3,
            opacity:0.5
          };

          this.options.drawLineOption = {
            color: `#${lineColor}`,
            weight:3,
            opacity:0.8
          };
        }

        if (this.drawMode === drawMode.line) {
          this.options.drawLineOption = {
            color: `#${lineColor}`,
            weight:3,
            opacity:0.8
          };
        }

        if (this.drawMode === drawMode.arrowLine) {
          this.options.drawArrowLineOption = {
            color: `#${lineColor}`,
            weight:3,
            opacity:0.8,
            strokeStyle: `#${lineColor}`,
            colorFill: [`#${color}`, `#${color}`]
          };
        }

        if (this.drawMode === drawMode.rect) {
          this.options.drawRectOption = {
            lineColor: `#${lineColor}`,
            fillColor: `#${color}`,
            weight:2,
            opacity:0.5,
          };
        }
      },
      resetDrawer() {
        const _options = JSON.parse(JSON.stringify(options)); // 防止引用
        this.polygons = [
          {
            vertexes: [
              { x:153, y:334 },
              { x:425, y:82 },
              { x:472, y:328 },
              { x:153, y:334 }
            ],
            options: _options.drawPolygonOption
          }
        ];
        this.lines = [
          {
            vertexes: [{ x:153, y:334 }, { x:128, y:82 }],
            options: {
              color: '#9154f4',
              weight:3,
              opacity:0.8
            }
          },
          {
            vertexes: [{ x:22, y:33 }, { x:221, y:82 }],
            options: _options.drawLineOption
          },
          {
            vertexes: [{ x:34, y:334 }, { x:98, y:82 }],
            options: _options.drawLineOption
          }
        ];

        this.arrowLines = [
          {
            vertexes: [{ x:100, y:334 }, { x:600, y:82 }],
            options: _options.drawArrowLineOption
          }
        ];

        this.rects = [
          {
            vertexes: [{ x:34, y:334 }, { x:98, y:82 }],
            options: {
              lineColor: '#f2211e',
              fillColor: '#ff9900',
              weight:2,
              opacity:0.5,
            }
          }
        ]

        /* 这里需要把需要重新绘制的数据重新置入 */
        this.$refs.drawer.resetDrawer(
          this.polygons,
          this.lines,
          this.arrowLines,
          this.rects
        );
        this.drawState = false;
      },

      changeDrawMode(drawMode) {
        this.drawMode = drawMode;
        this.changeOptions();
      },

      handleDrawLineFinish(line) {
        this.drawState = false;
        this.lines.push(line);
      },

      handleDrawArrowLineFinish(arrowLine) {
        this.drawState = false;
        this.arrowLines.push(arrowLine);
      },

      handleDrawRectFinish(rect){
        this.drawState = false;
        this.rects.push(rect);
      }
    }
  };
</script>
```

:::

### 绘画流程:

1. 鼠标按下,添加顶点
2. Drawer 添加顶点
3. Drawer 接受到顶点
4. Drawer 根据目前的绘画模式,绘画不同的 layer
5. 每次添加顶点, 判断当前模式,再对应使用不同的添加顶点的方式
6. 鼠标在画板上移动的时候,每次需要绘制之前已有的数据,并根据绘画模式绘制当前所画图形
7. 绘画完毕, 通过事件通知 Vue Component 执行 callback 采用 EventManager 的管理
8. 具体绘制方法都抽离放在 src/utils/canvas/utils.ts
9. 绘画结束会把数据往外 emit 
10. 外部组件,接收到数据,改变数据, 并关闭绘画状态

### 初始化流程:

#### 1. 外界需要输入数据 :

1.  options : 绘画各个图形的 选项
2.  polygons : 需要第一次加载就绘画的多边形
3.  lines: 需要第一次加载就绘画的直线
4.  arrowLines: 需要第一次加载就绘画的带箭头直线
5.  drawMode: 默认可以不传, 作为改变绘画模式的一个标志
6.  showDrawer: 控制绘画器的显示隐藏

#### [ Tips ] 所有要操作数据都应该在 mounted 之后

### PolygonDrawer Attributes

| 参数                 | 说明                                                                             | 默认值 |
| -------------------- | -------------------------------------------------------------------------------- | ------ |
| polygons             | 绘制的 polygon 列表                                                              | []     |
| lines                | 绘制的 lines 列表                                                                | []     |
| arrowLines           | 绘制的 arrowLines 列表                                                           | []     |
| rects                | 绘制的 rects 列表                                                                | []     |
| drawState            | 必选参数 绘画状态                                                                | false  |
| showDrawer           | 控制绘画器的显示隐藏                                                             | true   |
| drawMode             | 默认可以不传, 作为改变绘画模式的一个标志 0: 多边形 1: 直线 2: 带箭头直线 3: 矩形 | 0      |
| options              | 绘画各个图形的选项, 具体配置需要看下 demo                                        | {}     |
| convex-polygon-judge | 是否开启多边形的凸凹检测                                                         | false  |
| delay                | 可选参数 (number) 延迟加载的毫秒数                                               | 0      |

### Events

| 事件名称              | 说明                 | 回调参数  |
| --------------------- | -------------------- | --------- |
| draw-polygon-finish   | 画多边形结束后触发   | polygon   |
| draw-line-finish      | 画直线结束后触发     | line      |
| draw-arrowline-finish | 画箭头直线结束后触发 | arrowLine |
