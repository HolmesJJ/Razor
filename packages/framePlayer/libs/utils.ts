export const numRangeRectify = {
  INSIDE: true,
  OUTSIDE: false
};

/**
 * 矫正数值，保证数值在区间内或者区间外
 * @param {Number} num  需要矫正的数据
 * @param {Number} start 区间起点
 * @param {Number} end 区间终点
 * @param {Boolean} inside 是否矫正在区间内 true 为区间内 false 为区间外
 */
export function rectifyNumRange(
  num: number,
  start: number,
  end: number,
  inside: boolean
) {
  let signal = inside ? 1 : -1;
  if ((num - start) * signal < 0) {
    return start;
  }
  if ((num - end) * signal > 0) {
    return end;
  }
  return num;
}

export const getRandomId = () => {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export function getInt(value: number) {
  return parseInt(value.toFixed(0));
}
