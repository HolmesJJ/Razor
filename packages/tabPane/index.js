import TabPane from '../tabs/src/tab-pane.vue';

/* istanbul ignore next */
TabPane.install = function(Vue) {
  Vue.component('Rz' + TabPane.options.name, TabPane);
};

export default TabPane;

