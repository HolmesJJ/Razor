export const getCenter = (points: any) => {
  let sumX = 0;
  let sumY = 0;
  let sumArea = 0;
  let p1 = points[1];
  for (let i = 2; i < points.length; i = i + 1) {
    const p2 = points[i];
    const area = getArea(points[0], p1, p2);
    sumArea += area;
    sumX += (points[0].x + p1.x + p2.x) * area;
    sumY += (points[0].y + p1.y + p2.y) * area;
    p1 = p2;
  }
  const xx = sumX / sumArea / 3;
  const yy = sumY / sumArea / 3;
  return {
    x: xx,
    y: yy,
  };
};

function getArea(p0, p1, p2) {
  const area =
    p0.x * p1.y +
    p1.x * p2.y +
    p2.x * p0.y -
    p1.x * p0.y -
    p2.x * p1.y -
    p0.x * p2.y;
  return area / 2;
}