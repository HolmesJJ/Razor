
// 编写 dashedCircle 组件
import dashedCircle from './src/index.vue';

/* istanbul ignore next */
dashedCircle.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + dashedCircle.options.name, dashedCircle);
};

export default dashedCircle;
