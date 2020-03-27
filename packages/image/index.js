// 编写 image 组件
import MyImage from './src/index.vue';

/* istanbul ignore next */
MyImage.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + 'Image', MyImage);
};

export default MyImage;
