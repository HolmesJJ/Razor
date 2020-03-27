
// 编写 mapTool 组件
import mapTool from './src/index.vue';

/* istanbul ignore next */
mapTool.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + mapTool.options.name, mapTool);
};

export default mapTool;
