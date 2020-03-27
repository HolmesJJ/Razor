// 编写 mapHeatmap 组件
import mapHeatmap from "../sMap/src/components/heatmap/index.vue";

/* istanbul ignore next */
mapHeatmap.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component("Rz" + mapHeatmap.options.name, mapHeatmap);
};

export default mapHeatmap;
