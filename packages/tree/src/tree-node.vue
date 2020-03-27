<template>
  <div
    class="rz-tree-node"
    @click.stop="handleClick"
    v-show="node.visible"
    :class="{
      'is-expanded': expanded,
      'is-current': tree.store.currentNode === node,
      'is-hidden': !node.visible,
      'is-focusable': !node.disabled,
      'is-checked': !node.disabled && node.checked
    }"
    role="treeitem"
    tabindex="-1"
    :aria-expanded="expanded"
    :aria-disabled="node.disabled"
    :aria-checked="node.checked"
    
    ref="node"
  >
    <!-- :draggable="tree.draggable"  去掉拖拽选项-->
    <!-- @dragstart.stop="handleDragStart" -->
    <!-- @dragover.stop="handleDragOver" -->
    <!-- @dragend.stop="handleDragEnd" -->
    <!-- @drop.stop="handleDrop" -->
    <div
      class="rz-tree-node__content"
      :style="{ 'padding-left': (node.level - 1) * tree.indent + 'px' }"
    >
      <span
        class="rz-tree-node__expand-icon rz-icon-caret-right"
        @click.stop="handleExpandIconClick"
        :class="{ 'is-leaf': node.isLeaf, expanded: !node.isLeaf && expanded }"
      ></span>
      <rz-checkbox
        v-if="showCheckbox"
        v-model="node.checked"
        :indeterminate="node.indeterminate"
        :disabled="!!node.disabled"
        @click.native.stop
        @change="handleCheckChange"
      ></rz-checkbox>
      <span v-if="node.loading" class="rz-tree-node__loading-icon rz-icon-loading"></span>
      <node-content :node="node"></node-content>
    </div>
    <collapse-transition>
      <div
        class="rz-tree-node__children"
        v-if="!renderAfterExpand || childNodeRendered"
        v-show="expanded"
        role="group"
        :aria-expanded="expanded"
      >
        <tree-node
          :render-content="renderContent"
          v-for="child in node.childNodes"
          :render-after-expand="renderAfterExpand"
          :key="getNodeKey(child)"
          :node="child"
          @node-expand="handleChildNodeExpand"
        ></tree-node>
      </div>
    </collapse-transition>
  </div>
  <!-- @contextmenu="($event) => this.handleContextMenu($event)" -->
</template>

<script type="text/jsx">
import CollapseTransition from "rz/transitions/collapse-transition";
import RzCheckbox from "../../checkbox";
import emitter from "rz/mixins/emitter";
import { getNodeKey } from "../model/util";

export default {
  name: "TreeNode",

  componentName: "TreeNode",

  mixins: [emitter],

  props: {
    node: {
      default() {
        return {};
      }
    },
    props: {},
    renderContent: Function,
    renderAfterExpand: {
      type: Boolean,
      default: true
    }
  },

  components: {
    CollapseTransition,
    RzCheckbox,
    NodeContent: {
      name: "NodeContent",
      props: {
        node: {
          required: true
        }
      },
      renderLabel(h) {
        return h("span", null, node.label);
      },
      render(h) {
        const parent = this.$parent;
        const tree = parent.tree;
        const node = this.node;
        const { data, store } = node;
        return parent.renderContent
          ? parent.renderContent.call(parent._renderProxy, h, {
            _self: tree.$vnode.context,
            node,
            data,
            store
          })
          : tree.$scopedSlots.default
            ? tree.$scopedSlots.default({ node, data })
            : this.renderLabel();
      }
    }
  },

  data() {
    return {
      tree: null,
      expanded: false,
      childNodeRendered: false,
      showCheckbox: false,
      oldChecked: null,
      oldIndeterminate: null
    };
  },

  watch: {
    "node.indeterminate"(val) {
      this.handleSelectChange(this.node.checked, val);
    },

    "node.checked"(val) {
      this.handleSelectChange(val, this.node.indeterminate);
    },

    "node.expanded"(val) {
      this.$nextTick(() => (this.expanded = val));
      if (val) {
        this.childNodeRendered = true;
      }
    }
  },

  methods: {
    getNodeKey(node) {
      return getNodeKey(this.tree.nodeKey, node.data);
    },

    handleSelectChange(checked, indeterminate) {
      if (
        this.oldChecked !== checked &&
        this.oldIndeterminate !== indeterminate
      ) {
        this.tree.$emit("check-change", this.node.data, checked, indeterminate);
      }
      this.oldChecked = checked;
      this.indeterminate = indeterminate;
    },

    handleClick() {
      const store = this.tree.store;
      store.setCurrentNode(this.node);
      this.tree.$emit(
        "current-change",
        store.currentNode ? store.currentNode.data : null,
        store.currentNode
      );
      this.tree.currentNode = this;
      if (this.tree.expandOnClickNode) {
        this.handleExpandIconClick();
      }
      if (this.tree.checkOnClickNode && !this.node.disabled) {
        this.handleCheckChange(null, {
          target: { checked: !this.node.checked }
        });
      }
      this.tree.$emit("node-click", this.node.data, this.node, this);
    },

    // handleContextMenu(event) {
    //   if (
    //     this.tree._events["node-contextmenu"] &&
    //     this.tree._events["node-contextmenu"].length > 0
    //   ) {
    //     event.stopPropagation();
    //     event.preventDefault();
    //   }
    //   this.tree.$emit(
    //     "node-contextmenu",
    //     event,
    //     this.node.data,
    //     this.node,
    //     this
    //   );
    // },

    handleExpandIconClick() {
      if (this.node.isLeaf) return;
      if (this.expanded) {
        this.tree.$emit("node-collapse", this.node.data, this.node, this);
        this.node.collapse();
      } else {
        this.node.expand();
        this.$emit("node-expand", this.node.data, this.node, this);
      }
    },

    handleCheckChange(value, ev) {
      this.node.setChecked(ev.target.checked, !this.tree.checkStrictly);
      this.$nextTick(() => {
        const store = this.tree.store;
        this.tree.$emit("check", this.node.data, {
          checkedNodes: store.getCheckedNodes(),
          checkedKeys: store.getCheckedKeys(),
          halfCheckedNodes: store.getHalfCheckedNodes(),
          halfCheckedKeys: store.getHalfCheckedKeys()
        });
      });
    },

    handleChildNodeExpand(nodeData, node, instance) {
      this.broadcast("TreeNode", "tree-node-expand", node);
      this.tree.$emit("node-expand", nodeData, node, instance);
    }

    // handleDragStart(event) {
    //   if (!this.tree.draggable) return;
    //   this.tree.$emit("tree-node-drag-start", event, this);
    // },

    // handleDragOver(event) {
    //   if (!this.tree.draggable) return;
    //   this.tree.$emit("tree-node-drag-over", event, this);
    //   event.preventDefault();
    // },

    // handleDrop(event) {
    //   event.preventDefault();
    // },

    // handleDragEnd(event) {
    //   if (!this.tree.draggable) return;
    //   this.tree.$emit("tree-node-drag-end", event, this);
    // }
  },

  created() {
    const parent = this.$parent;

    if (parent.isTree) {
      this.tree = parent;
    } else {
      this.tree = parent.tree;
    }

    const tree = this.tree;
    if (!tree) {
      console.warn("Can not find node's tree.");
    }

    const props = tree.props || {};
    const childrenKey = props["children"] || "children";

    this.$watch(`node.data.${childrenKey}`, () => {
      this.node.updateChildren();
    });

    this.showCheckbox = tree.showCheckbox;

    if (this.node.expanded) {
      this.expanded = true;
      this.childNodeRendered = true;
    }

    if (this.tree.accordion) {
      const _this = this;
      this.$on("tree-node-expand", node => {
        if (_this.node !== node) {
          _this.node.collapse();
        }
      });
    }
  }
};
</script>
