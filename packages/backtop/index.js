
// 编写 backtop 组件
import backtop from './src/index.vue';

/* istanbul ignore next */
backtop.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + backtop.options.name, backtop);
};

export default backtop;
