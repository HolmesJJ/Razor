
// 编写 timeline 组件
import timeline from './src/index.vue';

/* istanbul ignore next */
timeline.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + timeline.options.name, timeline);
};

export default timeline;
