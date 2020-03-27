import Checkbox from './src/index.vue';

/* istanbul ignore next */
Checkbox.install = function(Vue) {
  Vue.component('Rz' + Checkbox.options.name, Checkbox);
};

export default Checkbox;

