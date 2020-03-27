import Scroller from './src/index.vue';
import directive from './directive';

/* istanbul ignore next */
Scroller.install = function(Vue) {
  Vue.directive(directive.name, directive);
  Vue.component('Rz' + Scroller.options.name, Scroller);
};

Scroller.directive = directive;

export default Scroller;

