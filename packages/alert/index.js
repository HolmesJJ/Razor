
// 编写 alert 组件
import Alert from './src/index.vue';

/* istanbul ignore next */
Alert.install = function(Vue) {
  Vue.component('Rz' + Alert.options.name, Alert);
};

export default Alert;
