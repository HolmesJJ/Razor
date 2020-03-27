
// 编写 datePicker 组件
import DatePicker from './src/picker/date-picker';

/* istanbul ignore next */
DatePicker.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + DatePicker.options.name, DatePicker);
};

export default DatePicker;
