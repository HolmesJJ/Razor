import TreeNode from "../../../bigDataTree/libs/tree-node";

enum SelectType {
  some = 1,
  allGroup = 2,
  allTree = 99
}

class RequestData {
  cameraSerials?: string[];
  groupSerial: string;
  selectType: SelectType;
  constructor(
    groupSerial: string,
    selectType: SelectType,
    cameraSerials?: string[]
  ) {
    this.groupSerial = groupSerial;
    this.selectType = selectType;
    if (cameraSerials && cameraSerials.length > 0) {
      this.cameraSerials = cameraSerials;
    }
  }
}

class GeoJsonObject {
  type: string;
  properties: any;
  geometry: any;
  constructor(resource) {
    this.type = "feature";
    this.properties = {
      isSelected: false,
      node: Object.freeze(JSON.parse(JSON.stringify(resource)))
    };
    this.geometry = Object.freeze({
      type: "Point",
      coordinates: [resource.longitude, resource.latitude]
    });
  }
}

const ummarshall = (data: TreeNode[]) => {
  const result = [];

  const roots: TreeNode[] = data.filter(node => node.isRoot);
  const nodes: TreeNode[] = data.filter(
    node =>
      node.isNode &&
      node.children.some(child => child.isLeaf && child.isSelected)
  );

  roots.forEach(root => {
    // select all tree
    if (root.isSelected && !root.isIndeterminate) {
      const groupSerial = root.customData.groupSerial;
      const selectType = SelectType.allTree;
      result.push(new RequestData(groupSerial, selectType));
    }
  });

  if (result.length > 0) {
    return result;
  }

  nodes.forEach(node => {
    const groupSerial = node.customData.groupSerial;
    let selectType;
    if (node.isIndeterminate) {
      selectType = SelectType.some;
      const cameraSerials = node.children
        .filter(child => child.isLeaf && child.isSelected)
        .map(child => child.customData.resourceSerial);
      result.push(new RequestData(groupSerial, selectType, cameraSerials));
    } else {
      selectType = SelectType.allGroup;
      result.push(new RequestData(groupSerial, selectType));
    }
  });

  return result;
};

// 把树的数据整理成一个数组
const flatten = (data: any) => {
  let flattenedData = [];

  if (!(data && data.length > 0))
    return {
      result: [],
      leaves: {}
    };
  const treeData = data[0];

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

  return convert2GeoJson(flattenedData);
};

// 把resources数组转成geoJson格式
const convert2GeoJson = arr => {
  let leaves = {};

  const result = arr.map(resource => {
    const data = new GeoJsonObject(resource);
    leaves[resource.resourceSerial] = data;
    return data;
  });

  return {
    result,
    leaves
  };
};

export default {
  ummarshall,
  flatten
};
