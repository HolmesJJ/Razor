import { pagination } from "./utils";

import { Statistics, NodeConfig } from "./types";

class TreeNode {
  _id!: string;
  type!: "node" | "leaf" | "root";
  level!: number;
  maxLevel?: number;

  statistics!: Statistics | null;

  // 标志位
  selected: boolean = false;
  expanded: boolean = false;
  highlight: boolean = false;
  indeterminate: boolean = false;
  childRendered: boolean = false;

  customData: any;
  children: TreeNode[] = [];

  constructor(customData: any, children: any, config: NodeConfig) {
    this.customData = customData;
    this.children = children;
    const { id, type, level } = config;
    this._id = id;
    this.type = type;
    this.level = level;
    this.statistics =
      this.type !== "leaf"
        ? {
            all: 0,
            selected: 0
          }
        : null;
  }

  get isLeaf(): boolean {
    return this.type === "leaf";
  }

  get isNode(): boolean {
    return this.type === "node";
  }

  get isRoot(): boolean {
    return this.type === "root";
  }

  get isSelected(): boolean {
    return this.selected;
  }

  get isIndeterminate(): boolean {
    return this.indeterminate;
  }

  get hasChild(): boolean {
    return !this.isLeaf && this.children.length > 0;
  }

  isEqual(nodeId: string): boolean {
    return this._id === nodeId;
  }

  setSelect(val: boolean, deep: boolean = true) {
    this.selected = val;
    if (deep) {
      this.children.forEach(subNode => {
        subNode.setSelect(val);
      });
    }
  }

  setSelectAll() {
    if (this.isRoot) {
      this.setSelect(true);
    }
  }

  setExpand(expanded: boolean) {
    if (this.isLeaf) {
      return;
    }

    this.expanded = expanded;
  }

  setHighlight(highlight: boolean) {
    this.highlight = highlight;
  }

  toggleNodeExpand() {
    this.setExpand(!this.expanded);
    this.renderChild();
  }

  setIndeterminate(val: boolean) {
    this.indeterminate = val;
  }

  selectChildNode(child: TreeNode, selected: boolean) {
    const target = this.children.find(node => node._id === child._id);
    target.setSelect(selected);
  }

  reset() {
    this.setExpand(false);
    this.setSelect(false);
    this.childRendered = false;
    this.children.forEach(child => child.reset());
  }

  renderChild() {
    if (this.isLeaf || this.childRendered) {
      return;
    }
    this.childRendered = true;
  }

  fetchChildren(page: number, pageSize: number): TreeNode[] {
    if (this.isLeaf) {
      return [];
    }
    return pagination(page, pageSize, this.children);
  }

  /**
   * 获取统计信息
   */
  getStatistics(): Statistics {
    if (this.isLeaf) {
      return {
        all: 0,
        selected: 0
      };
    }

    let allCount = 0;
    let selectedCount = 0;
    const queue = [...this.children];

    // 提高速度一遍遍历
    while (queue.length !== 0) {
      const node = queue.shift();
      if (node.hasChild) {
        queue.push(...node.children);
      } else {
        allCount++;
        if (node.isSelected) {
          selectedCount++;
        }
      }
    }

    return {
      all: allCount,
      selected: selectedCount
    };
  }

  getSelectedNode(): TreeNode[] {
    return this.getAllChild().filter(child => {
      if (child.isLeaf) {
        return child.isSelected;
      }

      return child.isSelected || child.isIndeterminate;
    });
  }

  /* search method */
  getAllChild(): TreeNode[] {
    if (this.isLeaf || !this.hasChild) {
      return [];
    }

    const result = [];
    const queue = [];
    queue.push(this);

    while (queue.length !== 0) {
      const node: TreeNode = queue.shift();
      result.push(node);
      if (node.hasChild) {
        queue.push(...node.children);
      }
    }

    return result;
  }

  getAllLeaf(): TreeNode[] {
    return this.getAllChild().filter(child => child.isLeaf);
  }

  getAllLeafData() {
    return [...this.getAllLeaf().map(leaf => leaf.customData)];
  }

  getAllSelectedLeaf(): TreeNode[] {
    return this.getAllLeaf().filter(leaf => leaf.isSelected);
  }

  getAllSelectedLeafData() {
    return [...this.getAllSelectedLeaf().map(leaf => leaf.customData)];
  }

  getNodeByLevel(level: number) {
    const result = [];
    const queue = [];
    queue.push(this);

    while (queue.length !== 0) {
      const node: TreeNode = queue.shift();
      if (node.level === level) {
        result.push(node);
      } else if (node.level < level && node.hasChild) {
        queue.push(...node.children);
      }
    }
    return result;
  }

  setExpandLevel(val: number) {
    if (this.isRoot) {
      const level = val > this.maxLevel ? this.maxLevel : val;
      for (let i = 1; i <= level; i++) {
        const nodes = this.getNodeByLevel(i);
        const last = nodes[nodes.length - 1];
        if (last) {
          last.renderChild();
          last.setExpand(true);
        }
      }
    }
  }

  findLeaf(contents: any[], key: string) {
    const result = [];

    const queue = [...this.children];

    while (queue.length !== 0) {
      const node: TreeNode = queue.shift();

      if (node.hasChild) {
        queue.push(...node.children);
      } else {
        contents.forEach(c => {
          const target = typeof c === "string" ? c : c[key];

          if (node.customData[key] === target) {
            result.push(node);
          }
        });
      }
    }

    return result;
  }

  selectLeaf(contents: any[], key: string, selected: boolean) {
    this.findLeaf(contents, key).forEach(leaf => leaf.setSelect(selected));
  }

  highlightLeaf(contents: any[], key: string, isHighlight: boolean) {
    this.findLeaf(contents, key).forEach(leaf =>
      leaf.setHighlight(isHighlight)
    );
  }

  destroy() {
    // 深层次的递归解除引用
    destroyHelper(this);

    function destroyHelper(node: TreeNode) {
      if (node.isLeaf) {
        node = null;
      } else {
        node.children &&
          node.children.forEach(node => {
            destroyHelper(node);
          });
        node.children = null;
      }
    }
  }
}

export default TreeNode;
