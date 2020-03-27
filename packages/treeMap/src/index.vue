<script lang='ts'>
import { VNode } from "vue";
import { Vue, Component, Prop } from "vue-property-decorator";

import Topbar from "./Topbar.vue";
import TheTree from "./Tree.vue";
import MapSelector from "./MapSelector.vue";
import store from "./service/store";

// import Broker from "./service/broker";

@Component({
  name: "TreeMap",
  components: {
    Topbar,
    TheTree,
    MapSelector
  }
})
export default class TreeMap extends Vue {
  @Prop() data: any;

  @Prop() treeProps: any;

  @Prop() mapProps: any;

  /* lifecyc */
  beforeDestroy() {
    this.destroyTree();
  }

  destroyed() {
    this.resetStore();
  }

  /* handlers */
  handleTreeClick(event) {
    this.$emit("tree-click", event);
  }

  handleTreeNodeClick(event) {
    this.$emit("tree-node-click", event);
  }

  handleTreeHover(event) {
    this.$emit("tree-hover", event);
  }

  handleTreeNodeHover(event) {
    this.$emit("tree-node-hover", event);
  }

  handleSelectChange(event) {
    this.$emit("select-change", event);
  }

  handleLoaded() {
    this.$emit("tree-loaded");
  }

  /* apis */
  resetStore() {
    store.commit("reset");
  }

  /* tree api */
  getTree() {
    return (this.$refs.tree as any).getTree();
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

  setSelect(contents: any, key: string, selected: boolean) {
    (this.$refs.tree as any).setSelect(contents, key, selected);
  }

  findLeaf(contents: any, key: string) {
    (this.$refs.tree as any).findLeaf(contents, key);
  }

  setExpandMaxLevel() {
    (this.$refs.tree as any).setExpandMaxLevel();
  }

  /* render */
  renderTree(h): VNode {
    return h("the-tree", {
      ref: "tree",
      props: {
        data: this.data,
        ...this.treeProps
      },
      on: {
        "select-change": this.handleSelectChange,
        "tree-loaded": this.handleLoaded,
        "node-click": this.handleTreeNodeClick,
        "node-hover": this.handleTreeNodeHover,
        click: this.handleTreeClick,
        hover: this.handleTreeHover
      }
    });
  }

  renderMap(h): VNode {
    return h(
      "div",
      {
        class: { "rz-tree-map__map": true }
      },
      [
        h("map-selector", {
          props: {
            data: this.data,
            ...this.mapProps
          }
        })
      ]
    );
  }

  renderTopbar(h): VNode {
    return h("topbar");
  }

  renderMain(h): VNode {
    return h(
      "div",
      {
        class: {
          "rz-tree-map__main": true
        }
      },
      [this.renderTree(h), this.renderMap(h)]
    );
  }

  render(createElement): VNode {
    return createElement(
      "div",
      {
        class: {
          "rz-tree-map": true
        }
      },
      [this.renderTopbar(createElement), this.renderMain(createElement)]
    );
  }
}
</script>
