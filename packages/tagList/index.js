
// 编写 tagList 组件
import tagList from './src/index.vue';

/* istanbul ignore next */
tagList.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + tagList.options.name, tagList);
};

export default tagList;
