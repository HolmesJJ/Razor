<style>
  .demo-block .rz-progress--line {
      margin-bottom: 15px;
      width: 350px;
  }
  .demo-block .rz-progress--circle {
    margin-right: 15px;
  }
</style>

## Progress 进度条

用于展示操作进度，告知用户当前状态和预期。

### 线形进度条 — 百分比外显

:::demo Progress 组件设置`percentage`属性即可，表示进度条对应的百分比，**必填**，必须在 0-100。

```html
<rz-progress :percentage="70"></rz-progress>
<rz-progress :percentage="80" color="#4DA971"></rz-progress>
<rz-progress :percentage="100" status="success"></rz-progress>
<rz-progress :percentage="60" status="warning"></rz-progress>
<rz-progress :percentage="50" status="exception"></rz-progress>
<rz-progress :percentage="80" outer-background="transparent" status="colorful" :show-text="false"></rz-progress>
```
:::

### 线形进度条 — 百分比内显

百分比不占用额外控件，适用于文件上传等场景。

:::demo Progress 组件可通过 `stroke-width` 属性更改进度条的高度，并可通过 `text-inside` 属性来将进度条描述置于进度条内部。

```html
<rz-progress :text-inside="true" :stroke-width="18" :percentage="0"></rz-progress>
<rz-progress :text-inside="true" :stroke-width="18" :percentage="70"></rz-progress>
<rz-progress :text-inside="true" :stroke-width="18" :percentage="80" status="warning"></rz-progress>
<rz-progress :text-inside="true" :stroke-width="18" :percentage="100" status="success"></rz-progress>
<rz-progress :text-inside="true" :stroke-width="18" :percentage="50" status="exception"></rz-progress>
```
:::

### 环形进度条

:::demo Progress 组件可通过 `type` 属性来指定使用环形进度条，在环形进度条中，还可以通过 `width` 属性来设置其大小。

```html
<rz-progress type="circle" :percentage="0"></rz-progress>
<rz-progress type="circle" :percentage="25"></rz-progress>
<rz-progress type="circle" :percentage="80" status="warning"></rz-progress>
<rz-progress type="circle" :percentage="100" status="success"></rz-progress>
<rz-progress type="circle" :percentage="50" status="exception"></rz-progress>
```
:::

### Attributes
| 参数           | 说明                                                  | 类型    | 可选值            | 默认值 |
| -------------- | ----------------------------------------------------- | ------- | ----------------- | ------ |
| **percentage** | **百分比（必填）**                                    | number  | 0-100             | 0      |
| type           | 进度条类型                                            | string  | line/circle       | line   |
| stroke-width   | 进度条的宽度，单位 px                                 | number  | —                | 6      |
| text-inside    | 进度条显示文字内置在进度条内（只在 type=line 时可用） | boolean | —                | false  |
| status         | 进度条当前状态                                        | string  | success/exception | —     |
| color          | 进度条背景色（会覆盖 status 状态颜色）                | string  | —                | —     |
| width          | 环形进度条画布宽度（只在 type=circle 时可用）         | number  |                   | 126    |
| show-text      | 是否显示进度条文字内容                                | boolean | —                | true   |
