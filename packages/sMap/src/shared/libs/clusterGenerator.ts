import SuperCluster from "supercluster";
import { ClusterRawPoints } from "../../types/cluster";
import { BBox } from "geojson";

// 本会在初始化的时候计算出给定的cluster数据
export default class ClusterGenerator {
  // 当前产生clusters的所有原始数据
  points!: ClusterRawPoints;
  // SuperCluster实例
  clusterer!: SuperCluster;
  // 当前产生的各zoom级别的cluster数据
  defaultClusterOpt: any = {
    radius: 360,
    maxZoom: 16,
    log: false
  };

  constructor(points: ClusterRawPoints, superClusterOptions?: any) {
    this.points = points;
    const opts = superClusterOptions
      ? Object.assign(this.defaultClusterOpt, superClusterOptions)
      : this.defaultClusterOpt;

    this.clusterer = new SuperCluster(opts);
    this.clusterer.load(this.points);
  }

  getClusters(bbox: BBox, zoom: number) {
    const result = this.clusterer.getClusters(bbox, zoom);
    return result;
  }

  getChildren(clusterId: number) {
    return this.clusterer.getChildren(clusterId);
  }

  getTitle(z: number, x: number, y: number) {
    return this.clusterer.getTile(z, x, y);
  }

  getLeaves(clusterId: number, limit: number = 10, offset: number = 0) {
    return this.clusterer.getLeaves(clusterId, limit, offset);
  }
}
