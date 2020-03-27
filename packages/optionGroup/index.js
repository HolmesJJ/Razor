// 编写 optionGroup 组件
import optionGroup from './src/index.vue';

/* istanbul ignore next */
optionGroup.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + optionGroup.options.name, optionGroup);
};

export default optionGroup;
