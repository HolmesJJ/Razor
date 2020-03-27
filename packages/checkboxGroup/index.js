
// 编写 checkboxGroup 组件
import checkboxGroup from './src/index.vue';

/* istanbul ignore next */
checkboxGroup.install = function(Vue) {
  Vue.component('Rz' + checkboxGroup.options.name, checkboxGroup);
};

export default checkboxGroup;
