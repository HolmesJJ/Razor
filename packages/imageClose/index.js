
// 编写 imageClose 组件
import imageClose from './src/index.vue';

/* istanbul ignore next */
imageClose.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + imageClose.options.name, imageClose);
};

export default imageClose;
