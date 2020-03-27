<template>
  <div class="rz-tree-map__tree">
    <rz-big-data-tree
      ref="tree"
      height="100%"
      :labelKey="labelKey"
      :allow-select="allowSelect"
      :selectAll="selectAll"
      :allowSearch="allowSearch"
      :showStatistics="showStatistics"
      :loading="loading"
      :data="data"
      :expandLevel="expandLevel"
      :icon="icon"
      @loaded="handleLoaded"
      @statistics-loaded="handleStaLoaded"
      @click="handleClick"
      @node-click="handleNodeClick"
      @hover="handleHover"
      @node-hover="handleNodeHover"
      @select-change="handleSelectChange"
      @searchtype-change="handleSearchTypeChange"
    ></rz-big-data-tree>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from "vue-property-decorator";

import BigDataTree from "../../bigDataTree/src/index.vue";

// store
import store from "../src/service/store";

@Component({
  components: {
    "rz-big-data-tree": BigDataTree
  }
})
export default class Tree extends Vue {
  @Prop([Array, Object]) data!: any; // 树数据

  @Prop({ default: true }) allowSelect!: boolean;

  @Prop({ default: false }) selectAll!: boolean;

  @Prop({ default: true }) showStatistics!: boolean;

  @Prop({ default: false }) showCount!: boolean;

  @Prop({ default: "name" }) labelKey!: string;

  @Prop({ default: 20 }) pageSize!: number;

  @Prop({ default: false }) loading!: boolean;

  @Prop({
    default() {
      return { node: "menu", leaf: "view" };
    }
  })
  icon!: { node: string; leaf: string };

  @Prop({ default: true }) allowSearch!: boolean;

  @Prop({ default: 1 }) expandLevel!: number; // 默认展开的层级

  @Prop({
    default() {
      return {
        node: "部门",
        leaf: "视频源"
      };
    }
  })
  searchTypeLabel: { node: string; leaf: string };

  @Prop({
    default() {
      return {
        node: "请输入部门名称",
        leaf: "请输入视频源名称"
      };
    }
  })
  searchTypePlaceholder: { node: string; leaf: string };

  @Prop(Function) filterMethod: (target: any, content: string) => boolean;

  @Prop() highlights: { content: string[]; key: string };

  @Prop({
    default() {
      return {
        resourceKey: "resources",
        subNodeKey: "subTreeNodes"
      };
    }
  })
  travelKey: { resourceKey: string; subNodeKey: string };

  get count(): number {
    return store.getters.getSelectedCount;
  }

  get selectNode() {
    return store.getters.getMapSelectChangeNode;
  }

  isSearch: boolean = false;

  @Watch("selectNode")
  onSelectNodeChange(val) {
    if (!this.$refs.tree) {
      return;
    }
    const { select, node } = val;

    const key = "resourceSerial";

    (this.$refs.tree as any).setSelect(node, key, select);
  }

  handleLoaded() {
    this.$emit("tree-loaded");
  }

  handleStaLoaded(event) {
    const { selected, all } = event;

    if (!this.isSearch) {
      store.commit("setMaxCount", all);
      store.commit("setSelectedCount", selected);
    }
  }

  handleSearchTypeChange(isSearch) {
    this.isSearch = isSearch;
  }

  handleClick(event) {
    this.$emit("click", event);
    store.commit("setClickedNode", event);
  }

  handleNodeClick(event) {
    this.$emit("node-click", event);
  }

  handleHover(event) {
    this.$emit("hover", event);
    store.commit("setHoveredNode", event);
  }

  handleNodeHover(event) {
    this.$emit("node-hover", event);
  }

  handleSelectChange(event) {
    // # TO Improve
    store.commit("setTreeSelectChangeNode", event);

    const { select } = event;
    const count = event.node.length;
    if (select) {
      store.commit("addSelectedCount", count);
    } else {
      store.commit("cutSelectedCount", count);
    }
    this.$emit("select-change", event);
  }

  /* apis */
  getTree() {
    return (this.$refs.tree as any).getRoot();
  }
  destroyTree() {
    (this.$refs.tree as any).destroyTree();
  }

  getSelectedNode() {
    return (this.$refs.tree as any).getSelectedNode();
  }

  getSelectedNodeData() {
    return (this.$refs.tree as any).getSelectedNodeData();
  }

  getSelectedLeaf() {
    return (this.$refs.tree as any).getSelectedLeaf();
  }

  getSelectedLeafData() {
    return (this.$refs.tree as any).getSelectedLeafData();
  }

  setExpandMaxLevel() {
    (this.$refs.tree as any).setExpandMaxLevel();
  }

  setSelect(contents: any, key: string, selected: boolean) {
    (this.$refs.tree as any).setSelect(contents, key, selected);

    const selectedLeafs = this.getSelectedLeafData();

    store.commit("setTreeSelectChangeNode", {
      select: true,
      node: selectedLeafs
    });
  }

  findLeaf(contents: any, key: string) {
    (this.$refs.tree as any).findLeaf(contents, key);
  }
}
</script>