// 编写 mapDrawingTools 组件
import MapDrawingTools from '../sMap/src/components/drawingtools/index.vue';

/* istanbul ignore next */
MapDrawingTools.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + MapDrawingTools.options.name, MapDrawingTools);
};

export default MapDrawingTools;
