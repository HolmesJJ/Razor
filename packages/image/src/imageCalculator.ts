// 坐标接口， 含 x坐标和y坐标
interface Coordinate {
  x: number;
  y: number;
}

// 边框
export interface Boundings {
  start: Coordinate;
  end: Coordinate;
}

// 图片大小
interface Size {
  width: number;
  height: number;
}

// 偏移量
interface Offset {
  top: number;
  left: number;
}

class ImageCalculator {
  wrapperSize: Size;
  boundings: Boundings;

  constructor(size: Size, boundings: Boundings) {
    this.wrapperSize = size;
    this.boundings = boundings;
  }

  // 获取中心点坐标
  getCenter(point: Boundings): Coordinate {
    const { start, end } = point;
    const x = (end.x + start.x) / 2;
    const y = (end.y + start.y) / 2;
    return { x, y };
  }

  // 获取人脸框中心点
  getBoundingCenter(): Coordinate {
    return this.getCenter(this.scaleBounding(this.boundings));
  }

  // 获取显示框中心点
  getWrapperCenter(): Coordinate {
    const start: Coordinate = { x: 0, y: 0 };
    const end: Coordinate = {
      x: this.wrapperSize.width,
      y: this.wrapperSize.height
    };
    return this.getCenter({ start, end });
  }

  // 获取偏移量
  getOffset(): Offset {
    const start = this.getWrapperCenter();
    const end = this.getBoundingCenter();

    return {
      top: start.y - end.y,
      left: start.x - end.x
    };
  }

  // 获取人脸框尺寸
  getBoundingSize(): Size {
    return {
      width: this.boundings.end.x - this.boundings.start.x,
      height: this.boundings.end.y - this.boundings.start.y
    };
  }

  // 按比例缩放
  scale(value: number): number {
    return value * this.getScaleValue();
  }

  // 对人脸框按比例缩放
  scaleBounding(boundings: Boundings): Boundings {
    const start = {
      x: this.scale(boundings.start.x),
      y: this.scale(boundings.start.y)
    };
    const end = {
      x: this.scale(boundings.end.x),
      y: this.scale(boundings.end.y)
    };
    return {
      start,
      end
    };
  }

  // 获取比例
  getRatio(size: Size): number {
    return size.width / size.height;
  }

  getWrapperRatio(): number {
    return this.getRatio(this.wrapperSize);
  }

  getBoundingRatio(): number {
    return this.getRatio(this.getBoundingSize());
  }

  // 获得缩放的比例
  getScaleValue() {
    const benchmark = this.getBenchmark();
    const currentValue = this.getBoundingSize()[benchmark.type];
    return benchmark.value / currentValue;
  }

  /**
   * 获取缩放标准
   * 默认以高来做标准，如果bounding的宽高比 > wrapper的宽高比，则用宽来做标准
   */
  getBenchmark() {
    const result = {
      type: "height",
      value: this.wrapperSize.height
    };

    const isWider: boolean = this.getBoundingRatio() > this.getWrapperRatio();

    if (isWider) {
      result.type = "width";
      result.value = this.wrapperSize.width;
    }

    return result;
  }
}

export default ImageCalculator;
