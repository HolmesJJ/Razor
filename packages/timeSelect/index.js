// 编写 timeSelect 组件
import timeSelect from '../datePicker/src/picker/time-select';

/* istanbul ignore next */
timeSelect.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + timeSelect.options.name, timeSelect);
};

export default timeSelect;
