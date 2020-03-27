import { CoordinatePoint, ConverteStrategy } from "../interface";
import { X_PI } from "../constant";
import { toFixed } from "../utils";

class BD09toGCJ02 extends ConverteStrategy {
  /**
   * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
   * 即 百度 转 谷歌、高德
   * @param Point: {lng, lat}
   * @returns Point: {lng, lat}
   */
  doConvert(Point: CoordinatePoint): CoordinatePoint {
    const { lng, lat } = Point;
    const x = lng - 0.0065;
    const y = lat - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
    const gg_lng = z * Math.cos(theta);
    const gg_lat = z * Math.sin(theta);
    return {
      lng: toFixed(gg_lng, this.precision),
      lat: toFixed(gg_lat, this.precision)
    };
  }
}

export default BD09toGCJ02;
