### Annulus
圆环

:::demo 
```html
<template>
<rz-annulus
  :visible="svgVisible"
  :size="610"
  :configs="configs"
  :activeIndex.sync="activeIdentifier"
  @complete="hanldleComplete"
  @change="handleAnnulusChange"
/>
</template>

<script>
export default {
  data () {
    return {
      svgVisible: false,
      configs: [
        {
          size: 406,
          space: 14,
          strokeWidth: 17,
          options: [
            { value: 10, activeIndex: "161" },
            { value: 20, activeIndex: "171" },
            { value: 30, activeIndex: "181" },
            { value: 40, activeIndex: "191" },
          ],
        },
        {
          size: 470,
          space: 14,
          strokeWidth: 17,
          options: [
            { value: 100, activeIndex: "162" },
            { value: 200, activeIndex: "172" },
            { value: 300, activeIndex: "182" },
          ],
        },
        {
          size: 534,
          space: 14,
          strokeWidth: 17,
          options: [
            { value: 100, activeIndex: "163" },
            { value: 200, activeIndex: "173" },
            { value: 300, activeIndex: "183" },
          ],
        },
      ],
      activeIdentifier: "",
    };
  },
  mounted () {
    this.svgVisible = true;
  },
  methods: {
    handleAnnulusChange() {},
    hanldleComplete() {
      this.activeIdentifier = "161";
    },
  }
}
</script>
```
:::

### Annulus Events

| 事件名称    | 说明                        | 回调参数                                                      |
|-------------|-----------------------------|---------------------------------------------------------------|
| complete    | 在 动画进入 结束后触发      | (event: Event)                                                |
| beforeLeave | 在 动画离开 开始时触发      | (event: Event)                                                |
| afterLeave  | 在 动画离开 结束后触发      | (event: Event)                                                |
| svgEnter    | 外层svg元素 鼠标移入 时触发 | (event: Event)                                                |
| svgLeave    | 外层svg元素 鼠标离开 时触发 | (event: Event)                                                |
| circleEnter | 圆弧元素 鼠标移入 时触发    | (item: 一个圆环数据, list: 当前圆弧数据, index: 当前圆环索引) |
| circleLeave | 圆弧元素 鼠标离开 时触发    | (item: 一个圆环数据, list: 当前圆弧数据, index: 当前圆环索引) |
| change      | 在 圆弧点击 时触发          | (value: string \|number)                                      |

### Attributes

| 参数              | 说明                    | 类型            | 可选值 | 默认值            |
|-------------------|-------------------------|-----------------|--------|-------------------|
| size              | 最外层svg大小           | number          | —      | 500               |
| visible           | 是否显示                | boolean         | —      | —                 |
| configs           | 参数配置对象            | array           | —      | —                 |
| duration          | 动画过渡时间            | number          | —      | 0.8               |
| activeIndex       | 选中圆弧标识符          | number / string | —      | —                 |
| activeData        | 选中圆弧数据            | object          | —      | {}                |
| activeStroke      | 选中圆弧颜色            | string          | —      | rgb(25, 205, 254) |
| activeStrokeWidth | 选中圆弧宽度            | number          | —      | 45                |
| filterEmptyValue  | 是否过滤value为空的数据 | boolean         | —      | true              |
