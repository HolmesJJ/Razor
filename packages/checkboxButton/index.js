
// 编写 checkboxButton 组件
import checkboxButton from './src/index.vue';

/* istanbul ignore next */
checkboxButton.install = function(Vue) {
  Vue.component('Rz' + checkboxButton.options.name, checkboxButton);
};

export default checkboxButton;
