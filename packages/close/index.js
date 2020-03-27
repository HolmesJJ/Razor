
// 编写 close 组件
import close from './src/index.vue';

/* istanbul ignore next */
close.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + close.options.name, close);
};

export default close;
