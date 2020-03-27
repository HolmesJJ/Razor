import * as Util from "./utils";

export interface Coordinate {
  x: number;
  y: number;
}

export interface Bounding {
  start: Coordinate;
  end: Coordinate;
}

export interface Size {
  width: number;
  height: number;
}

export interface Offset {
  top: number;
  left: number;
}

export interface Benchmark {
  type: "width" | "height";
  value: number;
}

class ScaleCalculator {
  containerSize!: Size;

  wrapperSize!: Size;

  constructor(container: Size, wrapper: Size) {
    this.containerSize = container;
    this.wrapperSize = wrapper;
  }

  get containerRatio(): number {
    return Util.getRatio(this.containerSize);
  }

  get wrapperRatio(): number {
    return Util.getRatio(this.wrapperSize);
  }

  getBenchmark(): Benchmark {
    const result: Benchmark = {
      type: "height",
      value: this.containerSize.height
    };

    if (this.containerRatio < this.wrapperRatio) {
      result.type = "width";
      result.value = this.containerSize.width;
    }

    return result;
  }

  getScaleValue(): number {
    let from = this.wrapperSize.height;
    let to = this.containerSize.height;

    if (this.getBenchmark().type === "width") {
      from = this.wrapperSize.width;
      to = this.containerSize.width;
    }

    return to / from;
  }
}

export default ScaleCalculator;
