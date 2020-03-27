### MapHeatmap

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
        <rz-map-heatmap :data="heatmapData"></rz-map-heatmap>
      </rz-s-map>
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
  export default {
    data() {
      return {
        mapConfig: {
          type: "baidu",
          content: {
            url:
              "http://api.map.baidu.com/getscript?v=3.0&ak=ecLlUVteVbnznhXOD2ad67bcmrQgOKi8&services=&t=20171031174121",
            theme: "midnight"
          },
          setting: {
            center: [116.404, 39.915],
            zoom: 8,
            minZoom: 3,
            maxZoom: 17
          }
        },
        center: [116.404, 39.915],
        zoom: 8,
        minZoom: 3,
        maxZoom: 17,
        heatmapData: [
          { lng: 116.418261, lat: 39.921984, count: 50 },
          { lng: 116.423332, lat: 39.916532, count: 51 },
          { lng: 116.419787, lat: 39.930658, count: 15 },
          { lng: 116.418455, lat: 39.920921, count: 40 },
          { lng: 116.418843, lat: 39.915516, count: 100 },
          { lng: 116.42546, lat: 39.918503, count: 6 },
          { lng: 116.423289, lat: 39.919989, count: 18 },
          { lng: 116.418162, lat: 39.915051, count: 80 },
          { lng: 116.422039, lat: 39.91782, count: 11 },
          { lng: 116.41387, lat: 39.917253, count: 7 },
          { lng: 116.41773, lat: 39.919426, count: 42 },
          { lng: 116.421107, lat: 39.916445, count: 4 },
          { lng: 116.417521, lat: 39.917943, count: 27 },
          { lng: 116.419812, lat: 39.920836, count: 23 },
          { lng: 116.420682, lat: 39.91463, count: 60 },
          { lng: 116.415424, lat: 39.924675, count: 8 },
          { lng: 116.419242, lat: 39.914509, count: 15 },
          { lng: 116.422766, lat: 39.921408, count: 25 },
          { lng: 116.421674, lat: 39.924396, count: 21 },
          { lng: 116.427268, lat: 39.92267, count: 1 },
          { lng: 116.417721, lat: 39.920034, count: 51 },
          { lng: 116.412456, lat: 39.92667, count: 7 },
          { lng: 116.420432, lat: 39.919114, count: 11 },
          { lng: 116.425013, lat: 39.921611, count: 35 },
          { lng: 116.418733, lat: 39.931037, count: 22 },
          { lng: 116.419336, lat: 39.931134, count: 4 },
          { lng: 116.413557, lat: 39.923254, count: 5 },
          { lng: 116.418367, lat: 39.92943, count: 3 },
          { lng: 116.424312, lat: 39.919621, count: 100 },
          { lng: 116.423874, lat: 39.919447, count: 87 },
          { lng: 116.424225, lat: 39.923091, count: 32 }
        ]
      };
    },
    methods: {
      handleMapReady: function(event) {
        console.log("地图加载成功!", event);
      },
      handleZoomStart: function(e) {
        console.log("开始zoom", e);
      },
      handleClick: function(e) {
        console.log(e.point);
      },
      setMapViewPort: function() {
        const points = this.markers.map(marker => marker.position);
        this.$refs.map.setViewport(points, { margins: [50, 50, 50, 50] });
      }
    }
  };
</script>
```

:::
