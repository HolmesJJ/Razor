### Breadcrumb

### 基础用法

:::demo

```html
<template>
  <rz-breadcrumb :backward="true" :items="items"> </rz-breadcrumb>
</template>

<script>
  export default {
    data() {
      return {
        items: [
          {
            route: {
              path: "/"
            },
            label: "一级页面"
          },
          {
            route: {
              path: "/breadcrumb"
            },
            label: "二级页面"
          }
        ]
      };
    }
  };
</script>
```

:::

### Attributes

| 参数         | 说明                               | 类型                                                                                                                                                                         | 可选值 | 默认值 |
| ------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------ |
| seperator    | 分隔符（返回操作的分隔符是固定的） | string                                                                                                                                                                       | -      | /      |
| backward     | 是否显示后退操作                   | boolean                                                                                                                                                                      | -      | false  |
| backwardText | 后退操作的文案                     | string                                                                                                                                                                       | -      | 返回   |
| items        | 面包屑对象                         | Arrary 对象， 对象内容: {route: VueRoute, icon: string, label: string}, route 为 VueRoute 对象，先根据 route.name 来判断当前路由，如果没有传 name 属性，则根据 path 属性判断 | -      | -      |

### Events

| 事件名  | 说明           |
| ------- | -------------- |
| go-back | 点击返回时触发 |
