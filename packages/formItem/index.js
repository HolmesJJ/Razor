// 编写 formItem 组件
import formItem from './src/index.vue';

/* istanbul ignore next */
formItem.install = function(Vue) {
  Vue.component('Rz' + formItem.options.name, formItem);
};

export default formItem;
