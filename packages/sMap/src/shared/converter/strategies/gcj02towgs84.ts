import { CoordinatePoint, ConverteStrategy } from "../interface";
import { a, ee, PI } from "../constant";
import { outOfChina, transformLat, transformLng, toFixed } from "../utils";

class GCJ02toWGS84 extends ConverteStrategy {
  /**
   * GCj02 转 WGS84
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

    let dlat = transformLat(lng - 105.0, lat - 35.0);
    let dlng = transformLng(lng - 105.0, lat - 35.0);
    const radlat = (lat / 180.0) * PI;
    let magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    const sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
    const mglat = lat + dlat;
    const mglng = lng + dlng;
    return {
      lng: toFixed(mglng, this.precision),
      lat: toFixed(mglat, this.precision)
    };
  }
}

export default GCJ02toWGS84;
