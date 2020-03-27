import Tree from './src/index.vue';

/* istanbul ignore next */
Tree.install = function(Vue) {
  Vue.component('Rz' + Tree.options.name, Tree);
};

export default Tree;

