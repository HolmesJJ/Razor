<style>
  .demo-block .rz-on-off {
    margin: 20px 20px 20px 0;
  }
</style>

<script>
  export default {
    data() {
      return {
        value1: true,
        value2: false,
        value3: true,
        value4: true,
        value5: '100',
        value6: true,
        value7: false,
        value8: true,
        value9: true,
      }
    }
  };
</script>

## Switch 开关

表示两种相互对立的状态间的切换，多用于触发「开/关」。

### 基本用法

:::demo 绑定`v-model`到一个`Boolean`类型的变量。可以使用`active-color`属性与`inactive-color`属性来设置开关的背景色。

```html
<rz-on-off v-model="value1"></rz-on-off>
<rz-on-off v-model="value2"> </rz-on-off>

<script>
  export default {
    data() {
      return {
        value1: true,
        value2: false
      };
    }
  };
</script>
```

:::

### 文字描述

:::demo 使用`active-text`属性与`inactive-text`属性来设置开关的文字描述。

```html
<rz-on-off v-model="value3" active-text="按月付费" inactive-text="按年付费">
</rz-on-off>

<script>
  export default {
    data() {
      return {
        value3: true
      };
    }
  };
</script>
```

:::

### 扩展的 value 类型

:::demo 设置`active-value`和`inactive-value`属性，接受`Boolean`, `String`或`Number`类型的值。

```html
<rz-tooltip :content="'Switch value: ' + value5" placement="top">
  <rz-on-off v-model="value5" active-value="100" inactive-value="0">
  </rz-on-off>
</rz-tooltip>

<script>
  export default {
    data() {
      return {
        value5: "100"
      };
    }
  };
</script>
```

:::

### Text 类型开关

:::demo active-text 会在左边，inactive-text 在右边。

```html
<rz-on-off
  v-model="value9"
  active-text="图片"
  inactive-text="视频源"
  type="text"
>
</rz-on-off>

<rz-on-off
  v-model="value9"
  active-text="图片"
  inactive-text="视频源"
  type="text"
  :disabled="true"
>
</rz-on-off>

<script>
  export default {
    data() {
      return {
        value9: true
      };
    }
  };
</script>
```

:::

### 禁用 和 loading 状态

:::demo 设置`disabled`属性，接受一个`Boolean`，设置`true`即可禁用。

```html
<rz-on-off v-model="value6" disabled> </rz-on-off>
<rz-on-off v-model="value7" disabled> </rz-on-off>
<rz-on-off v-model="value8" loading> </rz-on-off>
<script>
  export default {
    data() {
      return {
        value6: true,
        value7: false
      };
    }
  };
</script>
```

:::

### 自定义 active 以及 inactive 颜色

:::demo

```html
<rz-on-off
  style="display: block"
  v-model="value4"
  active-color="#13ce66"
  inactive-color="#ff4949"
  active-text="按月付费"
  inactive-text="按年付费"
>
</rz-on-off>

<script>
  export default {
    data() {
      return {
        value4: true
      };
    }
  };
</script>
```

:::

### Attributes

| 参数                | 说明                                                          | 类型                      | 可选值 | 默认值  |
| ------------------- | ------------------------------------------------------------- | ------------------------- | ------ | ------- |
| disabled            | 是否禁用                                                      | boolean                   | —      | false   |
| loading             | 是否为 loading 状态,loading 会导致 disabled 生效              | boolean                   | —      | false   |
| width               | switch 的宽度（像素）                                         | number                    | —      | 40      |
| active-icon-class   | switch 打开时所显示图标的类名，设置此项会忽略 `active-text`   | string                    | —      | —       |
| inactive-icon-class | switch 关闭时所显示图标的类名，设置此项会忽略 `inactive-text` | string                    | —      | —       |
| active-text         | switch 打开时的文字描述                                       | string                    | —      | —       |
| inactive-text       | switch 关闭时的文字描述                                       | string                    | —      | —       |
| active-value        | switch 打开时的值                                             | boolean / string / number | —      | true    |
| inactive-value      | switch 关闭时的值                                             | boolean / string / number | —      | false   |
| active-color        | switch 打开时的背景色                                         | string                    | —      | #409EFF |
| inactive-color      | switch 关闭时的背景色                                         | string                    | —      | #C0CCDA |
| name                | switch 对应的 name 属性                                       | string                    | —      | —       |

### Events

| 事件名称 | 说明                            | 回调参数   |
| -------- | ------------------------------- | ---------- |
| change   | switch 状态发生变化时的回调函数 | 新状态的值 |

### Methods

| 方法名 | 说明               | 参数 |
| ------ | ------------------ | ---- |
| focus  | 使 Switch 获取焦点 | -    |
