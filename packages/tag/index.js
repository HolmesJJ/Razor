// 编写 tag 组件
import tag from './src/index.vue';

/* istanbul ignore next */
tag.install = function(Vue) {
  Vue.component('Rz' + tag.name, tag);
};

export default tag;
