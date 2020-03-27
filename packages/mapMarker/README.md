### MapMarker

地图标注子组件RzMapMarker可以为地图提供灵活的自定义标注功能。

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
        @click="handleClick"
        @zoomstart="handleZoomStart"
        @ready="handleMapReady"
      >
        <rz-map-marker
          v-for="marker in markers"
          :key="marker.position[0]"
          :position="marker.position"
          :offset="{ x: -20, y: -20 }"
          :visible="visible"
        >
          <div><img :src="marker.imgSrc" class="marker"/></div>
        </rz-map-marker>

      </rz-s-map>
    </div>
    <div class="ctrl-row"><span class="ctrl-label">是否可见</span><rz-on-off v-model="visible"></rz-on-off></div>
    <div class="ctrl-row"><rz-button @click="setMapViewPort">根据Marker位置调整viewport</rz-button></div>
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
  .marker {
    width: 40px;
    height: 40px;
  }
  .ctrl-row {
    margin: 10px;
  }
  .ctrl-label {
    margin-right: 20px;
  }
</style>

<script>
  const markerImg = require('doc/assets/images/map-marker.png');
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
            zoom: 8,
            minZoom: 3,
            maxZoom: 17
          },
        },
        center: [116.404, 39.915],
        zoom: 8,
        minZoom: 3,
        maxZoom: 17,
        markers: [
          {
            imgSrc: markerImg,
            position: [116.358, 39.918],
          },
          {
            imgSrc: markerImg,
            position: [117.3974, 40.49337],
          },
          {
            imgSrc: markerImg,
            position: [114.7482, 40.11305],
          },
        ],
        visible: true
      }
    },
    methods: {
      handleMapReady: function(event) {
        console.log('地图加载成功!', event);
      },
      handleZoomStart: function(e) {
        console.log('开始zoom', e);
      },
      handleClick: function(e) {
        console.log(e.point);
      },
      setMapViewPort: function() {
        const points = this.markers.map(marker => marker.position);
        this.$refs.map.setViewport(points, { margins: [50, 50, 50, 50] });
      }
    },
    destroyed() {
      console.log('首页component 销毁')
    }
  };
</script>
```
:::