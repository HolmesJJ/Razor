// 编写 icon 组件
import icon from './src/index.vue';

/* istanbul ignore next */
icon.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + icon.options.name, icon);
};

export default icon;
