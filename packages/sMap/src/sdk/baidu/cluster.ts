import {
  ClusterGenerationOpt,
  ClusterRawPoints,
  CustomClusterMarker,
  ClusterOpt,
  ClusterMarkersOpt,
  Point
} from "../../types";
import RazorMapCluster from "../_abstract/cluster";
import ClusterGenerator from "../../shared/libs/clusterGenerator";
import BaiduCustomMarkerFactory from "./customMarker";
import { getPoint } from "./utils/unit";
import { debug } from "util";

export default class BaiduCluster extends RazorMapCluster {
  options!: ClusterOpt;

  clusterGenOpt!: ClusterGenerationOpt;

  generator!: ClusterGenerator | undefined;

  redrawHandler!: Function;

  // 聚合计算之后所有聚合以及非聚合点的数据
  clusters: any[] = [];

  // 用于绘制的所有marker的实例
  markers: any[] = [];

  timer!: any;

  defaultClusterGenOpt: ClusterGenerationOpt = {
    radius: 300,
    minZoom: 3,
    maxZoom: 16,
    log: false
  };

  defaultClusterMarkerOpt: CustomClusterMarker = {
    width: 20,
    height: 20,
    backgroundColor: "#fff",
    textStyle: {
      color: "#333",
      fontSize: "12px",
      position: "absolute",
      left: 0,
      top: 0
    }
  };

  constructor(mapInstance: any) {
    super(mapInstance);
  }

  load(
    points: ClusterRawPoints,
    options: ClusterOpt,
    clusterGenOpt: ClusterGenerationOpt
  ) {
    clusterGenOpt = Object.assign({}, this.defaultClusterGenOpt, clusterGenOpt);

    this.options = options;
    this.clusterGenOpt = clusterGenOpt;

    this.generator = new ClusterGenerator(points, clusterGenOpt);

    this.redrawHandler = this.conditionalDraw.bind(this);

    this.map.addEventListener("zoomend", this.redrawHandler);
    this.map.addEventListener("moveend", this.redrawHandler);

    this.redrawHandler();
  }

  destroy() {
    this._clearMarkers();
    this.clusters = [];
    this.markers = [];
    this.generator = undefined;
    this.map.removeEventListener("zoomend", this.redrawHandler);
    this.map.removeEventListener("moveend", this.redrawHandler);
  }

  conditionalDraw() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const currentZoom = this.map.getZoom();
      const { minZoom, maxZoom } = this.clusterGenOpt;

      if (currentZoom < minZoom || currentZoom > maxZoom) {
        if (this.markers && this.markers.length > 0) {
          this._clearMarkers();
        }
      } else {
        this._draw();
      }
    }, 300);
  }

  getCurrentCluster(point: Point) {
    let target = null;
    this.clusters.forEach(cluster => {
      // is cluster
      if (cluster.properties && cluster.properties.cluster) {
        const leaves = this.generator.getLeaves(
          cluster.properties.cluster_id,
          Infinity
        );
        leaves.forEach(l => {
          if (
            l.geometry.coordinates[0] === point[0] &&
            l.geometry.coordinates[1] === point[1]
          ) {
            target = cluster;
            return;
          }
        });
      } else {
        // is marker
        if (
          cluster.geometry.coordinates[0] === point[0] &&
          cluster.geometry.coordinates[1] === point[1]
        ) {
          target = cluster;
          return;
        }
      }
    });

    return target;
  }

  getClusters() {
    return this.clusters;
  }

  private _draw() {
    if (!this.generator) {
      return;
    }
    // 首先获取当前地图区域的cluster数据
    this.clusters = [];
    this.clusters = this._getClusters();
    // console.log('打印的cluster', this.clusters)
    // 清除已存在的marker
    this._clearMarkers();
    // 根据数据生成需要被绘制的marker instances
    const markers: any[] = [];
    const { options } = this;
    if (this.clusters && this.clusters.length > 0) {
      this.clusters.forEach(cluster => {
        // 经过clusterGenerator 之后有cluster标记的为cluster 其他为单点的marker
        if (cluster.properties && cluster.properties.cluster) {
          // create cluster marker
          markers.push(this._createMarker(cluster, options.clustered));
        } else {
          // create normal point marker
          markers.push(this._createMarker(cluster, options.unclustered));
        }
      });
    }
    markers.forEach(marker => {
      this.map.addOverlay(marker);
    });
    this.markers = markers;
  }

  private _getClusters(): any[] {
    const bbox = this._getBbox();
    const zoom = this.map.getZoom();
    if (!this.generator) throw new Error(`缺少cluster generator`);
    return this.generator.getClusters(bbox, zoom);
  }

  private _getBbox(): any {
    // [westLng, southLat, eastLng, northLat]
    const baiduBoundsAgent = this.map.getBounds();
    const sw = baiduBoundsAgent.getSouthWest();
    const ne = baiduBoundsAgent.getNorthEast();
    return [sw.lng, sw.lat, ne.lng, ne.lat];
  }

  private _clearMarkers() {
    this.markers.forEach(marker => {
      marker.destroy();
      this.map.removeOverlay(marker);
    });
    this.markers = [];
  }

  private _createMarker(data: any, options: ClusterMarkersOpt) {
    const center = data.geometry.coordinates;
    const { offset, listeners, markerElement } = options;
    let createdMarker, $el;

    try {
      // 如果有createElement函数那么使用createElement创造$el
      if (markerElement.createElement) {
        $el = markerElement.createElement(data);
        // console.log("custom $el", $el);
      } else {
        // 如果没有那么根据marker配置创造$el
        $el = this._createMarkerElement(data, markerElement);
      }
      createdMarker = BaiduCustomMarkerFactory(getPoint(center), $el, {
        offset,
        listeners,
        customData: data
      });
      // $el = null;
    } catch (e) {
      throw e;
    }
    return createdMarker;
  }

  private _createMarkerElement(data: any, options: CustomClusterMarker) {
    let $el;
    const markerOpt = Object.assign(this.defaultClusterMarkerOpt, options);
    const {
      width,
      height,
      icon,
      backgroundColor,
      borderRadius,
      opacity,
      textStyle
    } = markerOpt;
    // 先创造marker本体
    if (icon) {
      // 如果配置里面有icon img url
      let div = document.createElement("div");
      const style = {
        position: "absolute",
        cursor: "pointer",
        borderRadius
      };
      Object.assign(div.style, style);
      // create img element
      let img = new Image();
      img.src = icon;
      Object.assign(img.style, {
        width: `${width}px`,
        height: `${height}px`
      });
      div.appendChild(img);
    } else {
      $el = document.createElement("div");
      const style = {
        position: "absolute",
        cursor: "pointer",
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor,
        borderRadius,
        opacity
      };
      Object.assign($el.style, style);
    }
    // 如果这个标注是cluster， 那么标上cluster的聚合数字
    if (data && data.properties) {
      const { cluster, point_count } = data.properties;
      if (cluster) {
        const span = document.createElement("span");
        span.innerText = point_count;
        Object.assign(span.style, textStyle);
        $el.appendChild(span);
      }
    }
    return $el;
  }
}
