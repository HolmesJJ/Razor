import { IVertex } from "rz/utils/canvas/layer.d";
export interface Rect {
  scale: number;
  widthScale: number;
  heightScale: number;
  vertexes: [IVertex, IVertex];
}
// 图片尺寸超过 容器尺寸
// 图片宽度比例大于高度比例
/**
 *  -----------------------
 * |                       |
 * |-----------------------|
 * |         img           |
 * |                       |
 * |-----------------------|
 * |                       |
 *  -----------------------
 *
 */
// const imageWidth = 1920;
// const imageHeight = 1080;
// const containerWidth = 840;
// const containerHeight = 540;
// const result = calculator(
//   imageWidth,
//   imageHeight,
//   containerWidth,
//   containerHeight
// );
// console.log(result);

// 图片尺寸超过 容器尺寸
// 图片高度比例大于宽度比例
/**
 *  --------------------
 * |   |           |   |
 * |   |           |   |
 * |   |   img     |   |
 * |   |           |   |
 * |   |           |   |
 * |   |           |   |
 *  --------------------
 *
 */
// const imageWidth = 1920;
// const imageHeight = 1080;
// const containerWidth = 980;
// const containerHeight = 540;
// const result = calculator(
//   imageWidth,
//   imageHeight,
//   containerWidth,
//   containerHeight
// );
// console.log(result);

// 图片尺寸长宽都小于容器尺寸长宽 也是两种情况
/**
 *  --------------------
 * |                   |
 * |   -------------   |
 * |   |   img     |   |
 * |   |           |   |
 * |   -------------   |
 * |                   |
 *  --------------------
 *          ||
 *          \/
 * 图片宽度比例大于高度比例
 *  -----------------------
 * |                       |
 * |-----------------------|
 * |         img           |
 * |                       |
 * |-----------------------|
 * |                       |
 *  -----------------------
 *
 * 图片高度比例大于宽度比例
 *    --------------------
 *   |   |           |   |
 *   |   |           |   |
 *   |   |   img     |   |
 *   |   |           |   |
 *   |   |           |   |
 *   |   |           |   |
 *    --------------------
 */

// const imageWidth = 1920;
// const imageHeight = 1080;
// const containerWidth = 960;
// const containerHeight = 270;
// const result = calculator(
//   imageWidth,
//   imageHeight,
//   containerWidth,
//   containerHeight
// );
// console.log(result);

export const calculator = (
  imageWidth,
  imageHeight,
  containerWidth,
  containerHeight
): Rect => {
  const vertexStart = {
    x: 0,
    y: 0
  };

  const vertexEnd = {
    x: containerWidth,
    y: containerHeight
  };

  const widthScale = imageWidth / containerWidth;
  const heightScale = imageHeight / containerHeight;

  // 图片的 长 > 容器的 长 或者 图片的 宽 > 容器的 宽
  // if (imageWidth >= containerWidth || imageHeight >= containerHeight) {
  // 看谁的比例大
  if (widthScale > heightScale) {
    // 绘画起点 从左边 坐标为0 开始
    // 横坐标不需要变
    // 计算出纵坐标
    // 容器的高 减去 图片的高缩小后的尺寸 除以二
    vertexStart.y = (containerHeight - imageHeight / widthScale) / 2;
    // 算出右下角的纵坐标 因为上下等距, 所以容器高减掉上面计算出来的数就知道右下角的纵坐标
    vertexEnd.y = containerHeight - vertexStart.y;
  } else {
    // 容器的宽 减去 图片的宽缩小后的尺寸 除以二
    vertexStart.x = (containerWidth - imageWidth / heightScale) / 2;
    // 算出右下角的横坐标 因为左右等距, 所以容器高减掉上面计算出来的数就知道右下角的横坐标
    vertexEnd.x = containerWidth - vertexStart.x;
  }

  const scale = Math.max(widthScale, heightScale);

  const rect: Rect = {
    scale,
    widthScale,
    heightScale,
    vertexes: [vertexStart, vertexEnd]
  };
  return rect;
};
