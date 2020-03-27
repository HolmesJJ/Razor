
// 编写 annulus 组件
import annulus from './src/index.js';

/* istanbul ignore next */
annulus.install = function(Vue) {
  Vue.component('Rz' + annulus.options.name, annulus);
};

export default annulus;
