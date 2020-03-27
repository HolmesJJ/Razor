import { Statistics, NodeConfig } from "./types";

class TreeNode {
  _id!: string;
  type!: "node" | "leaf" | "root";
  level!: number;
  maxLevel?: number;
  path?: string;

  statistics!:
    | Statistics
    | {
      all: 0;
      selected: 0;
    };

  // 标志位
  selected: boolean = false;
  expanded: boolean = false;
  highlight: boolean = false;
  indeterminate: boolean = false;
  childRendered: boolean = false;

  customData: any;
  children: TreeNode[] = [];

  constructor(customData: any, children: any, config: NodeConfig) {
    this.customData = Object.freeze(customData);
    this.children = children;
    const { id, type, level, statistics } = config;
    this._id = id;
    this.type = type;
    this.level = level;
    this.statistics = statistics;
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
    return !this.isLeaf && (this.children || []).length > 0;
  }

  // 其实都可以移除到TreeManager
  setSelect(val: boolean, deep: boolean = true) {
    this.selected = val;
    if (deep) {
      this.children.forEach(subNode => {
        subNode.setSelect(val);
      });
    }
  }

  setIndeterminate(val: boolean) {
    this.indeterminate = val;
  }

  setStatistics(statistics: Statistics) {
    this.statistics = statistics;
  }

  setExpand(expanded: boolean) {
    if (this.isLeaf) {
      return;
    }

    this.expanded = expanded;
  }

  setSelectAll() {
    if (this.isRoot) {
      this.setSelect(true);
    }
  }

  setChildRendered() {
    if (this.isLeaf || this.childRendered) {
      return;
    }
    this.childRendered = true;
  }

  setHighlight(isHighlight: boolean) {
    this.highlight = isHighlight;
  }

  resetRender() {
    this.setExpand(false);
    this.childRendered = false;
    this.children.forEach(child => child.resetRender());
  }

  clearState() {
    this.setSelect(false);
    this.setIndeterminate(false);
    this.children.forEach(child => child.clearState());
  }

  /**
   * 获取统计信息
   */
  getStatistics(): Statistics {
    return counter(this);

    function counter(node: TreeNode): Statistics {
      if (node.isLeaf) {
        return node.isSelected
          ? { all: 1, selected: 1 }
          : { all: 1, selected: 0 };
      } else {
        let all = 0;
        let selected = 0;
        if (node.hasChild) {
          node.children.forEach(n => {
            const childCount = counter(n);

            all += childCount.all;
            selected += childCount.selected;
          });
        }

        // when greater than 1 child is selected
        // then select the node
        node.selected = selected > 0;

        // update indeterminate
        if (selected > 0 && selected < all) {
          node.indeterminate = true;
        } else if (selected === all) {
          node.indeterminate = false;
        }

        return {
          all,
          selected
        };
      }
    }
  }

  getAllLeaf(): TreeNode[] {
    if (this.isLeaf || !this.hasChild) {
      return [];
    }
    const result = [];
    const queue = [];
    queue.push(...this.children);
    while (queue.length !== 0) {
      const node = queue.shift();
      if (node.isLeaf) {
        result.push(node);
      } else {
        queue.push(...node.children);
      }
    }
    return result;
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
        const last: TreeNode = nodes[nodes.length - 1];
        if (last) {
          last.setChildRendered();
          last.setExpand(true);
        }
      }
    }
  }
}

export default TreeNode;
