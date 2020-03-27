import { HeatmapPoint, HeatmapConfig } from "../../types/heatmap";

abstract class RazorMapHeatmap {
  map: any;

  heatmap: any;

  constructor(map: any) {
    this.map = map;
  }

  getHeatmap() {
    return this.heatmap;
  }

  abstract addHeatmap(data: HeatmapPoint[], max: number): void;

  abstract reload(
    data: HeatmapPoint[],
    max: number,
    config: HeatmapConfig
  ): void;

  abstract setConfig(config: HeatmapConfig): void;

  abstract destroyHeatmap(): void;
}

export default RazorMapHeatmap;
