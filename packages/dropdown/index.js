import Dropdown from './src/index.vue';

/* istanbul ignore next */
Dropdown.install = function(Vue) {
  Vue.component('Rz' + Dropdown.options.name, Dropdown);
};

export default Dropdown;

