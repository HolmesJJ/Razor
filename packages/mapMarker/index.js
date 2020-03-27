// 编写 mapMarker 组件
import MapMarker from '../sMap/src/components/marker/index.vue';

/* istanbul ignore next */
MapMarker.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + MapMarker.options.name, MapMarker);
};

export default MapMarker;
