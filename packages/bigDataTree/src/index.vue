<template>
  <div class="rz-big-data-tree__container">
    <!-- search input -->
    <div class="rz-big-data-tree__search" v-if="allowSearch">
      <rz-search-input
        :options="searchInputOptions"
        :placeholder="searchInputPlaceholder[searchIndex]"
        v-model="keyword"
        @select-change="handleSearchTypeChange"
        @search="handleSearch"
        @clear="handleClear"
      ></rz-search-input>
    </div>

    <!-- origin tree -->
    <div
      v-if="!isSearch"
      key="rootTree"
      class="rz-big-data-tree root-tree"
      ref="tree"
      :style="{ 'height': styleHeight}"
      @scroll="handleScroll"
      v-loading="loading"
      razor-loading-text="拼命加载中"
    >
      <rz-tree-node
        v-show="root.length > 0"
        v-for="node in root"
        :key="node._id"
        :node="node"
        :showCheckbox="allowSelect"
        :showStatistics="showStatistics"
        :clientHeight="clientHeight"
        :labelKey="labelKey"
        :pageSize="pageSize"
        :icon="icon"
        :showCount="showCount"
        :scrollTop="scrollTop"
        :containerOffsetY="containerOffsetY"
        @statistics-loaded="handleStatisticsLoaded"
        @click="handleClick"
        @node-click="handleChildNodeClick"
        @hover="handleHover"
        @node-hover="handleChildNodeHover"
        @leaf-select-change="handleLeafSelectChange"
        @node-select-change="handleNodeSelectChange"
        @add-selected="handleAddSelect"
        @cut-selected="handleCutSelect"
      ></rz-tree-node>
      <div class="rz-big-data-tree__search-empty" v-if="!loading && root.length === 0">
        <slot name="empty">
          <p class="rz-big-data-tree__search-empty-info">暂无内容</p>
        </slot>
      </div>
    </div>

    <!-- search tree -->
    <div
      v-else
      key="searchTree"
      class="rz-big-data-tree search-tree"
      ref="tree"
      :style="{ 'height': styleHeight}"
      @scroll="handleScroll"
      v-loading="loading"
    >
      <rz-tree-node
        v-show="searchRoot.length > 0"
        v-for="node in searchRoot"
        :key="node._id"
        :node="node"
        :showCheckbox="allowSelect"
        :showStatistics="showStatistics"
        :clientHeight="clientHeight"
        :scrollTop="scrollTop"
        :containerOffsetY="containerOffsetY"
        :labelKey="labelKey"
        :pageSize="pageSize"
        :icon="icon"
        :showCount="showCount"
        @statistics-loaded="handleStatisticsLoaded"
        @click="handleClick"
        @node-click="handleChildNodeClick"
        @hover="handleHover"
        @node-hover="handleChildNodeHover"
        @leaf-select-change="handleLeafSelectChange"
        @node-select-change="handleNodeSelectChange"
        @add-selected="handleAddSelect"
        @cut-selected="handleCutSelect"
      ></rz-tree-node>
      <div class="rz-big-data-tree__search-empty" v-if="searchRoot.length === 0">
        <slot name="empty">
          <p class="rz-big-data-tree__search-empty-info">暂无内容</p>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

// components
import RzTreeNode from "./TreeNode.vue";
import TreeNode from "../libs/tree-node";
import RzInput from "../../input/src/index.vue";

// utils
import { travelsal } from "../libs/tree-travelsal";
import { search } from "../libs/tree-search";
import { deepDestroy, deepUpdate, diffReduce } from "../libs/utils";
import cloneDeep  from "lodash/cloneDeep";
import isFunction from "lodash/isFunction";
import { KeyConfig, Statistics } from "../libs/types";

@Component({
  name: "BigDataTree",
  components: {
    RzTreeNode,
    RzInput
  }
})
export default class BigDataTree extends Vue {
  @Prop([Array, Object]) data!: any; // 树数据

  @Prop({ default: false }) allowSelect!: boolean;

  @Prop({ default: false }) selectAll!: boolean;

  @Prop({ default: false }) showStatistics!: boolean;

  @Prop({ default: false }) showCount!: boolean;

  @Prop({ default: "name" }) labelKey!: string;

  @Prop({ default: 20 }) pageSize!: number;

  @Prop({ default: false }) loading!: boolean;

  @Prop() icon!: { node: string; leaf: string };

  @Prop({ default: false }) allowSearch!: boolean;

  @Prop({ default: 0 }) expandLevel!: number; // 默认展开的层级

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
  travelKey: KeyConfig;

  // 样式相关属性
  containerOffsetY: number = 0;

  scrollTop: number = 0;

  clientHeight: number = 0;

  // 搜索相关
  keyword: string = "";

  isSearch: boolean = false;

  searchIndex: number = 0;

  // 树
  root: TreeNode[] = []; // 这里如果不初始化，会有坑

  searchRoot: TreeNode[] = [];

  get styleHeight(): string {
    const searchbarHeight = "50px";

    if (!this.allowSearch) {
      return "100%";
    } else {
      return `calc(100% - ${searchbarHeight})`;
    }
  }

  get searchType(): "node" | "leaf" {
    return this.searchInputOptions[this.searchIndex].value;
  }

  get searchInputOptions(): { value: "node" | "leaf"; label: string }[] {
    const { node, leaf } = this.searchTypeLabel;
    return [
      {
        value: "node",
        label: node
      },
      {
        value: "leaf",
        label: leaf
      }
    ];
  }

  get searchInputPlaceholder(): { [key: number]: string } {
    const { node, leaf } = this.searchTypePlaceholder;
    return {
      0: node,
      1: leaf
    };
  }

  @Watch("data")
  onDataChange(val) {
    this.root = travelsal(val, this.travelKey);

    if (this.selectAll) {
      this.root.forEach(root => root.setSelectAll());
    }

    this.$emit("loaded");
    this.setExpandLevel(this.expandLevel);
    this.getStyleValue();
  }

  @Watch("expandLevel")
  onExpandLevelChange(val) {
    this.setExpandLevel(val);
  }

  @Watch("highlights.content")
  onHightlightChange(newVal: string[], oldVal: string[]) {
    const init = oldVal.length === 0;
    const key = this.highlights.key;

    this.setHighlight(newVal, key, true);

    this.setHighlight(diffReduce(newVal, oldVal), key, false);
  }

  @Watch("isSearch")
  onSearchChange(val) {
    this.$emit("searchtype-change", val);
  }

  /* lifecycle */
  mounted() {
    this.getStyleValue();
  }

  beforeDestroy() {
    this.destroyTree();
  }
  /* lifecycle end */

  getStyleValue() {
    const treeElm = this.$refs.tree as Element;
    this.clientHeight = parseInt(getComputedStyle(treeElm).height);
    this.containerOffsetY = treeElm.getBoundingClientRect().top;
  }

  reset() {
    // 搜索的时候是否需要清空之前的状态?
    // this.root.forEach(root => root.reset());
    this.searchRoot.forEach(root => root.destroy());
    this.searchRoot = [];
  }

  /* handler */
  handleSearchTypeChange(key: number) {
    this.searchIndex = key;
    this.filterTree();
  }

  handleStatisticsLoaded(sta: Statistics) {
    this.$emit("statistics-loaded", sta);
  }

  handleScroll(event: Event) {
    const container = event.target as Element;
    const { scrollTop } = container;
    this.scrollTop = scrollTop;
  }

  handleClick(event: any) {
    this.$emit("click", event);
  }

  handleChildNodeClick(event) {
    this.$emit("node-click", event);
  }

  handleHover(event) {
    this.$emit("hover", event);
  }

  handleChildNodeHover(event) {
    this.$emit("node-hover", event);
  }

  handleLeafSelectChange(data) {
    this.$emit("select-change", { select: data.select, node: [data.node] });
  }

  handleNodeSelectChange(data) {
    this.$emit("select-change", data);
  }

  handleAddSelect(event) {
    this.$emit("add-selected", event);
  }

  handleCutSelect(event) {
    this.$emit("cut-selected", event);
  }

  handleSearch(data) {
    this.keyword = data.searchText.trim();

    this.filterTree();
  }

  filterTree() {
    if (this.keyword === "") {
      this.handleClear();
      return;
    }

    if (this.isSearch) {
      this.reset();
    }

    this.isSearch = true;

    this.$nextTick(() => {
      this.filter();
    });
  }

  handleClear() {
    this.reset();
    this.isSearch = false;
    this.setExpandLevel(this.expandLevel);
  }

  /* api for user */
  /**
   * 设置树的展开层级
   */
  setExpandLevel(val: number) {
    this.root.forEach(root => {
      root.setExpandLevel(val);
    });
  }

  setExpandMaxLevel() {
    if (this.isSearch) {
      this.searchRoot.forEach(root => this.setExpandLevel(root.maxLevel));
    } else {
      this.root.forEach(root => this.setExpandLevel(root.maxLevel));
    }
  }

  setSelect(contents: any, key: string, selected: boolean) {
    if (this.root === null) {
      return;
    }
    this.root.forEach(root => {
      root.selectLeaf(contents, key, selected);
      deepUpdate(this);
    });
  }

  findLeaf(contents: any, key: string) {
    if (this.root === null) {
      return;
    }
    return [...this.root.map(root => root.findLeaf(contents, key))];
  }

  setHighlight(contents: any, key: string, isHighlight: boolean) {
    this.root.forEach(root => root.highlightLeaf(contents, key, isHighlight));
  }

  destroyTree() {
    this.isSearch = false;
    this.keyword = "";
    this.searchIndex = 0;

    deepDestroy(this);

    this.root = null;

    this.searchRoot = null;
  }

  loadData(data) {
    this.root = travelsal(data, this.travelKey);
    if (this.selectAll) {
      this.root.forEach(root => root.setSelectAll());
    }
    this.setExpandLevel(this.expandLevel);
  }

  getRoot() {
    return Object.freeze(cloneDeep(this.root));
  }

  getSelectedNode() {
    let result = [];

    if (this.isSearch) {
      this.searchRoot.forEach(root => {
        result.push(...root.getSelectedNode());
      });
    } else {
      this.root.forEach(root => {
        result.push(...root.getSelectedNode());
      });
    }

    return result;
  }

  getSelectedNodeData() {
    return this.getSelectedNode().map(node => node.customData);
  }

  getSelectedLeaf() {
    let result = [];
    if (this.isSearch) {
      this.searchRoot.forEach(root => {
        result = result.concat(root.getAllSelectedLeaf());
      });
    } else {
      this.root.forEach(root => {
        result = result.concat(root.getAllSelectedLeaf());
      });
    }

    return result;
  }

  getSelectedLeafData() {
    return this.getSelectedLeaf().map(leaf => leaf.customData);
  }

  search(contents: any, key: string) {
    const result = [];
    this.root.forEach(root => {
      result.push(...root.findLeaf(contents, key));
    });

    return result;
  }

  filter() {
    const defaultFilterMethod = (target, content) =>
      target.name.toLowerCase().includes(content.toLowerCase());

    const filterFn = () => {
      return (node: TreeNode) => {
        if (isFunction(this.filterMethod)) {
          return this.filterMethod(node.customData, this.keyword);
        }

        return defaultFilterMethod(node.customData, this.keyword);
      };
    };

    this.searchRoot = this.root
      .map(root => search(root, filterFn(), this.searchType))
      .filter(root => root !== null);

    this.searchRoot.forEach(root => root.setExpandLevel(root.maxLevel));
  }
}
</script>

    