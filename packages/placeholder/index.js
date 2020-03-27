
// 编写 placeholder 组件
import placeholder from './src/index.vue';

/* istanbul ignore next */
placeholder.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + placeholder.options.name, placeholder);
};

export default placeholder;
