import RazorMap from "./_abstract/map";
import { RazorMapConfig } from "../types";

import BaiduMap from "./baidu/map";
import BaiduMapMarker from "./baidu/marker";
import BaiduPolyline from "./baidu/polyline";
import BaiduCircle from "./baidu/circle";
import BaiduPolygon from "./baidu/polygon";
import BaiduCluster from "./baidu/cluster";
import BaiduDrawingManager from "./baidu/drawingManager";
import BaiduCanvasLayerFactory from "./baidu/canvasLayer";
import BaiduHeatmap from "./baidu/heatmap";

import AliMap from "./alimap/map";
import AliMapMarker from "./alimap/marker";
import AliMapPolyline from "./alimap/polyline";
import AliMapPolygon from "./alimap/polygon";
import AliMapCircle from "./alimap/circle";
import AliMapHeatmap from "./alimap/heatmap";
import AliMapCluster from "./alimap/cluster";
import AliMapDrawingManager from "./alimap/drawingManager";

import MineMap from "./minemap/map";
import MineMapCluster from "./minemap/cluster";
import { HeatmapConfig } from "../types/heatmap";

class MapFactory {
  static async createMap(config: RazorMapConfig): Promise<RazorMap> {
    switch (config.type) {
      case "baidu":
        return new BaiduMap(config.content);
      case "alimap":
        return new AliMap(config);
      case "minemap":
        return new MineMap(config.content);
      default:
        return new BaiduMap(config.content);
    }
  }

  static async createMarker(type: string, map: any) {
    switch (type) {
      case "baidu":
        return new BaiduMapMarker(map);
      case "alimap":
        return new AliMapMarker(map);
      default:
        return new BaiduMapMarker(map);
    }
  }

  static async createPolyline(type: string, map: any) {
    switch (type) {
      case "baidu":
        return new BaiduPolyline(map);
      case "alimap":
        return new AliMapPolyline(map);
      default:
        return new BaiduPolyline(map);
    }
  }

  static async createCircle(type: string, map: any) {
    switch (type) {
      case "baidu":
        return new BaiduCircle(map);
      case "alimap":
        return new AliMapCircle(map);
      default:
        return new BaiduCircle(map);
    }
  }

  static async createPolygon(type: string, map: any) {
    switch (type) {
      case "baidu":
        return new BaiduPolygon(map);
      case "alimap":
        return new AliMapPolygon(map);
      default:
        return new BaiduPolygon(map);
    }
  }

  static async createCluster(type: string, map: any) {
    switch (type) {
      case "baidu":
        return new BaiduCluster(map);
      case "alimap":
        return new AliMapCluster(map);
      case "minemap":
        return new MineMapCluster(map);
      default:
        return new BaiduCluster(map);
    }
  }

  static async createDrawingManager(type: string, map: any) {
    switch (type) {
      case "baidu":
        return new BaiduDrawingManager(map);
      case "alimap":
        const aliMapManager = new AliMapDrawingManager(map);
        await aliMapManager.initTool();
        return aliMapManager;
      default:
        return new BaiduDrawingManager(map);
    }
  }

  static async createCanvasLayer(type: string, map: any, options = {}) {
    switch (type) {
      case "baidu":
        return BaiduCanvasLayerFactory(map, options);
      default:
        return BaiduCanvasLayerFactory(map, options);
    }
  }

  static async createHeatmap(type: string, map: any, config: HeatmapConfig) {
    switch (type) {
      case "baidu":
        return new BaiduHeatmap(map, config);
      case "alimap":
        return new AliMapHeatmap(map, config);
      default:
        return new BaiduHeatmap(map, config);
    }
  }
}

export default MapFactory;
