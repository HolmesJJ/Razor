// 编写 imageEditor 组件
import imageEditor from './src/index.vue';

/* istanbul ignore next */
imageEditor.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + imageEditor.options.name, imageEditor);
};

export default imageEditor;
