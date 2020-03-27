// 编写 selectDropdown 组件
import selectDropdown from './src/index.vue';

/* istanbul ignore next */
selectDropdown.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + selectDropdown.options.name, selectDropdown);
};

export default selectDropdown;
