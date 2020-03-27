
// 编写 colorPicker 组件
import colorPicker from './src/index.vue';

/* istanbul ignore next */
colorPicker.install = function(Vue) {
  Vue.component('Rz' + colorPicker.options.name, colorPicker);
};

export default colorPicker;
