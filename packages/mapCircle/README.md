### MapCircle

地图折线子组件RzMapCircle可以根据圆心经纬度在。地图折线子组件提供的配置如下:

- 圆的边线样式：粗细，颜色，透明度，线型（虚线/实线）
- 圆的填充样式：颜色，透明度
- 圆的半径：单位（米）

以下demo主要展示了地图画圆的能力 以及 动态改变圆心位置的能力（点击地图，在点击事件handler中改变圆心位置）。

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
      <rz-map-circle 
        :center="circleCenter"
        radius="3000"
        strokeStyle="dashed"
        fillColor="#56668d"
        fillOpacity="0.3"
        visible
      ></rz-map-circle>
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
        zoom: 13,
        minZoom: 3,
        maxZoom: 17,
        center: [116.404, 39.915],
        circleCenter: [116.404, 39.915]
      } 
    },
    methods: {
      handleZoomEnd: function(e) {
        console.log('开始zoom', e.zoom);
      },
      handleClick: function(e) {
        this.circleCenter = e.point;
        console.log(e.point)
      }
    },
  };
</script>
```
:::

