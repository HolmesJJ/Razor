
// 编写 card 组件
import card from './src/index.vue';

/* istanbul ignore next */
card.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + card.options.name, card);
};

export default card;
