### MapPolyline

地图折线子组件RzMapPolyline可以根据转折点的经纬度在地图上绘制折线。地图折线子组件提供的配置如下:

- 折线的样式：粗细，颜色，透明度
- 是否在尾端绘制箭头
- 显示为曲线（curve）

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
      <rz-map-polyline 
        :path="[[116.404, 39.915],[116.414, 39.935],[116.504, 39.915]]"
        strokeColor="#fff"
        strokeWeight="3"
        strokeOpacity="0.7"
      visible arrow></rz-map-polyline>

       <rz-map-polyline 
        :path="[[116.345, 39.912],[116.387, 39.938],[116.379, 39.894]]"
        strokeColor="#fff"
        strokeWeight="3"
        strokeOpacity="0.7"
      visible curve></rz-map-polyline>
    </rz-s-map>
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
      } 
    },
    methods: {
      handleZoomEnd: function(e) {
        console.log('开始zoom', e.zoom);
      },
      handleClick: function(e) {
        console.log(e.point)
      }
    },
  };
</script>
```
:::

