// 编写 table 组件
import table from './src/index.vue';

/* istanbul ignore next */
table.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + table.options.name, table);
};

export default table;
