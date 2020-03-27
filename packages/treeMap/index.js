
// 编写 treeMap 组件
import treeMap from './src/index.vue';

/* istanbul ignore next */
treeMap.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + treeMap.options.name, treeMap);
};

export default treeMap;
