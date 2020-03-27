
// 编写 rtspPlayer 组件
import rtspPlayer from './src/index.vue';

/* istanbul ignore next */
rtspPlayer.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + rtspPlayer.options.name, rtspPlayer);
};

export default rtspPlayer;
