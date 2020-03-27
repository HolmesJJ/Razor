import uniqBy from 'lodash/uniqBy';

/**
 * 计算首次出现点和最后出现点
 * @param { Array }
 */
function computeFirstLastPoint (points) {
  let firstIndex = 0;
  let lastIndex = 0;
  let firstTime = points[0].time;
  let lastTime = 0;
  points.forEach((point, index) => {
    point.images.forEach((image) => {
      if (firstTime > image.time) {
        firstTime = image.time;
        firstIndex = index;
      }
      if (lastTime < image.time) {
        lastTime = image.time;
        lastIndex = index;
      }

    });
  });

  return { firstIndex, lastIndex };
}

/**
 * 将一个字符串转换成随机HASH
 * @param { String }
 * @return { String } 随机数
 */
function stringToHash (str) {
  let hash = 0,
    i,
    char,
    l;
  if (str == 0) return hash;
  for (i = 0, l = str.length; i < l; i++) {
    char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

/**
 * 计算points中frequency最大值以及对应的index
 */
function computeMaxFqy (point, i, points, indexsOfMostFqy, mostFqy) {
  point.isMost = false;
  point.isFirst = false;
  point.isLast = false;
  points.push(point);
  if (point.frequency > mostFqy) {
    indexsOfMostFqy.length = 0;
    indexsOfMostFqy.push(i);
    return point.frequency;
  }
  if (point.frequency === mostFqy) {
    indexsOfMostFqy.push(i);
    return point.frequency;
  }
  return mostFqy;
}

/**
 * 地图撒点
 */
export function mapMarkers (markers) {
  const markerPoints = JSON.parse(JSON.stringify(markers).toLowerCase());
  return markerPoints.filter(item => {
    return !!Number(item.longitude) && !!Number(item.latitude);
  })
}

/**
 * 区域框选
 */
export function mapAreas (features) {
  const arr = []
  features.forEach(item => {
    arr.push({
      list: item.geometry.coordinates[0],
      name: item.properties.name,
      cp: item.properties.cp
    })
  })
  return arr;
}

/**
 * 地图轨迹数据转换
 * @param { Object }
 * @return { Array }
 */
export function transformLocuses (data) {
  const { data: group } = data;

  const groupList = group.list.map((result, index) => {
    return {
      ...result,
      imageUrl: result.imageUrl,
      imageSerial: result.imageSerial,
      serial: result.objectId,
      time: result.captureTime,
      match: result.match,
      videoName: result.videoName,
      captureTime: result.time,
      bigImageUrl:  result.bigImageUrl,

    };
  });

  return {
    groups: [
      {
        ...group,
        list: groupList || [],
      },
    ],
  };
}

/**
 * 地图点位信息转换
 * @param { Object } 经纬度信息
 * @return { Array } 返回一个包含经纬度的数组
 */
export function transformPoints (data) {
  const { data: { list } } = data;
  return list.map(item => {
    const { latitude, longitude } = item;
    return { latitude, longitude }
  })
}

/**
 * 计算点位顺序并按时间升序排列
 * @param { Array } 点位数组
 * @return { Array } 排序后的数组
 */
export function calculateFrequency (points) {
  if (!points.length) return [];

  // 按照时间升序排列
  const sortedPoints = points.sort((prev, next) => {
    return prev.time - next.time;
  });

  const _points = sortedPoints.reduce((acc, current) => {
    // TODO后期可以优化具体cur的属性，现有的实现方式属性有点冗余
    const cur = { ...current };
    // if (cur.longitude && cur.latitude) {
    const id = stringToHash(
      String(cur.longitude) + String(cur.latitude)
    );

    // 将前面出现的所有id相同的点位信息更新，并且保持一致
    let count = 1;
    let images = [current];
    acc.forEach(item => {
      if (item.id === id) {
        item.frequency += 1;
        item.images.push(current);
        count = item.frequency;
        images = [...item.images];
      }
    });

    // 修改当前节点信息
    cur.frequency = count;
    cur.images = images;
    acc.push({
      ...cur,
      id,
      location: {
        x: cur.longitude,
        y: cur.latitude,
      },
    });
    return acc;
  }, []);
  return _points;
}

/**
 * 计算轨迹包含的marker点
 * @param { Array } 轨迹对应的线段map， key为前后两点id，value为两点信息
 */
export function computeMarkerPoints (pointsMap) {
  let i = 0;
  let points = [];
  let mostFqy = 0;
  const indexsOfMostFqy = [];
  for (const key in pointsMap) {
    // 第一条轨迹，需要渲染首尾节点的marker, 其余轨迹只渲染尾节点的marker
    if (i === 0) {
      mostFqy = computeMaxFqy(pointsMap[key].start, i, points, indexsOfMostFqy, mostFqy);
    }
    i += 1;
    mostFqy = computeMaxFqy(pointsMap[key].end, i, points, indexsOfMostFqy, mostFqy);
  }
  if (!points.length) {
    return [];
  }

  // 标志frequency最大的点
  indexsOfMostFqy.forEach(index => points[index].isMost = true);
  points = uniqBy(points, 'id');

  // 标志首尾节点
  const { firstIndex, lastIndex } = computeFirstLastPoint(points);
  points[firstIndex].isFirst = true;
  points[lastIndex].isLast = true;

  return points;
}

/**
 * 时间复杂度o(n)
 * @param { Array }
 */
export function computeHoveringLine (points) {
  // pointsMap的key为首尾两点id组成的字符串，如'a-b','b-c',value为两点之间的绘制信息

  // points为空， 返回null
  const length = points.length;
  if (length === 0) {
    return null;
  }

  const pointsMap = {};
  let count = 0;
  // 完善pointsMap, 计算哪些线段是徘徊线段
  for (let i = 0, len = points.length - 1; i < len; i = i + 1) {
    const start = points[i];
    const end = points[i + 1];

    // 起点和终点是相同的点，
    if (start.id === end.id) {
      continue;
    }
    const newKey = start.id + '-' + end.id;
    const reverseKey = end.id + '-' + start.id;
    if (newKey in pointsMap) {
      continue;
    } else if (reverseKey in pointsMap) {
      pointsMap[reverseKey].type = 'hovering';
    } else {
      pointsMap[newKey] = { start, end, type: 'line' };
      count += 1;
    }
  }

  // 所有图片都来自同一抓拍机或者只有一个点
  if (!count) {
    const key = points[0].id + '-' + points[0].id;
    pointsMap[key] = { type: 'line', start: points[0], end: points[0] };
  }

  return pointsMap;
}
