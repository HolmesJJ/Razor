// 编写 transfer 组件
import transfer from './src/index.vue';

/* istanbul ignore next */
transfer.install = function(Vue) {
  Vue.component('Rz' + transfer.options.name, transfer);
};

export default transfer;
