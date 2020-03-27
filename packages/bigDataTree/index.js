// 编写 bigDataTree 组件
import bigDataTree from "./src/index.vue";

/* istanbul ignore next */
bigDataTree.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component("Rz" + bigDataTree.options.name, bigDataTree);
};

export default bigDataTree;
