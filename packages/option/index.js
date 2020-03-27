// 编写 option 组件
import option from './src/index.vue';

/* istanbul ignore next */
option.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + option.options.name, option);
};

export default option;
