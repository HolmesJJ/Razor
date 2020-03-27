
// 编写 scrollBox 组件
import scrollBox from './src/index.vue';

/* istanbul ignore next */
scrollBox.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + scrollBox.options.name, scrollBox);
};

export default scrollBox;
