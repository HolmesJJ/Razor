<style>
  .demo-block .rz-row{
    margin-bottom: 20px;
  }
</style>

### BUTTON 按钮

### 主要使用按钮

:::demo

```html
<div style="padding:20px;">
  <rz-row>主要按钮</rz-row>
  <rz-row>
    <rz-button size="large" type="primary">大按钮</rz-button>
    <rz-button size="large" disabled type="primary">大按钮</rz-button>
  </rz-row>

  <rz-row>次要按钮</rz-row>
  <rz-row>
    <rz-button size="large" type="info">大按钮</rz-button>
    <rz-button size="large" disabled type="info">大按钮</rz-button>
  </rz-row>
</div>
```

:::

### 主要使用小按钮

:::demo

```html
<div style="padding:20px;">
  <rz-row>主要按钮</rz-row>
  <rz-row>
    <rz-button type="primary">小按钮</rz-button>
    <rz-button disabled type="primary">小按钮</rz-button>
  </rz-row>

  <rz-row>次要按钮</rz-row>
  <rz-row>
    <rz-button type="info">小按钮</rz-button>
    <rz-button disabled type="info">小按钮</rz-button>
  </rz-row>
</div>
```

:::

圆形按钮的简单用法

:::demo 使用`type`、`plain`、`round`和`circle`属性来定义 Button 的样式。

```html
<!-- <rz-row>
  <rz-button>默认</rz-button>
  <rz-button type="primary">主要</rz-button>
  <rz-button type="success">成功</rz-button>
  <rz-button type="info">信息</rz-button>
  <rz-button type="warning">警告</rz-button>
  <rz-button type="danger">危险</rz-button>
</rz-row> -->

<rz-row>
  <rz-button type="dark" icon="rz-icon-arrow-left" circle></rz-button>
  <rz-button type="dark" icon="rz-icon-arrow-right" circle></rz-button>
  <rz-button type="dark" icon="rz-icon-arrow-up" circle></rz-button>
  <rz-button type="dark" icon="rz-icon-arrow-down" circle></rz-button>
</rz-row>

<rz-row>
  <rz-button type="dark" size="large" icon="rz-icon-arrow-left" circle></rz-button>
  <rz-button type="dark" size="large" icon="rz-icon-arrow-right" circle></rz-button>
  <rz-button type="dark" size="large" icon="rz-icon-arrow-up" circle></rz-button>
  <rz-button type="dark" size="large" icon="rz-icon-arrow-down" circle></rz-button>
</rz-row>

<!-- <rz-row>
  <rz-button round>圆角</rz-button>
  <rz-button type="primary" round>主要</rz-button>
  <rz-button type="success" round>成功</rz-button>
  <rz-button type="info" round>信息</rz-button>
  <rz-button type="warning" round>警告</rz-button>
  <rz-button type="danger" round>危险</rz-button>
</rz-row> -->

```

:::

<!-- ### 不同尺寸

Button 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的按钮尺寸。

:::demo 额外的尺寸：`medium`、`small`、`mini`，通过设置`size`属性来配置它们。

```html
<rz-row>
  <rz-button>默认按钮</rz-button>
  <rz-button size="medium">中等按钮</rz-button>
  <rz-button size="small">小型按钮</rz-button>
  <rz-button size="mini">超小按钮</rz-button>
</rz-row>
<rz-row>
  <rz-button round>默认按钮</rz-button>
  <rz-button size="medium" round>中等按钮</rz-button>
  <rz-button size="small" round>小型按钮</rz-button>
  <rz-button size="mini" round>超小按钮</rz-button>
</rz-row>
``` 

:::-->
<!-- 
### 禁用状态

不可用状态。

:::demo 你可以使用`disabled`属性来定义是否可用，它接受一个`Boolean`值。

```html
<rz-row>
  <rz-button disabled>默认</rz-button>
  <rz-button type="primary" disabled>主要</rz-button>
  <rz-button type="success" disabled>成功</rz-button>
  <rz-button type="info" disabled>信息</rz-button>
  <rz-button type="warning" disabled>警告</rz-button>
  <rz-button type="danger" disabled>危险</rz-button>
</rz-row>

<rz-row>
  <rz-button plain disabled>朴素</rz-button>
  <rz-button type="primary" plain disabled>主要</rz-button>
  <rz-button type="success" plain disabled>成功</rz-button>
  <rz-button type="info" plain disabled>信息</rz-button>
  <rz-button type="warning" plain disabled>警告</rz-button>
  <rz-button type="danger" plain disabled>危险</rz-button>
</rz-row>
<rz-row>
  <rz-button icon="rz-icon-search" circle disabled></rz-button>
  <rz-button type="primary" icon="rz-icon-search" circle disabled></rz-button>
  <rz-button type="success" icon="rz-icon-search" circle disabled></rz-button>
  <rz-button type="info" icon="rz-icon-search" circle disabled></rz-button>
  <rz-button type="warning" icon="rz-icon-search" circle disabled></rz-button>
  <rz-button type="danger" icon="rz-icon-search" circle disabled></rz-button>
</rz-row>
``` -->
### Plain按钮

:::demo
```html
<rz-row>
  <rz-button plain>朴素</rz-button>
  <rz-button type="primary" plain>主要</rz-button>
  <rz-button type="success" plain>成功</rz-button>
  <rz-button type="info" plain>信息</rz-button>
  <rz-button type="warning" plain>警告</rz-button>
  <rz-button type="danger" plain>危险</rz-button>
</rz-row>
```
:::

### 文字按钮

没有边框和背景色的按钮。

:::demo

```html
<rz-button type="text" color="primary">文字按钮</rz-button>
<rz-button type="text" icon="rz-icon-arrow-left">返回</rz-button>
<rz-button type="text" disabled>文字按钮</rz-button>
```

:::

### 图标按钮

带图标的按钮可增强辨识度（有文字）或节省空间（无文字）。

:::demo 设置`icon`属性即可，icon 的列表可以参考 Element 的 icon 组件，也可以设置在文字右边的 icon ，只要使用`i`标签即可，可以使用自定义图标。

```html
<rz-button icon="rz-icon-edit"></rz-button>
<rz-button type="success" icon="rz-icon-share"></rz-button>
<rz-button type="danger" icon="rz-icon-delete"></rz-button>
<rz-button type="primary" icon="rz-icon-search">搜索</rz-button>
<rz-button>上传<i class="rz-icon-upload rz-icon--right"></i></rz-button>
```

:::

### 按钮组

以按钮组的方式出现，常用于多项类似操作。

:::demo 使用`<rz-button-group>`标签来嵌套你的按钮。

```html
<rz-button-group>
  <rz-button type="primary" icon="rz-icon-arrow-left">上一页</rz-button>
  <rz-button type="primary"
    >下一页<i class="rz-icon-arrow-right rz-icon--right"></i
  ></rz-button>
</rz-button-group>
<rz-button-group>
  <rz-button type="primary" icon="rz-icon-edit"></rz-button>
  <rz-button type="primary" icon="rz-icon-share"></rz-button>
  <rz-button type="primary" icon="rz-icon-delete"></rz-button>
</rz-button-group>
```

:::

### 加载中

点击按钮后进行数据加载操作，在按钮上显示加载状态。

:::demo 要设置为 loading 状态，只要设置`loading`属性为`true`即可。

```html
<rz-button type="primary" :loading="true">加载中</rz-button>
```

:::

### Attributes

| 参数        | 说明           | 类型    | 可选值                                             | 默认值 |
| ----------- | -------------- | ------- | -------------------------------------------------- | ------ |
| size        | 尺寸           | string  | medium / small / mini                              | —      |
| type        | 类型           | string  | primary / success / warning / danger / info / text | —      |
| plain       | 是否朴素按钮   | boolean | —                                                  | false  |
| round       | 是否圆角按钮   | boolean | —                                                  | false  |
| circle      | 是否圆形按钮   | boolean | —                                                  | false  |
| loading     | 是否加载中状态 | boolean | —                                                  | false  |
| disabled    | 是否禁用状态   | boolean | —                                                  | false  |
| icon        | 图标类名       | string  | —                                                  | —      |
| autofocus   | 是否默认聚焦   | boolean | —                                                  | false  |
| native-type | 原生 type 属性 | string  | button / submit / reset                            | button |
