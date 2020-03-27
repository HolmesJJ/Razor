### Digit

digit 组件  用来作为数字动画<br/>
通过设置 number  设置目标数字<br/>
通过设置 duration  动画时间 单位是毫秒 <br/>
通过设置 filterFlag 设置是否需要缩写时间<br/>
通过设置 format 设置是否需要千分位分隔符<br/>
通过设置 delay 设置执行延后的时间<br/>
<script>
  export default {
    data(){
      return {
        duration: 3000,
        number1: 100000,
        number2: 100000 * Math.random(),
        number3: 95.24,
        number4: 1000000000 * Math.random(),
      }
    }
  }
</script>
<style lang="scss" scoped>
.digit-demo{
  i {
    font-size: 32px;
    margin: 0 20px;
    display: inline-block;
  }
}
</style>
:::demo
```html
<template>
  <div class="digit-demo">
    <rz-digit :number="number1" :duration="duration" :fliter-flag="false"></rz-digit>
    <rz-digit :number="number2" :duration="duration"></rz-digit>
    <rz-digit :number="number3" :duration="duration" :fliter-flag="false">%</rz-digit>
    <rz-digit :number="number4" :duration="duration" :delay="1500"></rz-digit>
  </div>
</template>
<style lang="scss" scoped>
.digit-demo{
  i {
    font-size: 32px;
    margin: 0 20px;
    display: inline-block;
  }
}
</style>

```
:::

### Digit Attributes
| 参数        | 说明                              | 类型    | 可选值      | 默认值 |
|-------------|-----------------------------------|---------|-------------|--------|
| number      | 必填                              | number  | 0-n         | —      |
| duration    | 非必填 ,默认1000 ms 动画时长      | number  | 0-n         | —      |
| filter-flag | 非必填 ,默认true                  | boolean | true, false | —      |
| format      | 非必填 ,默认true                  | boolean | true, false | —      |
| delay       | 非必填 ,默认 0                    | number  | 0           | —      |
| emptyText   | number不存在或小于等于0时显示内容 | string  | -           | - -    |