// 编写 breadcrumbItem 组件
import breadcrumbItem from "../breadcrumb/src/BreadcrumbItem.vue";

/* istanbul ignore next */
breadcrumbItem.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component("Rz" + breadcrumbItem.options.name, breadcrumbItem);
};

export default breadcrumbItem;
