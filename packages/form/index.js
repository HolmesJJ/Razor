// 编写 form 组件
import form from './src/index.vue';

/* istanbul ignore next */
form.install = function(Vue) {
  Vue.component('Rz' + form.options.name, form);
};

export default form;
