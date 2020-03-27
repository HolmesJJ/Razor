import RazorMapHeatmap from "../_abstract/heatmap";

import Heatmap from "bmaplib.heatmap";
import { HeatmapConfig, HeatmapPoint } from "../../types/heatmap";

class BaiduMapHeatmap extends RazorMapHeatmap {
  heatmap: Heatmap;

  constructor(map: any, config: HeatmapConfig) {
    super(map);
    this.heatmap = new Heatmap(config);
  }

  addHeatmap(data: HeatmapPoint[], max: number) {
    this.map.addOverlay(this.heatmap);
    this.heatmap.setDataSet({ data, max });
  }

  reload(data: HeatmapPoint[], max: number, config: HeatmapConfig) {
    if (this.heatmap) {
      this.destroyHeatmap();
    }

    this.heatmap = new Heatmap(config);
    this.map.addOverlay(this.heatmap);
    this.heatmap.setDataSet({ data, max });
  }

  setConfig(config: HeatmapConfig) {
    this.heatmap.setOptions(config);
  }

  destroyHeatmap() {
    this.map.removeOverlay(this.heatmap);
  }
}

export default BaiduMapHeatmap;
