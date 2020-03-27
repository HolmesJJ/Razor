
// 编写 counter 组件
import counter from './src/index.vue';

/* istanbul ignore next */
counter.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + counter.options.name, counter);
};

export default counter;
