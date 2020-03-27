
// 编写 massTreeMap 组件
import massTreeMap from './src/index.vue';

/* istanbul ignore next */
massTreeMap.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + massTreeMap.options.name, massTreeMap);
};

export default massTreeMap;
