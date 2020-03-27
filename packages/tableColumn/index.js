// 编写 tableColumn 组件
import tableColumn from './src/index';

/* istanbul ignore next */
tableColumn.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + tableColumn.options.name, tableColumn);
};

export default tableColumn;
