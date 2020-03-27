// 编写 radioButton 组件
import radioButton from './src/index.vue';

/* istanbul ignore next */
radioButton.install = function(Vue) {
  Vue.component('Rz' + radioButton.options.name, radioButton);
};

export default radioButton;
