import { ClusterGenerationOpt } from "../../types";

export default abstract class RazorMapCluster {
  map: any;

  constructor(mapInstance: any) {
    this.map = mapInstance;
  }

  abstract load(points: any[], options: any, clusterGenOpt: ClusterGenerationOpt): void;
}