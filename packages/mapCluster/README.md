### MapCluster

地图点聚合子组件 RzMapCluster 可以为地图提供动态点聚合的功能。

- 基础点聚合的功能
- 设置 minZoom, maxZoom 控制在某个 zoom 范围内展示点聚合
- 更高度配置的点聚合功能，通过 map/reduce 函数来配置点位聚合以外的数据

#### 1. 基础聚合功能的 demo

需要实现具体的聚合功能，需要给子组件提供点位信息（points), 动态聚合的标注画法的配置 clusteredConfig, 以及没法聚合的情况下的标注的配置 unclusteredConfig。
基础功能的情况下，聚合点标注仅展示聚合了的点的个数数据。

#### 2. 自定义聚合的 demo

除了标准的聚合功能外，还可以通过配置 clusterGenerationConfig 的方式，来控制点聚合的展示。

1. 通过 minZoom, maxZoom 控制在一定的范围内展示点聚合，在范围外不展示。
2. 通过 map/reduce 方法控制在除了点的聚合数据之外的数据的 aggregation, 详见例子中的 alarmNum 这个字段。

除了聚合算法的配置，还可以通过更加灵活的 createElement 函数来定制更加复杂的标注。

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
        <rz-map-cluster
          v-if="showSimpleCluster"
          ref="cluster"
          :points="cameraData"
          :clusteredConfig="clusteredConfig"
          :unclusteredConfig="unclusteredConfig"
        >
        </rz-map-cluster>
        <rz-map-cluster
          v-if="showCustomCluster"
          ref="cluster"
          :points="cameraData2"
          :clusteredConfig="clusteredConfig2"
          :unclusteredConfig="unclusteredConfig2"
          :clusterGenerationConfig="clusterGenerationConfig"
        >
        </rz-map-cluster>
      </rz-s-map>
    </div>
    <div class="ctrl-group">
      <rz-button @click="showSimpleCluster = !showSimpleCluster">toggle simple</rz-button>
      <rz-button @click="showCustomCluster = !showCustomCluster">toggle custom</rz-button>
      <rz-button @click.native="getCurrentCluster">get current cluster</rz-button>
    <div>
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
    margin: 10px;
  }
</style>

<script>
export default {
  data() {
    return {
      showSimpleCluster: true,
      showCustomCluster: false,
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
        }
      },
      center: [116.404, 39.915],
      zoom: 8,
      minZoom: 3,
      maxZoom: 17,
      cameraData: [],
      cameraData2: [],
      clusterMode: '简单聚合',
      clusteredConfig: {
        offset: {
          x: -40,
          y: -40
        },
        markerElement: {
          width: 80,
          height: 80,
          backgroundColor: '#F44336',
          borderRadius: '50%',
          opacity: 0.8,
          textStyle: {
            color: '#fff',
            width: '100%',
            textAlign: 'center',
            display: 'block',
            top: '30px',
            position: 'absolute',
          }
        },
      },
      unclusteredConfig: {
        offset: {
          x: -15,
          y: -15
        },
        markerElement: {
          width: 12,
          height: 12,
          backgroundColor: '#FF9800',
        }
      },
      clusterGenerationConfig: {
        minZoom: 8,
        maxZoom: 12,
        map: (props) => ({ alarmNum: props.alarmNum }),
        reduce: (accumulated, props) => { accumulated.alarmNum += props.alarmNum; }
      },
      clusteredConfig2: {
        offset: {
          x: -40,
          y: -40
        },
        listeners: {
          click: (data) => {
            console.log('点击了这个cluster', data)
          }
        },
        markerElement: {
          createElement: this.createClusterElement
        },
      },
      unclusteredConfig2: {
        offset: {
          x: -15,
          y: -15
        },
        listeners: {
          click: (data) => {
            console.log('点击了这个cluster', data)
          }
        },
        markerElement: {
          createElement: this.createUnclusterElement
        }
      },
    }
  },
  created() {
    const data = require('doc/assets/js/arraySmallSampleGeoData.js').default;
    const cameraData = data.features.slice();
    const cameraData2 =
      data.features.map(camera => {
        return {
          ...camera,
          isSelected: false,
          properties: {
            alarmNum: 5
          }
        }
      })
    // Object.freeze(cameraData);
    this.cameraData = cameraData;
    this.cameraData2 = cameraData2;
  },
  methods: {
    createClusterElement(data) {
      const { point_count, alarmNum } = data.properties;

      let $el = document.createElement('div');
      const { width, height, backgroundColor, offsetX, offsetY } = {
        offsetX: -40,
        offsetY: -40,
        width: 80,
        height: 80,
        backgroundColor: "#F44336",
      }

      $el.style.cssText = `width: ${width}px; height: ${height}px; background: ${backgroundColor}; border-radius: 50%; opacity: 0.5`;

      let textNode;
      textNode = document.createElement('div');
      textNode.style.cssText = 'color: #fff; position: absolute; width: 100%; text-align: center';
      // create cluster text node
      textNode.style.top = '20px';
      textNode.innerHTML = `视频源${point_count}<br /> 告警数${alarmNum}`;

      $el.appendChild(textNode);
      return $el;
    },
    createUnclusterElement(data) {
      let $el = document.createElement('div');
      const { width, height, backgroundColor, offsetX, offsetY } = {
        offsetX: -15,
        offsetY: -15,
        width: 30,
        height: 30,
        backgroundColor: "#FF9800",
      };

      $el.style.cssText = `width: ${width}px; height: ${height}px; background: ${backgroundColor}; border-radius: 50%`;
      const { alarmNum } = data.properties;

      let textNode;
      textNode = document.createElement('div');
      textNode.style.cssText = 'color: #fff; position: absolute; width: 100%; text-align: center; top: 5px';

      textNode.innerHTML = `${alarmNum}次`;
      $el.appendChild(textNode);
      return $el;
    },
    getCurrentCluster() {
      const coordinates = [117.10335721401424, 39.366544329162444];
      console.log('cluster', this.$refs.cluster.getCurrentCluster(coordinates))
    }
  }
}
</script>

```

:::

Rz-Map-Cluster 的组件配置表：

### Rz-Map-Cluster Attributes

| 参数              | 说明                           | 类型              | 可选值 | 默认值 |
| ----------------- | ------------------------------ | ----------------- | ------ | ------ |
| points            | 需要做聚合的点位列表           | Point[ ]          | —      | —      |
| clusteredConfig   | 聚合后需要绘制的标注配置       | ClusterMarkersOpt | —      | —      |
| unclusteredConfig | 无法聚合的点需要绘制的标注配置 | ClusterMarkersOpt | —      | —      |

### ClusterMarkersOpt

| 参数          | 说明                                    | 类型                     | 可选值 | 默认值 |
| ------------- | --------------------------------------- | ------------------------ | ------ | ------ |
| offset        | 自定义标注的位移校准                    | { x: number, y: number } | —      | —      |
| markerElement | 标注的具体展示形式的配置                | CustomClusterMarker      | —      | —      |
| listeners     | 需要绑定的事件以及对应 handler 的键值对 | Record<string, Function> | —      | —      |

### CustomClusterMarker

| 参数            | 说明                                                     | 类型     | 可选值 | 默认值 |
| --------------- | -------------------------------------------------------- | -------- | ------ | ------ |
| width           | 标注的宽度                                               | number   | —      | —      |
| height          | 标注的高度                                               | number   | —      | —      |
| icon            | 如需配置一个图片作为标注主体可以使用 icon 配置图片的 url | string   | —      | —      |
| backgroundColor | 如果没有 icon 设置，可以设置标注的底色                   | string   | —      | —      |
| borderRadius    | 标注的 border-radius                                     | string   | —      | —      |
| opacity         | 标注的透明度                                             | number   | —      | —      |
| textStyle       | 标注上的字标的样式                                       | string   | —      | —      |
| borderRadius    | 标注的 border-radius                                     | string   | —      | —      |
| createElement   | 如果需要更细致的定制，可以使用 createElement 函数        | Function | —      | —      |
