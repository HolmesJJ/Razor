// 编写 mapPolyline 组件
import MapPolyline from '../sMap/src/components/polyline/index.vue';

/* istanbul ignore next */
MapPolyline.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + MapPolyline.options.name, MapPolyline);
};

export default MapPolyline;
