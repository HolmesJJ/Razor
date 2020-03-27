import { Vue } from "vue-property-decorator";
import Vuex from "vuex";
import cloneDeep from "lodash/cloneDeep";

Vue.use(Vuex);

const initState = {
  maxCount: 0,
  selectedCount: 0, // 已选视频源个数
  cameraType: 0, // 视频源类型
  clickedNode: "",
  hoveredNode: {},
  treeSelectChangeNode: {
    select: false,
    node: []
  },
  mapSelectChangeNode: {
    select: false,
    node: []
  }
};

const store = new Vuex.Store({
  state: cloneDeep(initState),
  getters: {
    getMaxCount: state => state.maxCount,
    getSelectedCount: state => state.selectedCount,
    getCameraType: state => state.cameraType,
    getClickedNode: state => state.clickedNode,
    getHoveredNode: state => state.hoveredNode,
    // getSelectChangeNode: state => state.selectChangeNode,
    getTreeSelectChangeNode: state => state.treeSelectChangeNode,
    getMapSelectChangeNode: state => state.mapSelectChangeNode
  },
  mutations: {
    reset: () => store.replaceState(cloneDeep(initState)),
    setMaxCount: (state, count) => (state.maxCount = count),
    addSelectedCount: (state, addCount) => {
      if (addCount + state.selectedCount > state.maxCount) {
        state.selectedCount = state.maxCount;
      } else {
        state.selectedCount += addCount;
      }
    },
    cutSelectedCount: (state, cutCount) => {
      if (state.selectedCount - cutCount < 0) {
        state.selectedCount = 0;
      } else {
        state.selectedCount -= cutCount;
      }
    },
    setSelectedCount: (state, count) => (state.selectedCount = count),
    setCameraType: (state, type) => (state.cameraType = type),
    setClickedNode: (state, node) => (state.clickedNode = node),
    setHoveredNode: (state, node) => (state.hoveredNode = node),
    // setSelectChangeNode: (state, change) => {
    //   state.selectChangeNode = change;
    // },
    setTreeSelectChangeNode: (state, change) => {
      state.treeSelectChangeNode = change;
    },
    setMapSelectChangeNode: (state, change) => {
      state.mapSelectChangeNode = change;
    }
  }
});

export default store;
