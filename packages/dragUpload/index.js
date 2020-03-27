
// 编写 dragUpload 组件
import dragUpload from './src/index.vue';

/* istanbul ignore next */
dragUpload.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + dragUpload.options.name, dragUpload);
};

export default dragUpload;
