import isArray from "lodash/isArray";
import cloneDeep from "lodash/cloneDeep";
import has from "lodash/has";
import { ID } from "./utils";
import { NodeConfig } from "./types";

import TreeNode from "./tree-node";
import { KeyConfig } from "./types";

export const travelsal = (
  data: any,
  childKey: KeyConfig = {
    resourceKey: "resources",
    subNodeKey: "subTreeNodes"
  }
) => {
  if (!isArray(data)) {
    return travelsal([data], childKey);
  }

  const result = [];

  data.forEach(tree => {
    result.push(travelHelper(tree, childKey));
  });

  return result;
};

export const travelHelper = (originData: any, childKey: KeyConfig) => {
  const data = cloneDeep(originData);

  let root = true;

  const genId = ID;

  let maxLevel = 1;

  const rootNode = parseNode(data, childKey, 1);

  rootNode.maxLevel = maxLevel;

  return rootNode;

  function parseNode(node: any, childKey: KeyConfig, level: number) {
    // 记录这个树的最大层级
    if (level > maxLevel) {
      maxLevel = level;
    }

    const hasResource = has(node, childKey.resourceKey);
    const hasSubNode = has(node, childKey.subNodeKey);

    const hasChild = hasResource || hasSubNode;

    const config: NodeConfig = {
      id: genId(),
      type: hasChild ? "node" : "leaf",
      level
    };

    if (root) {
      config.type = "root";
      root = false;
    }

    const customData = node;

    let subNodes = [];
    let resource = [];

    if (hasSubNode) {
      subNodes = node[childKey.subNodeKey].map(subNode =>
        parseNode(subNode, childKey, level + 1)
      );
    }

    if (hasResource) {
      resource = node[childKey.resourceKey].map(resource =>
        parseNode(resource, childKey, level + 1)
      );
    }

    // 将 subNode 和 resource 统一为 children
    // 且 subNode 在 resource 之前
    const children = [...subNodes, ...resource];

    delete customData[childKey.resourceKey];
    delete customData[childKey.subNodeKey];

    const treeNode = new TreeNode(Object.freeze(customData), children, config);

    return treeNode;
  }
};
