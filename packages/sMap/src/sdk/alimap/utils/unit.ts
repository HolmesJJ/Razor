
const WIN_ROOT = window as any;

/**
 * 经纬度转换
 * @param point 
 */
export const transformLngLat = (point: any) => {
  let [x, y] = point;
  x = x || point.lng;
  y = y || point.lat;
  return new WIN_ROOT.IMAP.LngLat(x, y);
};

export const getPoint = (point: any) => {
  return transformLngLat(point);
};

export const getSize = (x: number, y: number) => {
  return new WIN_ROOT.IMAP.Size(x, y);
};