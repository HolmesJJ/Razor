// todo 国际化
export const labelConfig = {
  play: "播放",
  pause: "暂停",
  zoom: "缩放",
  download: "下载",
  fullscreen: "全屏",
  cut: "裁剪",
  image: "图片",
  video: "视频",
  pre: "上一张",
  next: "下一张",
  faceRect: "人脸检测",
  bodyRect: "人体检测"
};

export const numRangeRectify = {
  INSIDE: true,
  OUTSIDE: false
};
// export function swallowEvent (ev: Event) {
//     ev.stopPropagation();
//     ev.preventDefault();
// }
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
