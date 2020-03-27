
// 编写 sImage 组件
import sImage from './src/index.vue';

/* istanbul ignore next */
sImage.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + sImage.options.name, sImage);
};

export default sImage;
