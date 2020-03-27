// 编写 PolygonDrawer 组件
import PolygonDrawer from './src/index.vue';

/* istanbul ignore next */
PolygonDrawer.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + PolygonDrawer.options.name, PolygonDrawer);
};

export default PolygonDrawer;
