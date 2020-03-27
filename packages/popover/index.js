import Popover from './src/index.vue';
import directive from './src/directive';
import Vue from 'vue';

Vue.directive('popover', directive);
/* istanbul ignore next */
Popover.install = function(Vue) {
  Vue.directive('popover', directive);
  Vue.component('Rz' + Popover.options.name, Popover);
};

export default Popover;

