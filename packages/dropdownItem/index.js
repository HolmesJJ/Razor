
// 编写 dropdownItem 组件
import dropdownItem from './src/index.vue';

/* istanbul ignore next */
dropdownItem.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + dropdownItem.options.name, dropdownItem);
};

export default dropdownItem;
