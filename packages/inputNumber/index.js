// 编写 InputNumber 组件
import InputNumber from './src/index.vue';

/* istanbul ignore next */
InputNumber.install = function(Vue) {
  Vue.component('Rz' + InputNumber.options.name, InputNumber);
};

export default InputNumber;
