// 编写 spinner 组件
import spinner from './src/index.vue';

/* istanbul ignore next */
spinner.install = function(Vue) {
  Vue.component('Rz' + spinner.options.name, spinner);
};

export default spinner;
