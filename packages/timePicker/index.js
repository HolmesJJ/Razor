import TimePicker from '../datePicker/src/picker/time-picker';

/* istanbul ignore next */
TimePicker.install = function(Vue) {
  Vue.component('Rz' + TimePicker.options.name, TimePicker);
};

export default TimePicker;
