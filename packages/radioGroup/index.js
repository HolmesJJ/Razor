// 编写 radioGroup 组件
import radioGroup from './src/index.vue';

/* istanbul ignore next */
radioGroup.install = function(Vue) {
  Vue.component('Rz' + radioGroup.options.name, radioGroup);
};

export default radioGroup;
