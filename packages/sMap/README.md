### Map

地图基础用法，以及基础 events

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
      @click="handleClick"
      @zoomend="handleZoomEnd"
      @ready="handleMapReady"
    >
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
            theme: "midnight",
            offline: false,
            offlineHome: "http://10.9.244.30:10219/static/offlineMap/",
            offlineTilesDir: "http://10.9.244.30:10219/static/offlineMap/tiles"
          },
          setting: {
            center: [116.404, 39.915],
            zoom: 8,
            minZoom: 3,
            maxZoom: 18
          }
        },
        center: [116.404, 39.915],
        zoom: 8,
        minZoom: 3,
        maxZoom: 17
      };
    },
    methods: {
      handleMapReady: function(event) {
        console.log("地图加载成功!", event);
      },
      handleClick: function(e) {
        console.log("当前经纬度", e.point);
      },
      handleZoomEnd: function(e) {
        console.log("开始zoom", e.zoom);
      }
    },
    destroyed() {
      console.log("首页component 销毁");
    }
  };
</script>
```

:::

Rz-S-Map 的组件配置表：

### Rz-S-Map Attributes

| 参数    | 说明                                                | 类型        | 可选值 | 默认值 |
| ------- | --------------------------------------------------- | ----------- | ------ | ------ |
| center  | 地图中心点                                          | Point       | —      | —      |
| zoom    | 地图缩放等级（百度地图为 3-19）                     | Number      | —      | —      |
| minZoom | 地图缩放的最小等级（百度地图为 3）                  | Number      | —      | —      |
| maxZoom | 地图缩放的最大等级（百度地图为 19）                 | Number      | —      | —      |
| config  |  地图初始化配置项，需要根据不同的地图给出不同的配置 | RzMapConfig | —      | —      |

### 地图 config 说明

| 参数    | 说明                                           | 类型                               | 可选值              | 默认值 |
| ------- | ---------------------------------------------- | ---------------------------------- | ------------------- | ------ |
| type    | 需要使用的具体图商 (百度地图为 baidu)          | String                             | 'baidu' / 'minemap' | —      |
| content | 地图具体配置，根据不同的图商需要提供不同的参数 | -                                  | —                   | —      |
| setting | 地图初始化时的配置                             | { center, zoom, minZoom，maxZoom } | —                   | —      |

### 百度地图 config.content 说明

| 参数            | 说明                                                      | 类型    | 可选值                | 默认值   |
| --------------- | --------------------------------------------------------- | ------- | --------------------- | -------- |
| url             | 百度在线地图的 js script 链接，需要包括 ak 信息           | String  | —                     | —        |
| theme           | 百度地图的主题模式，当前 Razor 提供普通模式和暗夜模式两种 | String  | 'normal' / 'midnight' | 'normal' |
| offline         | 是否使用离线地图                                          | boolean | —                     | false    |
| offlineHome     | 离线地图 library 的访问路径                               | String  | —                     | —        |
| offlineTilesDir | 离线地图瓦片图的访问路径                                  | String  | —                     | —        |

### 高德地图 config.content 说明

| 参数  | 说明                                                      | 类型   | 可选值                | 默认值                   |
| ----- | --------------------------------------------------------- | ------ | --------------------- | ------------------------ |
| url   | 高德地图的 js/css 链接地址，需要包括 ak 信息              | String | —                     | 请参考下面"url 配置示例" |
| theme | 高德地图的主题模式，当前 Razor 提供普通模式和暗夜模式两种 | String | 'normal' / 'midnight' | 'normal'                 |

### 高德地图 config.content.url 说明

| url 配置示例 |
| ------------ |


| {
main: [
["http://15.75.0.255:25002/jsmap/1.0/demo/scripts/jsurl.js", "script"],
["http://15.75.0.255:25001/as/webapi/js/auth?v=1.0&t=jsmap&ak=ec85d3648154874552835438ac6a02b2", "script"],
],
deps: [
["http://15.75.0.255:25002/jsmap/1.0/IMap.css", "stylesheet"],
["http://15.75.0.255:25002/jsmap/1.0/main.js", "script"],
["http://15.75.0.255:25002/jsmap/1.0/flash/IMapStreetView.js", "script"],
],
conf: [["http://15.75.0.255:25001/as/webapi/js/auth?v=1.0&t=jsmapconfig&ak=ec85d3648154874552835438ac6a02b2", "script"]]
}

### Rz-S-Map Events

| 事件名称  | 说明                                 | 回调参数 |
| --------- | ------------------------------------ | -------- |
| click     | 左键单击地图时触发此事件             | -        |
| ready     | 当地图所有图块完成加载时触发此事件   | -        |
| zoomstart | 地图更改缩放级别开始时触发触发此事件 | -        |
| zoomend   | 地图更改缩放级别结束时触发触发此事件 | -        |
| mouseover | 鼠标移入地图区域时触发此事件         | -        |
| mouseout  | 鼠标移出地图区域时触发此事件         | -        |
