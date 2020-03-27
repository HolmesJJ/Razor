// 编写 scrollbar 组件
import scrollbar from './src/main';

/* istanbul ignore next */
scrollbar.install = function(Vue) {
  Vue.component('Rz' + scrollbar.options.name, scrollbar);
};

export default scrollbar;
