// 编写 MapCanvasLayer 组件
import MapCanvasLayer from '../sMap/src/components/canvasLayer/index.vue';

/* istanbul ignore next */
MapCanvasLayer.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + MapCanvasLayer.options.name, MapCanvasLayer);
};

export default MapCanvasLayer;
