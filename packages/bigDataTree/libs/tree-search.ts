import TreeNode from "./tree-node";
import cloneDeep from "lodash/cloneDeep";

export const search = (
  treeNode: TreeNode,
  filter: Function,
  searchType: "leaf" | "node"
) => {
  const _node = cloneDeep(treeNode);

  let maxLevel = 1;

  function searchHelper(node: TreeNode, level: number) {
    let matchType = false;

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

  const rootNode = searchHelper(_node, 1);

  if (rootNode) {
    rootNode.maxLevel = maxLevel;
  }

  return rootNode;
};
