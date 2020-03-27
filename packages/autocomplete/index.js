
// 编写 autocomplete 组件
import autocomplete from './src/index.vue';

/* istanbul ignore next */
autocomplete.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + autocomplete.options.name, autocomplete);
};

export default autocomplete;
