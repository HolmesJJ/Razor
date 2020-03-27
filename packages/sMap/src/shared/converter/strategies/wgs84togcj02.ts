import { CoordinatePoint, ConverteStrategy } from "../interface";
import { ee, PI } from "../constant";
import { outOfChina, transformLat, transformLng, toFixed } from "../utils";

class WGS84toGCJ02 extends ConverteStrategy {
  /**
   * WGS84转GCj02
   * @param Point: {lng, lat}
   * @returns Point: {lng, lat}
   */
  doConvert(Point: CoordinatePoint): CoordinatePoint {
    const { lng, lat } = Point;
    // 如果在国外则不偏移
    if (outOfChina(lng, lat)) {
      return {
        lng,
        lat
      };
    }

    const dLat = transformLat(lng - 105.0, lat - 35.0);
    const dLng = transformLng(lng - 105.0, lat - 35.0);
    const radLat = (lat / 180.0) * PI;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    const mgLat = lat + dLat;
    const mgLng = lng + dLng;
    return {
      lng: toFixed(mgLng, this.precision),
      lat: toFixed(mgLat, this.precision)
    };
  }
}

export default WGS84toGCJ02;
