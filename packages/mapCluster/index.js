// 编写 mapCluster 组件
import MapCluster from '../sMap/src/components/cluster/index.vue';

/* istanbul ignore next */
MapCluster.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + MapCluster.options.name, MapCluster);
};

export default MapCluster;
