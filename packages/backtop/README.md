### Backtop
返回页面顶部的操作按钮

### 基础用法
滑动页面即可看到右下方的按钮。

:::demo

```html
<template>
  滚动到底部可以看到 Backtop 按钮<br/>
  Scroll down to see the bottom-right button. 
  <rz-backtop target=".rz-scrollbar .rz-scrollbar__wrap" :icon-class="'iconfont iconfont icon-toTop'" :visibility-height="50">
    <!-- <span style="font-size:12px;">
    回到顶部
    </span> -->
  </rz-backtop>
  <rz-card style="font-size: 16px; padding:50px;text-align:center; height:600px;">
    触发滚动
  </rz-card>
</template>
```
:::

<style scoped>
  .share-button {
    width: 36px;
    padding: 10px;
  }

  .mark {
    margin-top: 8px;
    line-height: 1;
    float: right;
  }

  .clearfix {
    @utils-clearfix;
  }

  .item {
    margin-right: 40px;
  }
</style>

### Attributes
| 参数              | 说明                             | 类型   | 可选值 | 默认值 |
| ----------------- | -------------------------------- | ------ | ------ | ------ |
| target            | 触发滚动的对象                   | string | —      | —      |
| visibility-height | 滚动高度达到此参数值才出现       | number | —      | 200    |
| right             | 控制其显示位置, 距离页面右边距   | number | —      | 40     |
| bottom            | 控制其显示位置, 距离页面底部距离 | number | —      | 40     |
| icon-class            | 控制其显示图标 | string | —      |     |

		