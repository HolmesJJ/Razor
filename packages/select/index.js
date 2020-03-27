import Select from './src/index.vue';

/* istanbul ignore next */
Select.install = function(Vue) {
  Vue.component('Rz' + Select.options.name, Select);
};

export default Select;

