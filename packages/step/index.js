// 编写 step 组件
import step from './src/index.vue';

/* istanbul ignore next */
step.install = function(Vue) {
  Vue.component('Rz' + step.options.name, step);
};

export default step;
