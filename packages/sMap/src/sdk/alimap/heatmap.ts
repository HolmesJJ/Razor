import RazorMapHeatmap from "../_abstract/heatmap";
import { HeatmapConfig, HeatmapPoint } from "../../types/heatmap";

class AliMapHeatmap extends RazorMapHeatmap {
  constructor(map: any, config: HeatmapConfig) {
    super(map);
  }

  addHeatmap(data: HeatmapPoint[], max: number) {
    this.map.plugin(['IMAP.HeatmapOverlay'], () => {
      this.heatmap = new window.IMAP.HeatmapOverlay({ max, data });
      this.map.getOverlayLayer().addOverlay(this.heatmap);
    });
  }

  reload(data: HeatmapPoint[], max: number, config: HeatmapConfig) {
    data.length > 0
      && this.heatmap
      && this.heatmap.setData({ data, max, ...config });
  }

  setConfig(config: HeatmapConfig) {
    this.heatmap && this.heatmap.setData(config);
  }

  destroyHeatmap() {
    this.map.getOverlayLayer().removeOverlay(this.heatmap);
  }
}

export default AliMapHeatmap;
