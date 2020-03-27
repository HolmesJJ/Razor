import Slider from './src/index.vue';

/* istanbul ignore next */
Slider.install = function(Vue) {
  Vue.component('Rz' + Slider.options.name, Slider);
};

export default Slider;

