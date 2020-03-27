import Input from './src/index.vue';

/* istanbul ignore next */
Input.install = function(Vue) {
  Vue.component('Rz' + Input.options.name, Input);
};

export default Input;

