// 编写 steps 组件
import steps from './src/index.vue';

/* istanbul ignore next */
steps.install = function(Vue) {
  Vue.component('Rz' + steps.options.name, steps);
};

export default steps;
