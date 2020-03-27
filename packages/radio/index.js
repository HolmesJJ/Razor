// 编写 radio 组件
import radio from './src/index.vue';

/* istanbul ignore next */
radio.install = function(Vue) {
  Vue.component('Rz' + radio.options.name, radio);
};

export default radio;
