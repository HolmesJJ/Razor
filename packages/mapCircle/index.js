// 编写 mapCircle 组件
import MapCircle from '../sMap/src/components/circle/index.vue';

/* istanbul ignore next */
MapCircle.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + MapCircle.options.name, MapCircle);
};

export default MapCircle;
