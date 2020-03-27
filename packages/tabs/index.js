// 编写 tabs 组件
import Tabs from './src/index.vue';

/* istanbul ignore next */
Tabs.install = function(Vue) {
  Vue.component('Rz' + Tabs.options.name, Tabs);
};

export default Tabs;
