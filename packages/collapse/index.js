
// 编写 collapse 组件
import collapse from './src/index.vue';

/* istanbul ignore next */
collapse.install = function(Vue) {
  Vue.component('Rz' + collapse.options.name, collapse);
};

export default collapse;
