// 编写 mapPolygon 组件
import MapPolygon from '../sMap/src/components/polygon/index.vue';

/* istanbul ignore next */
MapPolygon.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + MapPolygon.options.name, MapPolygon);
};

export default MapPolygon;
