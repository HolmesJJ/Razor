### Spinner

<style>
.demo-block .demo-spinner{
  margin: 0 auto;
}
</style>

### 基础用法

:::demo 
``` html
<div class="block" style="text-align:center;padding: 10px 0;">
  <rz-spinner class="demo-spinner" :stroke-color="'#68CDFA'" :stroke-width="0.3" :radius="500"></rz-spinner>
</div>

<script>
  
</script>
```
:::

### props
| 参数         | 说明                                         | 类型    | 可选值 | 默认值  |
| ------------ | -------------------------------------------- | ------- | ------ | ------- |
| radius       | 指定节点标签为节点对象的某个属性值           | number  | —     | 100     |
| stroke-width | 指定子树为节点对象的某个属性值               | number  | —     | 5       |
| stroke-color | 指定节点选择框是否禁用为节点对象的某个属性值 | string, | —     | #efefef |