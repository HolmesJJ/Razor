// 编写 searchInput 组件
import SearchInput from './src/index.vue';

/* istanbul ignore next */
SearchInput.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + SearchInput.options.name, SearchInput);
};

export default SearchInput;
