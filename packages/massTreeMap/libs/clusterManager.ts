import GeoJson from "./GeoJson";
import { flatten } from "./utils";

import MapCalculation from "./mapCalculation";
import { Bounds } from "pkg/sMap/src/types";
import mapCalculator from "./mapCalculation";

class ClusterManager {
  geoJson: GeoJson[] = [];
  points: any = {};

  async loadData(data) {
    try {
      const { points, geoJson } = flatten(data);
      this.points = points;
      this.geoJson = geoJson;
      return this;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getGeoJson() {
    return Object.freeze(this.geoJson);
  }

  getPointInBounds(bounds: Bounds) {
    const result = [];
    Object.keys(this.points).forEach(key => {
      const current: GeoJson = this.points[key];
      if (
        mapCalculator.isPointInRectangle(current.geometry.coordinates, bounds)
      ) {
        result.push(current);
      }
    });

    return result;
  }

  updateGeoJson(ids: string[], select: boolean) {
    ids.forEach(id => {
      const point = this.points[id];
      if (point) {
        point.properties.isSelected = select;
      }
    });
  }

  selectAll() {
    Object.keys(this.points).forEach(key => {
      this.points[key].properties.isSelected = true;
    });
  }

  setSelectedByArea(area, type) {
    if (!["rectangle", "polygon", "circle"].includes(type)) {
      throw new Error("[Razor Error] 框选类型错误");
    }

    const selectNode = [];
    const selectId = [];
    this.geoJson.forEach(data => {
      if (!(data.properties && data.properties.isSelected)) {
        const preState = data.properties.isSelected;

        const point = data.geometry.coordinates;
        data.properties.isSelected = this._isPointInSelectedArea(
          area,
          type,
          point
        );

        if (preState !== data.properties.isSelected) {
          selectNode.push(data);
          selectId.push(data.properties.node.resourceSerial);
        }
      }
    });

    const select =
      selectNode.length > 0 ? selectNode[0].properties.isSelected : false;

    const node = selectNode.map(data => data.properties.node);

    this.updateGeoJson(selectId, select);

    return {
      selectId,
      select,
      selectNode: node
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

  destroyCluster() {
    this.geoJson = [];
    this.points = {};
  }
}

export default ClusterManager;
