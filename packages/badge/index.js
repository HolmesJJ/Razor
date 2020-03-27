
// 编写 badge 组件
import badge from './src/index.vue';

/* istanbul ignore next */
badge.install = function(Vue) {
  Vue.component('Rz' + badge.options.name, badge);
};

export default badge;
