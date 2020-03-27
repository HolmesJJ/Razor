<template>
  <div class="rz-tree-map__map-wrapper">
    <map-drawing-tool-bar :initialMode="mode" @change="setDrawingToolMode"></map-drawing-tool-bar>
    <rz-s-map ref="map" :center="center" :zoom="zoom" :config="mapConfig">
      <rz-map-cluster
        v-if="cameraData"
        :points="cameraData"
        :clusteredConfig="clusteredConfig"
        :unclusteredConfig="unclusteredConfig"
        :clusterGenerationConfig="clusterGenerationConfig"
        ref="clusterManager"
      ></rz-map-cluster>

      <rz-map-drawing-tools
        :mode="mode"
        :keepOverlay="keepOverlay"
        :styleOptions="drawingStyleOptions"
        @drawing-complete="handleDrawingComplete"
      ></rz-map-drawing-tools>
    </rz-s-map>
  </div>
</template>

<script lang='ts'>

import { Vue, Component, Prop, Watch } from "vue-property-decorator";

import MapDrawingToolBar from "./MapDrawingToolBar.vue";

import MapCalculation from "./service/mapCalculation";
import Broker from "./service/broker";
import ClusterDrawingUtils from "./service/clusterDrawingUtils";

import RzSMap from "pkg/sMap";
import RzMapCluster from "pkg/mapCluster";
import RzMapDrawingTools from "pkg/mapDrawingTools";

// store
import store from "./service/store";

@Component({
  name: "MapSelector",
  components: {
    RzSMap,
    RzMapCluster,
    MapDrawingToolBar,
    RzMapDrawingTools
  }
})
export default class MapSelector extends Vue {
  @Prop() mapConfig!: any;

  @Prop() center!: [number, number];

  @Prop() zoom!: number;

  @Prop() data!: any;

  // 摄像头点位数据
  cameraData: any[] = [];
  leaves: any = {};

  /**
   * 地图点聚合子组件配置项
   */
  // 聚合标注配置
  clusteredConfig: any = {
    offset: {
      x: -40,
      y: -40
    },
    markerElement: {
      createElement: ClusterDrawingUtils.createClusterElement
    }
  };
  // 非聚合标注配置
  unclusteredConfig: any = {
    offset: {
      x: -15,
      y: -15
    },
    markerElement: {
      createElement: ClusterDrawingUtils.createUnclusterElement
    }
  };
  // 聚合算法配置
  clusterGenerationConfig: any = {
    minZoom: 3,
    maxZoom: 18,
    map: props => ({
      isSelected: props.isSelected
    }),
    reduce: (accumulated, props) => {
      accumulated.isSelected += props.isSelected;
    }
  };

  /**
   * 地图框选子组件配置项
   */
  mode: string = "rectangle";

  keepOverlay: boolean = true;

  drawingStyleOptions: any = {
    strokeColor: "#5a92f2", //边线颜色。
    fillColor: "#5a92f2", //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 2, //边线的宽度，以像素为单位。
    strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
    fillOpacity: 0.3, //填充的透明度，取值范围0 - 1。
    strokeStyle: "solid" //边线的样式，solid或dashed。
  };

  @Watch("data")
  handleDataChange() {
    const { leaves, result } = Broker.flatten(this.data);
    this.cameraData = result;
    this.leaves = leaves;
  }

  get selectNode() {
    return store.getters.getTreeSelectChangeNode;
  }

  get count(): number {
    return store.getters.getSelectedCount;
  }

  @Watch("selectNode")
  onSelectNodeChange() {
    const { select, node } = this.selectNode;

    if (node.length > 0) {
      // this.cameraData.forEach(camera => {
      //   node.forEach(sNode => {
      //     if (camera.properties.node.resourceSerial === sNode.resourceSerial) {
      //       camera.properties.isSelected = select;
      //     }
      //   });
      // });
      node.forEach(n => {
        const leaf = this.leaves[n.resourceSerial];
        if (leaf) {
          leaf.properties.isSelected = select;
        }
      });
      (this.$refs.clusterManager as any).clusterReload();
    }
  }

  setDrawingToolMode(mode) {
    this.mode = mode;
  }

  handleDrawingComplete(event) {
    const { selectedAreaData, type } = this._getAreaDataFromEvent(event);
    this._selectPoints(selectedAreaData, type, this.cameraData);
    (this.$refs.clusterManager as any).clusterReload();
  }

  private _getAreaDataFromEvent(event: any) {
    let type, selectedAreaData;
    if (event.circle) {
      selectedAreaData = event.circle;
      type = "circle";
    } else {
      selectedAreaData = event.polygon;
      type = event.polygon.type === "rectangle" ? "rectangle" : "polygon";
    }
    return {
      type,
      selectedAreaData
    };
  }

  private _isPointInSelectedArea(selectedAreaData, type, point) {
    let isSelected;
    const { bounds, path, center, radius } = selectedAreaData;
    switch (type) {
      case "rectangle":
        isSelected = MapCalculation.isPointInRectangle(point, bounds);
        break;
      case "polygon":
        isSelected = MapCalculation.isPointInPolygon(point, bounds, path);
        break;
      case "circle":
        isSelected = MapCalculation.isPointInCircle(point, center, radius);
        break;
    }
    return isSelected;
  }

  /**
   * @Param selectedAreaData 框选之后的区域数据
   * @Param type 框选的类型 rectangle | circle | polygon
   * @Param sourceData 全量的点位数据
   */
  private _selectPoints(selectedAreaData, type, sourceData) {
    if (!["rectangle", "polygon", "circle"].includes(type)) {
      throw new Error("[Razor Error] 框选类型错误");
    }
    const selectNode = [];
    sourceData.forEach(data => {
      if (!(data.properties && data.properties.isSelected)) {
        const preState = data.properties.isSelected;

        const point = data.geometry.coordinates;
        data.properties.isSelected = this._isPointInSelectedArea(
          selectedAreaData,
          type,
          point
        );

        if (preState !== data.properties.isSelected) {
          selectNode.push(data);
        }
      }
    });

    const select =
      selectNode.length > 0 ? selectNode[0].properties.isSelected : false;
    const node = selectNode.map(data => data.properties.node);
    const count = node.length;
    store.commit("setMapSelectChangeNode", { select, node });

    if (select) {
      store.commit("setSelectedCount", this.count + count);
    } else {
      store.commit("setSelectedCount", this.count - count);
    }
  }

  mounted() {
    // console.log('data', this.data);
  }
}
</script>