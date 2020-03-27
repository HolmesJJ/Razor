
// 编写 upload 组件
import upload from './src/index.vue';

/* istanbul ignore next */
upload.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + upload.options.name, upload);
};

export default upload;
