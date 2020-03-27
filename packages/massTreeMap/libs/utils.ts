import GeoJson from "./GeoJson";

export const flatten = (
  data
): {
  points: any;
  geoJson: any;
} => {
  let flattenedData = [];

  if (!(data && data.length > 0))
    return {
      geoJson: [],
      points: {}
    };

  const treeData = data[0]; // 如果有多个根节点怎么办？

  function _processTreeNode(node) {
    if (!node) return;

    if (node.leafNode) {
      flattenedData = flattenedData.concat(node.resources);
      return;
    } else {
      if (!(node.subTreeNodes && node.subTreeNodes.length > 0)) return;
      node.subTreeNodes.forEach(node => {
        _processTreeNode(node);
      });
    }
  }

  _processTreeNode(treeData);

  return conver2GeoJson(flattenedData);
};

export const conver2GeoJson = arr => {
  let points = {};
  const geoJson = arr.map(resource => {
    const data = new GeoJson(resource);
    points[resource.resourceSerial] = data;
    return data;
  });

  return {
    points,
    geoJson
  };
};
