
// 编写 dropdownMenu 组件
import dropdownMenu from './src/index.vue';

/* istanbul ignore next */
dropdownMenu.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + dropdownMenu.options.name, dropdownMenu);
};

export default dropdownMenu;
