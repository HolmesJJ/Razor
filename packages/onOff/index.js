// 编写 onOff 组件
import onOff from './src/index.vue';

/* istanbul ignore next */
onOff.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + onOff.options.name, onOff);
};

export default onOff;
