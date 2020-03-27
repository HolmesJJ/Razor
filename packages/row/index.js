// 编写 row 组件
import row from './src/main';

/* istanbul ignore next */
row.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + row.options.name, row);
};

export default row;
