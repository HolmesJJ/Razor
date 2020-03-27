<template>
  <div class="rz-tree-map__map-wrapper">
    <map-toolbar v-show="editable" :initialMode="mode" @change="setDrawingToolMode"></map-toolbar>
    <rz-s-map
      ref="map"
      :center="center"
      :zoom="zoom"
      :config="mapConfig"
      @moveend="handleMoveend"
      @movestart="handleMoveStart"
      @zoomstart="handleMoveStart"
      @zoomend="handleZoomEnd"
      @dragend="handleDragEnd"
    >
      <rz-map-cluster
        v-if="geoJson && showCluster && !loadingData"
        ref="cluster"
        :points="geoJson"
        :clusteredConfig="clusteredConfig"
        :unclusteredConfig="unclusteredConfig"
        :clusterGenerationConfig="clusterGenerationConfig"
      ></rz-map-cluster>

      <rz-map-marker
        v-else-if="showCamera && !loadingData"
        v-for="marker in _displayCamera"
        :key="marker.properties.node.name"
        :position="marker.geometry.coordinates"
        :offset="{ x: -20, y: -20 }"
      >
        <map-icon
          :camera="marker.properties.node"
          :clickedCameraSerial="clickedCameraSerial"
          :isSelected="marker.properties.isSelected"
          :content="marker.properties.node.name"
        ></map-icon>
      </rz-map-marker>

      <rz-map-drawing-tools
        :mode="mode"
        :keepOverlay="keepOverlay"
        :styleOptions="drawingStyleOptions"
        @drawing-complete="handleDrawingComplete"
      ></rz-map-drawing-tools>
    </rz-s-map>

    <rz-map-tool @reset="setMapViewport" @zoom-in="handleMapZoomin" @zoom-out="handleMapZoomout"></rz-map-tool>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

// components
import MapToolbar from "./MapToolbar.vue";
import RzSMap from "pkg/sMap";
import RzMapCluster from "pkg/mapCluster";
import RzMarker from "pkg/mapMarker";
import RzMapDrawingTools from "pkg/mapDrawingTools";
import MapIcon from "./Icon.vue";
import RzMapTool from "pkg/mapTool";

// utils
import ClusterDrawingUtils from "../service/clusterDrawingUtils";

import ClusterManager from "../libs/clusterManager";

import store from "../service/store";

import { Bounds } from "pkg/sMap/src/types/point";
import GeoJson from "../libs/GeoJson";
import isEqual from "lodash/isEqual";

@Component({
  name: "MapSelector",
  components: {
    MapToolbar,
    RzMarker,
    RzSMap,
    RzMapCluster,
    RzMapDrawingTools,
    MapIcon,
    RzMapTool
  },
  provide() {
    return {
      clusterManager: new ClusterManager()
    };
  }
})
export default class MapSelector extends Vue {
  readonly _provided: { clusterManager: ClusterManager };

  @Prop() mapConfig!: any;

  @Prop() center!: [number, number];

  @Prop() zoom!: number;

  @Prop({ default: false }) selectAll: boolean;

  @Prop(String) clickedNodeSerial: string;

  @Prop({ default: true }) showToolbar: boolean;

  @Prop({
    type: Boolean,
    default: true
  })
  editable: boolean;

  mode: string = "hander";

  keepOverlay: boolean = false;

  // 摄像头点位数据
  geoJson: any = [];

  leaves: any = {};

  refMap: any;

  showCluster: boolean = false;

  clickedCameraSerial: string = "";

  get showCamera(): boolean {
    return !this.showCluster;
  }

  bounds: Bounds | any = {};

  displayCamera: GeoJson[] = [];

  initial: boolean = true;

  loadingData: boolean = true;

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

  drawingStyleOptions: any = {
    strokeColor: "#5a92f2", //边线颜色。
    fillColor: "#5a92f2", //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 2, //边线的宽度，以像素为单位。
    strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
    fillOpacity: 0.3, //填充的透明度，取值范围0 - 1。
    strokeStyle: "solid" //边线的样式，solid或dashed。
  };

  get count(): number {
    return store.getters.getSelectedCount;
  }

  async loadData(data) {
    this.loadingData = true;
    try {
      await this._provided.clusterManager.loadData(data);

      if (this.selectAll) {
        this._provided.clusterManager.selectAll();
      }

      (this.$refs.map as any).getMap(() => {
        this.setMapViewport().then(() => {
          this.onZoomChange(this.zoom);
          this.loadingData = false;
        });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @Watch("zoom")
  onZoomChange(val: number) {
    if (val >= 17) {
      this.showCluster = false;
      const bounds = this.refMap && this.refMap.getBounds();
      this.getCameraInViewpoint(bounds);
    } else {
      this.showCluster = true;
    }
  }

  @Watch("center")
  onCenterChange() {
    if (this.zoom >= 17) {
      const bounds = this.refMap && this.refMap.getBounds();
      this.getCameraInViewpoint(bounds);
    }
  }

  handleMapReady(event) {
    this.bounds = event.bounds;
  }

  setDrawingToolMode(mode) {
    if (mode === "clear") {
      // 删除框选
      this.$emit("clear-select");
      // this.mode = "hander";
      this.mode = "clear";
    } else {
      this.mode = mode;
    }
  }

  setViewport(points: [number, number][]) {
    this.refMap.setViewport(points);
  }

  updateCluster(ids: string[], select: boolean) {
    this._provided.clusterManager.updateGeoJson(ids, select);
    this.geoJson = this._provided.clusterManager.getGeoJson();
    if (this.showCluster && !this.loadingData) {
      this.$nextTick(() => {
        (this.$refs.cluster as any).clusterReload();
      });
    }
  }

  clearCluster() {
    const ids = this._provided.clusterManager
      .getGeoJson()
      .map(g => g.properties.node.resourceSerial);
    this.updateCluster(ids, false);
  }

  handleMoveend(event) {
    // console.log("map move end");
    this.$nextTick(() => {
      if (this.showCamera) {
        this.bounds = event.bounds;
        this.getCameraInViewpoint(this.bounds);
        if (this.initial) {
          this.clickedCameraSerial = this.clickedNodeSerial;
          this.initial = false;
        }
      }
    });
  }

  handleMoveStart(event) {
    this.clickedCameraSerial = "";
  }

  handleZoomEnd(event) {
    const zoomValue = event.zoom;
    this.$emit("zoomend", zoomValue);
    this.onZoomChange(zoomValue);
  }

  handleDragEnd(event) {
    if (this.showCamera) {
      this.bounds = event.bounds;
      this.getCameraInViewpoint(this.bounds);
    }
  }

  get _displayCamera() {
    // 只显示在当前范围内的marker
    const result = this.displayCamera.filter(point => {
      const [lng, lat] = point.geometry.coordinates;
      const flag = (this.$refs.map as any).containsPoint({ lng, lat });
      return flag;
    });
    return result;
  }

  timer = null;
  getCameraInViewpoint(bounds: Bounds) {
    // 尝试优化加载，一次性加载太多的话，有可能渲染不出
    // this.displayCamera = this._provided.clusterManager.getPointInBounds(bounds);
    // zoom 或者 center 可能需要一定时间, 延迟加载300ms
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const _bounds = (this.$refs.map as any).getBounds();
      this.bounds = _bounds;
      // 赋值后_displayCamera 的computed 会生效
      this.displayCamera = this._provided.clusterManager.getPointInBounds(
        _bounds
      );
    }, 500);
  }

  handleDrawingComplete(event) {
    const { selectedAreaData, type } = this.getAreaDataFromEvent(event);
    const {
      select,
      selectId,
      selectNode
    } = this._provided.clusterManager.setSelectedByArea(selectedAreaData, type);
    const count = selectId.length;

    if (select) {
      store.commit("setSelectedCount", this.count + count);
    } else {
      store.commit("setSelectedCount", this.count - count);
    }

    this.$emit("select-change", {
      selectId,
      select,
      selectNode
    });

    this.geoJson = this._provided.clusterManager.getGeoJson();

    if (this.showCluster) {
      (this.$refs.cluster as any).clusterReload();
    }
  }

  getAreaDataFromEvent(event: any) {
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

  setMapViewport() {
    this.geoJson = this._provided.clusterManager.getGeoJson();
    const points = this.geoJson.map(geo => geo.geometry.coordinates);
    return this.refMap.setViewport(points);
  }

  handleMapZoomin() {
    this.$emit("map-zoom-in");
  }

  handleMapZoomout() {
    this.$emit("map-zoom-out");
  }

  destroyCluster() {
    if (this.showCluster) {
      (this.$refs.cluster as any).destroyCluster();
    }
    this._provided.clusterManager.destroyCluster();
    this.geoJson = [];
  }

  clearOverlays() {
    this.refMap && this.refMap.clearOverlays();
  }

  destroyMap() {
    this.clickedCameraSerial = "";
    this.showCluster = false;
    this.loadingData = true;
    this.destroyCluster();
    this.clearOverlays();
  }

  mounted() {
    this.refMap = this.$refs.map;
    this.$on("show-tooltip", () => {
      this.initial = true;
    });
  }
}
</script>