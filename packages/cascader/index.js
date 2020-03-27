// 编写 cascader 组件
import Cascader from './src/index.vue';

/* istanbul ignore next */
Cascader.install = function(Vue) {
  Vue.component('Rz' + Cascader.options.name, Cascader);
};

export default Cascader;
