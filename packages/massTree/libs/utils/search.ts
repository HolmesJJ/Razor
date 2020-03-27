import TreeNode from "../treeNode";
import cloneDeep from "lodash/cloneDeep";
import isArray from "lodash/isArray";

export const search = (
  treeNode: TreeNode,
  filter: (node: TreeNode) => boolean,
  searchType: "leaf" | "node"
) => {
  // 这样无法改变原来引用对象的状态
  // 需要记录选中的叶子节点去完成信息同步
  const _node = cloneDeep(treeNode);

  let maxLevel = 1;

  const rootNode = searchHelper(_node, 1);
  if (rootNode) {
    rootNode.maxLevel = maxLevel;
  }

  return rootNode;

  function searchHelper(node: TreeNode, level: number) {
    let matchType: boolean;

    if (searchType === "leaf") {
      matchType = node.isLeaf;
    } else {
      matchType = node.isNode || node.isRoot;
    }

    if (matchType && filter(node)) {
      return node;
    }

    if (node.hasChild) {
      const filteredChild = node.children.filter(
        child => searchHelper(child, level + 1) !== null
      );

      if (filteredChild.length > 0) {
        // 记录maxLevel
        if (level > maxLevel) {
          maxLevel = level;
        }

        node.children = filteredChild;

        return node;
      }
    }

    return null;
  }
};

export const searchTravel = (tree: TreeNode | TreeNode[]) => {
  let nodes = {};
  let leaves = {};

  if (isArray(tree)) {
    (tree as TreeNode[]).forEach(t => levelTravel(t));
  } else {
    levelTravel(tree as TreeNode);
  }

  function levelTravel(root: TreeNode) {
    const queue = [];
    queue.push(root);

    while (queue.length !== 0) {
      const node: TreeNode = queue.shift();
      if (node) {
        if (node.isLeaf) {
          leaves[node._id] = node;
        } else {
          nodes[node._id] = node;
          if (node.hasChild) {
            queue.push(...node.children);
          }
        }
      }
    }
  }

  return {
    nodes,
    leaves
  };
};
