
### WaterMarker

:::demo

```html
<template>
    <div class="demo-container">
      <rz-input type="primary" v-model="content"></rz-input>
      <br/>
      <br/>
      <rz-button type="primary" @click="visible = true">打开防拍水印</rz-button>
      <rz-button type="primary" @click="visible = false">关闭防拍水印</rz-button>
      <rz-button type="primary" @click="allowDelete = !allowDelete;">{{`${allowDelete ? '允许' : '不允许'}关闭或删除节点`}}</rz-button>
      <rz-WaterMark 
        :visible="visible"
        :allowDelete="allowDelete"
        :content="content"
        :font="'normal normal 400 normal 20px / normal Arial, 微软雅黑'"
      ></rz-WaterMark>
      
    <div>
</template>
<script>
export default {
  data(){
    return {
      visible: false,
      content: 'admin-系统管理员',
      allowDelete: true,
    }
  },
}
</script>
```

:::


### Attributes

| 参数           | 说明             | 类型   | 可选值 | 默认值 |
| -------------   | ---------------- | ------ | ------ | -------- |
| visible         | 是否显示           | boolean | —    | false    |
| content       | 水印内容          |  string | —      | 防拍水印    |      
| color           | 水印颜色          |  string | —      | rgba(66, 133, 244, 0.4)    |               
| font           | 水印字体属性          |  string | —      | getComputedStyle(document.body).font |               
| allowDelete  | 是否允许通过js或开发者工具等途径修改水印DOM节点（水印的id，attribute属性，节点的删除）| boolean | —    | true    |

