
// 编写 breadcrumb 组件
import breadcrumb from './src/index.vue';

/* istanbul ignore next */
breadcrumb.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + breadcrumb.options.name, breadcrumb);
};

export default breadcrumb;
