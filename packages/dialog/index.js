
// 编写 dialog 组件
import dialog from './src/index.vue';

/* istanbul ignore next */
dialog.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + dialog.options.name, dialog);
};

export default dialog;
