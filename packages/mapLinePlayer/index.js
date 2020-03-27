
// 编写 MapLinePlayer 组件
import MapLinePlayer from "../sMap/src/components/linePlayer/index.vue";

/* istanbul ignore next */
MapLinePlayer.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + MapLinePlayer.options.name, MapLinePlayer);
};

export default MapLinePlayer;
