// 编写 onOff 组件
import NotificationPlus from './src/index.vue';

/* istanbul ignore next */
NotificationPlus.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + NotificationPlus.options.name, NotificationPlus);
};

export default NotificationPlus;
