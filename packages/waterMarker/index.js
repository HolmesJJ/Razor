
// 编写 WaterMarker 组件
import WaterMarker from './src/index.vue';

/* istanbul ignore next */
WaterMarker.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + WaterMarker.options.name, WaterMarker);
};

export default WaterMarker;
