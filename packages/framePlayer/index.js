
// 编写 framePlayer 组件
import framePlayer from './src/index.vue';

/* istanbul ignore next */
framePlayer.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + framePlayer.options.name, framePlayer);
};

export default framePlayer;
