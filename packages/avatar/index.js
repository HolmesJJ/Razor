
// 编写 avatar 组件
import avatar from './src/index.vue';

/* istanbul ignore next */
avatar.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + avatar.options.name, avatar);
};

export default avatar;
