<template>
  <div class="rz-big-data-tree-node" :class="classes" @click.stop="handleClick" ref="node">
    <!-- main content: (indicator)-(checkbox)-(icon)-text-(statistics) -->
    <div
      ref="content"
      class="rz-big-data-tree-node__content"
      :style="childStyle"
      @mouseover.stop="handleMouseOver"
    >
      <!-- indicator only in folder -->
      <rz-icon
        v-if="!isLeaf"
        name="caret-right"
        class="rz-big-data-tree-node__indicator"
        :class="{'rz-big-data-tree-node__indicator--expanded': node.expanded}"
        @click.native.stop="toggleExpand"
      ></rz-icon>

      <!-- checkbox -->
      <rz-checkbox
        class="rz-big-data-tree-node__checkbox"
        v-if="showCheckbox"
        :value="node.selected"
        :indeterminate="node.indeterminate"
        @click.native.stop="handleCheckboxClick"
      ></rz-checkbox>

      <!-- icon -->
      <rz-icon
        :name="currentIcon"
        :class="{'is-highlight': node.highlight}"
        class="rz-big-data-tree-node__icon"
      ></rz-icon>

      <!-- node text -->
      <rz-tooltip
        :disabled="!isOverflow"
        placement="top"
        :content="tooltipContent"
        :open-delay="500"
        :hide-after="10"
      >
        <span
          class="rz-big-data-tree-node__text"
          :class="{'is-highlight': node.highlight}"
        >{{label}}</span>
      </rz-tooltip>

      <!-- statistics -->
      <span class="rz-big-data-tree-node__statistics" v-if="showStatistics && !isLeaf">
        (
        <span>{{statistics.selected}}</span>
        / {{statistics.all}}
        )
      </span>

      <!-- leaf count -->
      <span class="rz-big-data-tree-node__leafcount" v-if="isShowCount">( {{leafCount}} )</span>
    </div>

    <!-- if current node has children -->
    <!-- <rz-collapse-transition> -->
    <div
      ref="childContainer"
      v-if="!isLeaf && node.childRendered"
      v-show="node.expanded"
      class="rz-big-data-tree-node__child"
      :class="childClasses"
    >
      <rz-tree-node
        v-for="child in children"
        :key="child._id"
        :node="child"
        :showCheckbox="showCheckbox"
        :showStatistics="showStatistics"
        :clientHeight="clientHeight"
        :scrollTop="scrollTop"
        :containerOffsetY="containerOffsetY"
        :labelKey="labelKey"
        :pageSize="pageSize"
        :icon="icon"
        :showCount="showCount"
        @add-selected="handleAddSelected"
        @cut-selected="handleCutSelected"
        @leaf-select-change="handleLeafSelectChange"
        @node-select-change="handleNodeSelectChange"
        @click="handleChildClick"
        @node-click="handleChildNodeClick"
        @hover="handleChildHover"
        @node-hover="handleChildNodeHover"
      ></rz-tree-node>
    </div>
    <!-- </rz-collapse-transition> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

// components
import Checkbox from "../../checkbox/src/index.vue";
import Icon from "../../icon/src/index.vue";
import Tooltip from "../../tooltip/src/main";
import CollapseTransition from "../../../src/transitions/collapse-transition.js";

import TreeNode from "../libs/tree-node";
import { Statistics } from "../libs/types";

@Component({
  name: "RzTreeNode",
  components: {
    "rz-icon": Icon,
    "rz-checkbox": Checkbox,
    "rz-tooltip": Tooltip,
    "rz-collapse-transition": CollapseTransition
  }
})
export default class RzTreeNode extends Vue {
  @Prop() node!: TreeNode; // 这里会保持一份对node的引用导致无法被GC回收

  @Prop() icon!: any;

  @Prop() scrollHeight!: number;

  @Prop() scrollTop!: number;

  @Prop() clientHeight!: number;

  @Prop() containerOffsetY!: number;

  @Prop() labelKey!: string;

  @Prop({ default: true }) showCheckbox!: boolean;

  @Prop({ default: false }) showStatistics!: boolean;

  @Prop({ default: false }) showCount!: boolean;

  @Prop({ default: 10 }) pageSize!: number;

  children: TreeNode[] = [];

  childRendered: boolean = false;

  statistics: Statistics = { all: 0, selected: 0 };

  leafCount: number = 0;

  nodeHeight: number = 0;

  currentPage: number = 1;

  isOverflow: boolean = false;

  get isLeaf(): boolean {
    return this.node.isLeaf;
  }

  get isNode(): boolean {
    return this.node.isNode;
  }

  get isRoot(): boolean {
    return this.node.isRoot;
  }

  get isShowCount(): boolean {
    if (this.showStatistics) {
      return false;
    }

    return this.showCount;
  }

  get classes() {
    return {
      "is-leaf": this.isLeaf,
      "is-node": !this.isLeaf
    };
  }

  get childClasses() {
    return {
      "is-expanded": this.node.expanded
    };
  }

  get childStyle() {
    const basic = 8;
    const delta = 16;
    const offset = this.isLeaf ? 10 : 0;
    const level = this.isLeaf ? this.node.level : this.node.level - 1;
    return {
      paddingLeft: `${basic + level * delta + offset}px`
    };
  }

  get label() {
    return this.node.customData[this.labelKey] || "";
  }

  get currentIcon() {
    if (this.icon) {
      return this.isLeaf ? this.icon.leaf : this.icon.node;
    } else {
      return "";
    }
  }

  get tooltipContent(): string {
    if (this.isLeaf) {
      return `${this.label}`;
    }
    return `${this.label} (${this.statistics.selected} / ${this.statistics.all})`;
  }

  @Watch("node.selected")
  onSelecteChange(isSelected: boolean) {
    if (this.node === null) {
      return;
    }

    if (!this.isLeaf) {
      this.statistics.selected = isSelected ? this.statistics.all : 0;
    }
  }

  @Watch("node.childRendered", { immediate: true })
  whenRender(isRenderChild: boolean) {
    if (isRenderChild) {
      this.fetchChildren();
    }
  }

  @Watch("statistics", { deep: true })
  onChangeStatisticsChange(val: Statistics) {
    const { all, selected } = val;
    const isIndeterminate = selected > 0 && selected < all;
    this.node.setIndeterminate(isIndeterminate);
    if (selected === all) {
      this.node.setSelect(true, false);
    }
    if (selected === 0) {
      this.node.setSelect(false, false);
    }
  }

  @Watch("isShowCount")
  onShowCountChange(val) {
    if (val) {
      this.initLeafCount();
    }
  }

  @Watch("scrollTop")
  onScrollTopChange() {
    // eslint-disable-line
    if (this.isLeaf || !this.containerOffsetY) {
      return;
    }
    if (this.node.expanded) {
      const nodeElm = this.$refs.node as Element;
      const rect = nodeElm.getBoundingClientRect();
      const contentHeight = rect.height;
      const topOffset = rect.top - this.containerOffsetY;

      // 当前节点的元素底部距离视窗顶部的距离: contentHeight + topOffset

      // 已在视窗外的不加载
      if (contentHeight + topOffset < 0) {
        return;
      }

      // 当滑到最后 BUFFER 个元素的时候开始去加载
      const BUFFER = 2;

      const isToBottom =
        contentHeight + topOffset <
        this.clientHeight + this.nodeHeight * BUFFER;

      // 快滚到当前元素底部时，动态加载
      if (isToBottom) {
        this.fetchChildren();
      }
    }
  }

  /* lifecycle */
  created() {
    if (!this.isLeaf && (this.showCheckbox || this.showStatistics)) {
      this.initStatistics();
    }

    if (!this.isLeaf && this.isShowCount) {
      this.initLeafCount();
    }
  }

  mounted() {
    const node = this.$refs.node as Element;
    const content = this.$refs.content as Element;
    const style = getComputedStyle(node);
    this.nodeHeight = parseInt(style.height as string);

    const isOverflowX =
      content.scrollWidth > Math.ceil(parseFloat(style.width));

    this.isOverflow = isOverflowX;
  }
  /* lifecycle end */

  /* initial */
  initStatistics() {
    this.statistics = this.node.getStatistics();
    if (this.isRoot) {
      this.$emit("statistics-loaded", this.statistics);
    }
  }

  initLeafCount() {
    this.leafCount = this.node.getAllLeaf().length;
  }

  /* handler */
  handleClick() {
    this.$emit("click", this.node.customData);
    this.$emit("node-click", this.node);
  }

  handleChildClick(event) {
    this.$emit("click", event);
  }

  handleChildNodeClick(event) {
    this.$emit("node-click", event);
  }

  handleMouseOver() {
    this.$emit("hover", this.node.customData);
    this.$emit("node-hover", this.node);
  }

  handleChildHover(event) {
    this.$emit("hover", event);
  }

  handleChildNodeHover(event) {
    this.$emit("node-hover", event);
  }
  /**
   * 通过Vue的emit去做统计信息的通信可以避免树的遍历查找
   * 可以提高勾选速度
   */

  handleCheckboxClick() {
    if (this.node.indeterminate || !this.node.isSelected) {
      this.updateStatistics(true);
      this.node.setSelect(true);
    } else {
      this.updateStatistics(false);
      this.node.setSelect(false);
    }

    this.selectChange(this.node.isSelected);
  }

  handleAddSelected(data) {
    const { all, selected } = this.statistics;

    this.statistics.selected = selected + data > all ? all : selected + data;

    this.$emit("add-selected", data);
  }

  handleCutSelected(data) {
    const { all, selected } = this.statistics;

    this.statistics.selected = selected - data < 0 ? 0 : selected - data;

    this.$emit("cut-selected", data);
  }

  handleNodeSelectChange(data) {
    this.$emit("node-select-change", data);
  }

  handleLeafSelectChange(data) {
    this.$emit("leaf-select-change", data);
  }

  /* handler end */

  updateStatistics(selected: boolean) {
    if (selected) {
      // add selected
      if (this.isLeaf) {
        this.$emit("add-selected", 1);
      } else {
        const addition = this.statistics.all - this.statistics.selected;
        this.statistics.selected = this.statistics.all;
        this.$emit("add-selected", addition);
      }
    } else {
      // cut-selected
      if (this.isLeaf) {
        this.$emit("cut-selected", 1);
      } else {
        this.statistics.selected = 0;
        this.$emit("cut-selected", this.statistics.all);
      }
    }
  }

  /* tree manage */

  selectChange(selected: boolean) {
    if (this.isLeaf) {
      this.$emit("leaf-select-change", {
        select: selected,
        node: this.node.customData
      });
    } else {
      this.$emit("node-select-change", {
        select: selected,
        node: this.node.getAllLeafData()
      });
    }
  }

  toggleExpand() {
    this.node.toggleNodeExpand();
  }

  fetchChildren() {
    this.children = this.children.concat(
      this.node.fetchChildren(this.currentPage, this.pageSize)
    );
    this.currentPage++;
  }

  destroyNode() {
    this.node.destroy();
    this.children = null;
  }
}
</script>
