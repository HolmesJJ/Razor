import { CoordinatePoint, ConverteStrategy } from "../interface";
import { X_PI } from "../constant";
import { toFixed } from "../utils";

class GCJ02toBD09 extends ConverteStrategy {
  /**
   * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
   * 即谷歌、高德 转 百度
   * @param Point: {lng, lat}
   * @returns Point: {lng, lat}
   */
  doConvert(Point: CoordinatePoint): CoordinatePoint {
    const { lng, lat } = Point;

    const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * X_PI);
    const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * X_PI);
    const bd_lng = z * Math.cos(theta) + 0.0065;
    const bd_lat = z * Math.sin(theta) + 0.006;
    return {
      lng: toFixed(bd_lng, this.precision),
      lat: toFixed(bd_lat, this.precision)
    };
  }
}

export default GCJ02toBD09;
