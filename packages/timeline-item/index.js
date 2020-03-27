
// 编写 timeline-item 组件
import timelineItem from './src/index.vue';

/* istanbul ignore next */
timelineItem.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + timelineItem.options.name, timelineItem);
};

export default timelineItem;
