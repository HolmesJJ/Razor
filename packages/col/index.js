
// 编写 col 组件
import col from './src/main';

/* istanbul ignore next */
col.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + col.options.name, col);
};

export default col;
