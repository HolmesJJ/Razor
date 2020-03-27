import Tooltip from './src/main';

/* istanbul ignore next */
Tooltip.install = function(Vue) {
  Vue.component('Rz' + Tooltip.options.name, Tooltip);
};

export default Tooltip;

