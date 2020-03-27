// 编写 image 组件
import image from './src/index.vue';

/* istanbul ignore next */
image.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + image.options.name, image);
};

export default image;
