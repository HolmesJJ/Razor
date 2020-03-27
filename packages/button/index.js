import Button from './src/index.vue';

/* istanbul ignore next */
Button.install = function(Vue) {
  Vue.component('Rz' + Button.options.name, Button);
};

export default Button;

