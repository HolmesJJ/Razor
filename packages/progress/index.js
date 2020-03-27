// 编写 progress 组件
import progress from './src/index.vue';

/* istanbul ignore next */
progress.install = function(Vue) {
  Vue.component('Rz' + progress.options.name, progress);
};

export default progress;
