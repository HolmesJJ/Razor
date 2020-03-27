
// 编写 colorfulBall 组件
import colorfulBall from './src/index.vue';

/* istanbul ignore next */
colorfulBall.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + colorfulBall.options.name, colorfulBall);
};

export default colorfulBall;
