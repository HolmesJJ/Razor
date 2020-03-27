### MapDrawingTools

地图子组件RzMapDrawingTools可以在地图之上绘制简单的几何图形。该子组件的应用场景主要是地图框选工具。

::: demo
```html
<template>
  <div>
    <div class="map-play">
      <rz-s-map
        ref="map"
        :center="center"
        :zoom="zoom"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        :config="mapConfig"
      >
        <rz-map-drawing-tools
          :mode="mode"
          :styleOptions="drawingStyleOptions"
          @drawing-complete="handleDrawingComplete"
          :keepOverlay="keepOverlay"
          :drawingOnce="drawingOnce"
          ref="drawingtool"
        ></rz-map-drawing-tools>
      </rz-s-map>
    </div>
    <rz-radio-group class="ctrl-group" v-model="radio" size="medium" @change="change2Mode">
      <rz-radio-button v-for="(choice, idx) in drawingToolsConf" :key="choice.mode" :label="choice.mode">{{ choice.modeText }}</rz-radio-button>
    </rz-radio-group>
    <div class="ctrl-display-row">
      <rz-button size="medium" @click="keepOverlay = !keepOverlay">toggle保留绘制图形</rz-button>
      <div class="label-text">{{ keepOverlayCtrlText }}</div>
    </div>
    <div class="ctrl-display-row">
      <rz-button size="medium" @click="drawingOnce = !drawingOnce">toggle连续绘制</rz-button>
      <div class="label-text">{{ drawingOnceText }}</div>
    </div>
    <div class="ctrl-display-row">
      <rz-button size="medium" @click="clearAll">清除所有图形</rz-button>
    </div>
  </div>
</template>

<style>
  body {
    margin: 0;
  }
  .map-play {
    width: 800px;
    height: 600px;
    margin: auto;
  }
  .ctrl-group {
    margin: 15px;
  }
  .ctrl-display-row {
    display: flex;
    margin: 0 0 15px 15px;
    align-items: center;
  }
  .ctrl-display-row .label-text {
    padding-left: 10px;
  }
</style>

<script>
  export default {
    data() {
      return {
        mapConfig: {
          type: "baidu",
          content: {
            url:
              "http://api.map.baidu.com/getscript?v=3.0&ak=ecLlUVteVbnznhXOD2ad67bcmrQgOKi8&services=&t=20171031174121",
            theme: 'midnight',
            // drawingManagerUrl: './assets/baiduMapDrawingTool/baiduMapDrawManager.js',
            // drawingManagerCss: "./assets/baiduMapDrawingTool/baiduMapDrawManager.css"
          },
          setting: {
            center: [116.404, 39.915],
            zoom: 8,
            minZoom: 3,
            maxZoom: 17
          },
        },
        center: [116.404, 39.915],
        zoom: 8,
        minZoom: 3,
        maxZoom: 17,
        mode: 'rectangle',
        drawingStyleOptions: {
          strokeColor: '#5a92f2',    //边线颜色。
          fillColor: '#5a92f2',      //填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 2,       //边线的宽度，以像素为单位。
          strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
          fillOpacity: 0.3,      //填充的透明度，取值范围0 - 1。
          strokeStyle: 'solid' //边线的样式，solid或dashed。
        },
        drawingToolsConf: [
          {
            mode: 'rectangle',
            modeText: '矩形'
          },
          {
            mode: 'circle',
            modeText: '圆形'
          },
          {
            mode: 'polygon',
            modeText: '多边形'
          }
        ],
        radio: 'rectangle',
        keepOverlay: true,
        drawingOnce: true
      }
    },
    computed: {
      keepOverlayCtrlText() {
        return this.keepOverlay ? '保留绘制图形' : '不保留绘制图形';
      },
      drawingOnceText() {
        return this.drawingOnce ? '不连续绘制' : '连续绘制';
      }
    },
    methods: {
      handleDrawingComplete(event) {
        console.log('----catch drawing complete ----');
        console.log(event);
        // 如果不连续绘制 必须把模式设置回 hander
        if (this.drawingOnce) {
          this.radio = 'hander';
          this.change2Mode();
        }
      },
      change2Mode() {
        this.mode = this.radio;
      },
      clearAll() {
        this.$refs.drawingtool.clearAll();
      }
    },
  };
</script>
```
:::

Rz-Map-Drawing-Tools的组件配置表：
### Rz-Map-Drawing-Tools Attributes
| 参数           | 说明                                                                                             | 类型    | 可选值                                                                                            | 默认值                                            |          
| -------------- | ------------------------------------------------------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| mode        | 绘制模式                            | String  | rectangle / circle / polygon / hander                                                         | hander                                              |
| styleOptions        | 绘制样式配置                            | PolygonOptions  | —                                                       | —                                              |
| keepOverlay        | 是否在绘制结束之后立即清除绘制图形                            | Boolean  | —                                                       | false                                              |
| drawingOnce        | 是否在绘制一个图形之后推出绘制状态                            | Boolean  | —                                                       | false                                              |


### Rz-S-Map Events
| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| drawing-complete  | 每次图形绘制完成时触发此事件 | - |

