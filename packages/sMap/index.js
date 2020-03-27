// 编写 map 组件
import SMap from './src/index.vue';

/* istanbul ignore next */
SMap.install = function(Vue) {
  Vue.component('Rz' + SMap.options.name, SMap);
};

export default SMap;
