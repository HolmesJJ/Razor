<script lang="ts">
import { VNode } from "vue";
import { Vue, Component, Prop } from "vue-property-decorator";

import Topbar from "./Topbar.vue";
import MassTree from "pkg/massTree";
import MapSelector from "./MapSelector.vue";
import Emitter from "rz/mixins/emitter";

import store from "../service/store";

@Component({
  name: "MassTreeMap",
  components: {
    Topbar,
    MassTree,
    MapSelector,
  },
  mixins: [Emitter],
})
export default class MassTreeMap extends Vue {
  readonly broadcast!: (componentName: string, eventName: string, params: any) => void;

  @Prop() treeProps: any;

  @Prop() mapProps: any;

  @Prop(Array) cameraTypeOptions: { value: string | number; label: string }[];

  @Prop({
    type: Boolean,
    default: false,
  })
  selectAll: boolean;

  @Prop({
    type: Boolean,
    default: true,
  })
  editable: boolean;

  @Prop({
    type: [String, Number]
  })
  defaultType: string | number;

  refTree: MassTree;

  refMap: any;

  isSearch: boolean = false;

  mapCenter: [number, number] = this.mapProps.center;

  mapZoom: number = this.mapProps.zoom;

  clickedCamera: string = "";

  /* lifecycle */
  mounted() {
    this.refTree = this.$refs.tree;
    this.refMap = this.$refs.map;
    this.isSearch = this.refTree.isSearch;
  }

  beforeDestroy() {
    this.clickedCamera = "";
    this.destroy();
  }

  async loadSearchTreeData(data) {
    try {
      await this.refTree.loadSearchTreeData(data);
      this.$emit("loaded");
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /* apis */
  async loadData(data) {
    // 先清空之前的 marker
    this.refMap.destroyMap();
    try {
      await this.refTree.loadData(data);
      await this.refMap.loadData(data);

      this.$emit("loaded");
    } catch (err) {
      return Promise.reject(err);
    }
  }

  getTree() {
    return this.refTree.getTree();
  }

  getSelectedLeaf() {
    return this.refTree.getSelectedLeaf();
  }

  getAllLeafId(): string[] {
    return this.refTree.getAllLeafId();
  }

  setSelect(ids: string[], select: boolean) {
    store.commit("setSelectedCount", 0);
    this.refTree.setSelect(ids, select);
    this.refMap.updateCluster(ids, select);
    this.commitSelectCount(ids.length, select);
  }

  // 暂时舍弃
  selectNLeaf(n: number) {
    // this.refTree.selectNLeaf(n);
  }

  destroy() {
    store.commit("reset");
    this.refTree.destroyTree();
    this.refMap.destroyMap();
  }

  /* handlers */
  handleSelectChange(event) {
    const { select, node } = event;

    // update cluster
    const ids = node.map(n => n.resourceSerial);
    this.refMap.updateCluster(ids, select);

    const count = node.length;
    this.$emit("select-change", event);
  }

  commitSelectCount(count, select) {
    if (select) {
      store.commit("addSelectedCount", count);
    } else {
      store.commit("cutSelectedCount", count);
    }
    this.$emit("select-change", event);
  }

  handleAddSelected(data) {
    store.commit("addSelectedCount", data);
  }

  handleCutSelected(data) {
    store.commit("cutSelectedCount", data);
  }

  handleStatisticsLoaded(event) {
    const { selected, all } = event;

    if (!this.isSearch) {
      store.commit("setMaxCount", all);
      store.commit("setSelectedCount", selected);
    }

    this.$emit("statistics-loaded", event);
  }

  handleMapSelectChange({ select, selectId, selectNode }) {
    this.refTree.setSelect(selectId, select);
    this.$emit("select-change", { select, node: selectNode });
  }

  handleTreeClick(event) {
    this.$emit("tree-node-click", event);
    const node: any = event;
    const isLeaf = node.hasOwnProperty("resourceSerial");

    if (isLeaf) {
      this.flyToCamera(node);
      this.clickedCamera = node.resourceSerial;
    }
  }

  handleCameraTypeChange(event) {
    // this.refTree.clear();
    this.handleClearSelect();
    this.$emit("camera-type-change", event);
  }

  handleTreeHover(event) {
    this.$emit("tree-node-hover", event);
  }

  handleTreeLoaded() {
    this.$emit("tree-loaded");
  }

  handleZoomend(zoom) {
    this.mapZoom = zoom;
  }

  handleNodeClick(node) {
    if (!node.isLeaf) {
      const leaves = this.refTree.getLeafByNode(node);

      const points = leaves.map(leaf => [leaf.longitude, leaf.latitude]);
      this.refMap.setViewport(points);
    }
  }

  flyToCamera(camera) {
    const camearZoom = 18;
    const { longitude, latitude } = camera;
    const center: [number, number] = [longitude, latitude];
    this.mapCenter = center;
    this.mapZoom = camearZoom;
    this.broadcast("MapSelector", "show-tooltip", {});
  }

  handleMapZoomin() {
    if (this.mapZoom >= this.mapProps.maxZoom) {
      return;
    }
    this.mapZoom++;
  }

  handleMapZoomout() {
    if (this.mapZoom <= this.mapProps.minZoom) {
      return;
    }
    this.mapZoom--;
  }

  handleClearSelect() {
    store.commit("setSelectedCount", 0);
    this.refTree.clear();
    this.refMap.clearCluster();
  }

  handleSearch(searchData: { searchKeyword: string; searchType: string }) {
    this.$emit("search", searchData);
  }

  /* renders */
  renderTree(h): VNode {
    const defaultProps = {
      allowSearch: true,
      allowSelect: true,
      showStatistics: true,
      icon: { node: "", leaf: "iconvideo" },
      expandLevel: 1,
    };
    return h(
      "div",
      {
        class: {
          "rz-tree-map__tree": true,
        },
      },
      [
        h("mass-tree", {
          ref: "tree",
          props: {
            ...Object.assign(defaultProps, this.treeProps),
          },
          on: {
            "select-change": this.handleSelectChange,
            "statistics-loaded": this.handleStatisticsLoaded,
            "add-selected": this.handleAddSelected,
            "cut-selected": this.handleCutSelected,
            "node-click": this.handleNodeClick,
            click: this.handleTreeClick,
            hover: this.handleTreeHover,
            search: this.handleSearch,
            loaded: this.handleTreeLoaded,
          },
        }),
      ],
    );
  }

  renderMap(h): VNode {
    const mapProps = Object.assign(this.mapProps, {
      center: this.mapCenter,
      zoom: this.mapZoom,
      clickedNodeSerial: this.clickedCamera,
    });
    return h(
      "div",
      {
        class: { "rz-tree-map__map": true },
      },
      [
        h("map-selector", {
          ref: "map",
          props: {
            editable: this.editable,
            ...mapProps,
          },
          on: {
            "select-change": this.handleMapSelectChange,
            "clear-select": this.handleClearSelect,
            zoomend: this.handleZoomend,
            "map-zoom-in": this.handleMapZoomin,
            "map-zoom-out": this.handleMapZoomout,
          },
        }),
      ],
    );
  }

  renderTopbar(h): VNode {
    return h("topbar", {
      props: {
        editable: this.editable,
        cameraTypeOptions: this.cameraTypeOptions,
        defaultType: this.defaultType,
      },
      on: {
        "camera-type-change": this.handleCameraTypeChange,
      },
    });
  }

  renderMain(h): VNode {
    return h(
      "div",
      {
        class: {
          "rz-tree-map__main": true,
        },
      },
      [this.renderTree(h), this.renderMap(h)],
    );
  }

  render(h): VNode {
    return h(
      "div",
      {
        class: {
          "rz-tree-map": true,
        },
      },
      [this.renderTopbar(h), this.renderMain(h)],
    );
  }
}
</script>
