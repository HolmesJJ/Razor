### MapPolygon

地图折线子组件RzMapPolygon可以根据顶点的经纬度在地图上绘制多边形。注意：多边形子组件，圆形子组件是用来在地图上画出形状的，如果需要用户绘制形状，那么可以使用地图绘制工具子组件。

地图多边形子组件提供的配置如下:
 
- 多边形的边线样式：粗细，颜色，透明度，线型（虚线/实线）
- 多边形的填充样式：颜色，透明度
- visible参数控制多边形是否展示

::: demo
```html
<template>
  <div class="map-play">
    <rz-s-map
      ref="map"
      :center="center"
      :zoom="zoom"
      :min-zoom="minZoom"
      :max-zoom="maxZoom"
      :config="mapConfig"
      @zoomend="handleZoomEnd"
      @click="handleClick"
    >
      <rz-map-polygon 
        :path="[[116.404, 39.915],[116.414, 39.935],[116.504, 39.915]]"
        strokeColor="#fff"
        strokeWeight="3"
        strokeOpacity="0.7"
        fillColor="#56668d"
        fillOpacity="0.3"
        :visible="isVisible"
        @click="handlePolygonClick"
        @dblclick="handlePolygonDblClick"
      ></rz-map-polygon>
    </rz-s-map>
  </div>
  <div class="ctrl-group"><span>显示多边形</span><rz-on-off v-model="isVisible"></rz-on-off></div>
</template>

<style scoped>
  body {
    margin: 0;
  }
  .map-play {
    width: 800px;
    height: 600px;
    margin: auto;
  }
  .ctrl-group {
    margin: 10px;
  }
  .ctrl-group span {
    margin-right: 10px;
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
            theme: 'midnight'
          },
          setting: {
            center: [116.404, 39.915],
            zoom: 13,
            minZoom: 3,
            maxZoom: 17
          } 
        },
        center: [116.404, 39.915],
        zoom: 13,
        minZoom: 3,
        maxZoom: 17,
        isVisible: true
      } 
    },
    methods: {
      handleZoomEnd: function(e) {
        console.log('开始zoom', e.zoom);
      },
      handleClick: function(e) {
        console.log(e.point)
      },
      handlePolygonClick: function(e) {
        e.originalEvent.stopPropagation();
        console.log('polygon is clicked', e);
      },
      handlePolygonDblClick: function(e) {
        // console.log('双击polygon');
        e.originalEvent.stopPropagation();
      }
    },
  };
</script>
```
:::

