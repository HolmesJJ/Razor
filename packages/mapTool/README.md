### MapTool

目前的 mapTool 不是地图组件的一部分，只是一个普通的 Vue 组件，所以使用的时候需要注意一下 2 点:

1. 需要自己根据事件去实现缩放和重置 (具体可参考下面样例)
2. mapTool 是绝对定位的，需要根据其相对元素来定位，注意其父级的 position 属性

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
        <rz-map-tool
          @zoom-in="handleZoomIn"
          @zoom-out="handleZoomOut"
          @reset="handleReset"
        />
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
    position: relative;
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
          type: 'baidu',
          content: {
            url:
              'http://api.map.baidu.com/getscript?v=3.0&ak=ecLlUVteVbnznhXOD2ad67bcmrQgOKi8&services=&t=20171031174121',
            theme: 'midnight'
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
        maxZoom: 17
      };
    },
    methods: {
      handleReset() {
        this.center = [116.404, 39.915];
        this.zoom = 8;
      },
      handleZoomIn() {
        this.zoom++;
      },
      handleZoomOut() {
        this.zoom--;
      }
    }
  };
</script>
```

:::

### Events

| 事件名   | 说明                 | 参数 |
| -------- | -------------------- | ---- |
| reset    | 当点击重置按钮时触发 | -    |
| zoom-in  | 当点击放大按钮时触发 | -    |
| zoom-out | 当点击缩小按钮时触发 | -    |
