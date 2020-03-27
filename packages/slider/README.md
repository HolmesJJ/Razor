<script>
  export default {
    data() {
      return {
        step:0.1,
        value1: 0,
        value2: 50,
        value3: 36,
        value4: 48,
        value5: 42,
        value6: 0,
        value7: 0,
        value8: 10,
        value9: [34, 80],
        value13: [70, 70],
        value10: 20,
        value11: [20,80],
        value12: 30,
        value13: 18,
      };
    },
    methods: {
      formatTooltip(val) {
        return `${val / 100} 这里写一点什么`;
      },
      formatTooltip8(value){
        return `${value}%`
      }
    }
  }
</script>

<style>
  .demo-box.demo-slider .source {
    padding: 0;
  }

  .slider-block {
    padding: 30px 24px;
    overflow: hidden;
  }

  .demo-box.demo-slider .demonstration {
    font-size: 14px;
    color: #8492a6;
    line-height: 44px;
  }

  .demo-box.demo-slider .demonstration + .rz-slider {
    float: right;
    width: 70%;
    margin-right: 20px;
  }
</style>

## Slider 滑块

通过拖动滑块在一个固定区间内进行选择

### 基础用法

在拖动滑块时，显示当前值

:::demo 通过设置绑定值自定义滑块的初始值

```html
<template>
  <div class="slider-block">
    <span class="demonstration">默认</span>
    <rz-slider v-model="value1" :step="0.1"></rz-slider>
  </div>
  <div class="slider-block">
    <span class="demonstration">自定义初始值</span>
    <rz-slider v-model="value2"></rz-slider>
  </div>
  <div class="slider-block">
    <span class="demonstration">隐藏 Tooltip</span>
    <rz-slider v-model="value3" :show-tooltip="false"></rz-slider>
  </div>
  <div class="slider-block">
    <span class="demonstration">格式化 Tooltip</span>
    <rz-slider v-model="value4" :format-tooltip="formatTooltip"></rz-slider>
  </div>
  <div class="slider-block">
    <span class="demonstration">禁用</span>
    <rz-slider v-model="value5" disabled></rz-slider>
  </div>

  <div class="slider-block">
    <span class="demonstration">显示刻度尺  
      <br/>
      50是实际中位值<br/>
      25 指的是50 在Slider 中刻度的位置 ，如图 的刻度50的位置<br/>
      配置 [50, 25] 对应的中位刻度显示位置刻度数字安全显示的最小容器宽度为230px</span>
    <rz-slider :calibration-arr="[50, 25]" :step="0.1" :format-tooltip="formatTooltip8" v-model="value13"></rz-slider>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value1: 0,
        value2: 50,
        value3: 36,
        value4: 48,
        value5: 42,
        value13: 18,
      };
    },
    methods: {
      formatTooltip(val) {
        return `${val / 100}这里些什么`;
      }
    }
  };
</script>
```

:::

### 离散值

选项可以是离散的

:::demo 改变`step`的值可以改变步长，通过设置`show-step`属性可以显示间断点

```html
<template>
  <div class="slider-block">
    <span class="demonstration">不显示间断点</span>
    <rz-slider v-model="value6" :step="10"> </rz-slider>
  </div>
  <div class="slider-block">
    <span class="demonstration">显示间断点</span>
    <rz-slider v-model="value7" :step="10" show-stops> </rz-slider>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value6: 0,
        value7: 0
      };
    }
  };
</script>
```

:::

### 带有输入框

通过输入框设置精确数值

:::demo 设置`show-input`属性会在右侧显示一个输入框

```html
<template>
  <div class="slider-block">
    <rz-slider
      v-model="value8"
      :formatTooltip="formatTooltip8"
      show-input
      direction="toRight"
    ></rz-slider>
    <rz-slider
      v-model="value12"
      :formatTooltip="formatTooltip8"
      :step="step"
      :calibration-arr="[50, 25]"
      step-strictly
      show-input
    ></rz-slider>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value8: 10,
        value12: 30,
        step: 0.1
      };
    },
    methods: {
      formatTooltip8(value) {
        return `${value}%`;
      }
    }
  };
</script>
```

:::

### 范围选择

支持选择某一数值范围

:::demo 设置`range`即可开启范围选择，此时绑定值是一个数组，其元素分别为最小边界值和最大边界值

```html
<template>
  <div class="slider-block">
    <rz-slider :calibration-arr="[50, 25]" :step="1" v-model="value9" range> </rz-slider>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value9: [34, 80],
      };
    }
  };
</script>
```

:::

### 竖向模式

:::demo 设置`vertical`可使 Slider 变成竖向模式，此时必须设置高度`height`属性

```html
<template>
  <div class="slider-block">
    <rz-slider v-model="value10" vertical height="200px"> </rz-slider>
    <br />
    <br />
    <rz-slider v-model="value11" vertical height="200px" range> </rz-slider>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value10: 20,
        value11: [20, 80]
      };
    }
  };
</script>
```

:::

### Attributes

| 参数                | 说明                                                      | 类型            | 可选值                        | 默认值 |
| ------------------- | --------------------------------------------------------- | --------------- | ----------------------------- | ------ |
| min                 | 最小值                                                    | number          | —                             | 0      |
| max                 | 最大值                                                    | number          | —                             | 100    |
| disabled            | 是否禁用                                                  | boolean         | —                             | false  |
| step                | 步长                                                      | number          | —                             | 1      |
| show-input          | 是否显示输入框，仅在非范围选择时有效                      | boolean         | —                             | false  |
| input-size          | 输入框的尺寸                                              | string          | large / medium / small / mini | small  |
| show-stops          | 是否显示间断点                                            | boolean         | —                             | false  |
| show-tooltip        | 是否显示 tooltip                                          | boolean         | —                             | true   |
| format-tooltip      | 格式化 tooltip message                                    | function(value) | —                             | —      |
| range               | 是否为范围选择                                            | boolean         | —                             | false  |
| vertical            | 是否竖向模式                                              | boolean         | —                             | false  |
| height              | Slider 高度，竖向模式时必填                               | string          | —                             | —      |
| label               | 屏幕阅读器标签                                            | string          | —                             | —      |
| debounce            | 输入时的去抖延迟，毫秒，仅在`show-input`等于 true 时有效  | number          | —                             | 300    |
| tooltip-class       | tooltip 的自定义类名                                      | string          | —                             | —      |
| step-strictly       | 严格检查 input 小数点后的位数                             | boolean         | —                             | false  |
| custom-runway-style | slider runway 的定制样式                                  | object          | —                             | {}     |
| direction           | 滑块滚动方向，根据 SC4.0 的需求，目前默认设置成从右往左滑 | string          | toRight, toLeft               | toLeft |

### Events

| 事件名称 | 说明                                               | 回调参数   |
| -------- | -------------------------------------------------- | ---------- |
| change   | 值改变时触发（使用鼠标拖曳时，只在松开鼠标后触发） | 改变后的值 |
