
// 编写 collapseItem 组件
import collapseItem from './src/index.vue';

/* istanbul ignore next */
collapseItem.install = function(Vue) {
  Vue.component('Rz' + collapseItem.options.name, collapseItem);
};

export default collapseItem;
