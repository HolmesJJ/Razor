import ButtonGroup from '../button/src/buttonGroup';

/* istanbul ignore next */
ButtonGroup.install = function(Vue) {
  Vue.component('rz' + ButtonGroup.options.name, ButtonGroup);
};

export default ButtonGroup;
