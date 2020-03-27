export interface Size {
  width: number;
  height: number;
}

interface Coordinate {
  x: number;
  y: number;
}

// 边框
export interface Boundings {
  start: Coordinate;
  end: Coordinate;
}

export const getRatio = (size: Size) => {
  return size.width / size.height;
};

export const getBenchmark = (
  wrapperSize: Size,
  outerSize: Size
): { type: "width" | "height"; value: number } => {
  const result: { type: "width" | "height"; value: number } = {
    type: "height",
    value: wrapperSize.height
  };

  const isWider = getRatio(wrapperSize) > getRatio(outerSize);

  if (isWider) {
    result.type = "width";
    result.value = wrapperSize.width;
  }

  return result;
};

export const getScaleValue = (
  wrapperSize: Size,
  benchmark: { type: "width" | "height"; value: number }
) => {
  // 对象 / 比较标准
  return wrapperSize[benchmark.type] / benchmark.value;
};

export const getBoundingSize = (boundings: Boundings): Size => {
  return {
    width: boundings.end.x - boundings.start.x,
    height: boundings.end.y - boundings.start.y
  };
};
