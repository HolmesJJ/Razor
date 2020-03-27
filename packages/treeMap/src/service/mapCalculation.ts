const EARTH_RADIUS = 6370996.81; // 地球半径，单位米

// 把 { lng, lat } 或者 [lng, lat] 的点都换转换成 { lng, lat }的形式
const normalizePoint = (point) => {
  if (toString.call(point) === '[object Array]') {
    const [lng, lat] = point;
    point = { lng, lat };
  }
  return point;
} 

const isPointInRectangle = (point, bounds) => {
  point = normalizePoint(point);
  const { sw, ne } = bounds;
  const { lng, lat } = point;
  return (lng >= sw.lng && lng <= ne.lng && lat >= sw.lat && lat <= ne.lat);
}

const isPointInPolygon = (point, bounds, path) => {
  point = normalizePoint(point);
  // 首先判断点是否在包含多边形的bound内
  if (!isPointInRectangle(point, bounds)) {
    return false;
  } else {
    const N = path.length;
    const boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
    let intersectCount = 0; //cross points count of x 
    const precision = 2e-10; //浮点类型计算时候与0比较时候的容差
    let p1, p2; //neighbour bound vertices
    let p = point; //测试点

    p1 = path[0];

    for (var i = 1; i <= N; ++i){ //check all rays
      if (JSON.stringify(p) === JSON.stringify(p1)){
        return boundOrVertex; //p is an vertex
      }
      p2 = path[i % N];//right vertex      
      if (p.lat < Math.min(p1.lat, p2.lat) || p.lat > Math.max(p1.lat, p2.lat)){ //ray is outside of our interests                
        p1 = p2; 
        continue;//next ray left point
      }
      
      if(p.lat > Math.min(p1.lat, p2.lat) && p.lat < Math.max(p1.lat, p2.lat)){ //ray is crossing over by the algorithm (common part of)
        if(p.lng <= Math.max(p1.lng, p2.lng)){  //x is before of ray                    
          if(p1.lat == p2.lat && p.lng >= Math.min(p1.lng, p2.lng)){ //overlies on a horizontal ray
              return boundOrVertex;
          }

          if(p1.lng == p2.lng){ // ray is vertical                        
            if(p1.lng == p.lng){ // overlies on a vertical ray
              return boundOrVertex;
            }else{ // before ray
                ++intersectCount;
            } 
          }else{ // cross point on the left side                        
            const xinters = (p.lat - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat) + p1.lng; //cross point of lng                        
            if(Math.abs(p.lng - xinters) < precision){//overlies on a ray
              return boundOrVertex;
            }

            if(p.lng < xinters){ // before ray
              ++intersectCount;
            } 
          }
        }
      } else {//special case when ray is crossing through the vertex                
        if(p.lat == p2.lat && p.lng <= p2.lng){//p crossing over p2                    
            let p3 = path[(i+1) % N]; //next vertex                    
            if(p.lat >= Math.min(p1.lat, p3.lat) && p.lat <= Math.max(p1.lat, p3.lat)){//p.lat lies between p1.lat & p3.lat
              ++intersectCount;
            }else{
              intersectCount += 2;
            }
        }
      }  
      p1 = p2;//next ray left point
    }

    if(intersectCount % 2 == 0){ //偶数在多边形外
        return false;
    } else { //奇数在多边形内
        return true;
    }
  }
}

const isPointInCircle = (point, center, radius) => {
  point = normalizePoint(point);
  center = normalizePoint(center);
  const distance = _calDistance(point, center);

  return distance <= radius;
}

const _calDistance = (start, end) => {
  start = normalizePoint(start);
  end = normalizePoint(end);
  return EARTH_RADIUS * Math.acos(Math.cos(start.lat * Math.PI /180) * Math.cos(end.lat * Math.PI / 180) * Math.cos(start.lng * Math.PI / 180 - end.lng * Math.PI / 180)
    + Math.sin(start.lat * Math.PI / 180) * Math.sin(end.lat * Math.PI / 180));
}

export default {
  isPointInRectangle,
  isPointInPolygon,
  isPointInCircle
}