// 编写 uploadMask 组件
import uploadMask from './src/index.vue';

/* istanbul ignore next */
uploadMask.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + uploadMask.options.name, uploadMask);
};

export default uploadMask;
