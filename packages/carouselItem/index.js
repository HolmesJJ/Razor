
// 编写 carouselItem 组件
import carouselItem from './src/index.vue';

/* istanbul ignore next */
carouselItem.install = function(Vue) {
  Vue.component('Rz' + carouselItem.options.name, carouselItem);
};

export default carouselItem;
