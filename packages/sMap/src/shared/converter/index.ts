import { CoordinatePoint, ConverteStrategy, ConverterFn } from "./interface";

import BD09toGCJ02 from "./strategies/bd09togcj02";
import GCJ02toBD09 from "./strategies/gcj02tobd09";
import GCJ02toWGS84 from "./strategies/gcj02towgs84";
import WGS84toGCJ02 from "./strategies/wgs84togcj02";

interface ConverterConfig {
  from: "BD09" | "GCJ02" | "WGS84";
  to: "BD09" | "GCJ02" | "WGS84";
  precision?: "m" | "dm" | "cm";
  converter?: ConverterFn;
}

const isFunction = (value: any): boolean =>
  toString.call(value) == "[object Function]";

const isArray = (value: any): boolean =>
  toString.call(value) == "[object Array]";

class Converter {
  config: ConverterConfig;

  constructor(config: ConverterConfig) {
    this.config = config;
  }

  private _getStrategy(): ConverteStrategy {
    const { from, to } = this.config;
    const strategyName = from + "to" + to;
    const unit = this.config.precision;
    switch (strategyName) {
      case "BD09toGCJ02":
        return new BD09toGCJ02(unit);
      case "GCJ02toBD09":
        return new GCJ02toBD09(unit);
      case "GCJ02toWGS84":
        return new GCJ02toWGS84(unit);
      case "WGS84toGCJ02":
        return new WGS84toGCJ02(unit);
      default:
        return new BD09toGCJ02(unit);
    }
  }

  convert(
    Point: CoordinatePoint | CoordinatePoint[]
  ): CoordinatePoint | CoordinatePoint[] {
    const strategy: ConverteStrategy = this._getStrategy();
    let converterFn: ConverterFn = strategy.doConvert;

    if (this.config.converter && isFunction(this.config.converter)) {
      converterFn = this.config.converter;
    }

    return isArray(Point)
      ? (Point as Array<CoordinatePoint>).map(converterFn)
      : converterFn(Point as CoordinatePoint);
  }
}

export default Converter;
