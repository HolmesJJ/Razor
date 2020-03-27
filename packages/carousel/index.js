
// 编写 carousel 组件
import carousel from './src/index.vue';

/* istanbul ignore next */
carousel.install = function(Vue) {
  Vue.component('Rz' + carousel.options.name, carousel);
};

export default carousel;
