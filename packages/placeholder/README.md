### Placeholder 占位

<style lang="scss" scoped>
  .placeholder-demo{
    background: rgba(#56668d, 0.5)
  }
  .divide{
    border-top: 1px solid rgba(#d5d5d5, 0.5);
  }
</style>
:::demo 
```html
<template>
  <div class="placeholder-demo">
    <rz-placeholder></rz-placeholder>
    <div class="divide"></div>
    <rz-placeholder :empty-text="'自定义占位文字'"></rz-placeholder>
    <div class="divide"></div>
    <rz-placeholder :background-image="backgroundImage" :empty-text="'自定义占位图片'"></rz-placeholder>
  </div>
</template>
<script>
const backgroundImage = require('./image/custom.png')
export default{
  data(){
    return{
      backgroundImage,
    }
  }
}
</script>
```
:::

### Placeholder Attributes
| 参数            | 说明                      | 默认值 |
| --------------- | ------------------------- | ------ |
| backgroundImage | 占位图的路径              | ''     |
| emptyText       | 占位图的文字              | ''     |
| customStyle     | 容器的style 定制 object   | {}     |
| backgroundStyle | 占位图的style 定制 object | {}     |