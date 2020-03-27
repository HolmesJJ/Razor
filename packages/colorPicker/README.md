### ColorPicker 颜色选择器

:::demo
```html
<template>
<span style="padding:0 16px;">颜色选择</span>
<rz-color-picker :data="list" @change="handleChange"></rz-color-picker>

<span style="padding:0 16px;">默认已选选项</span>
<rz-color-picker :select-value="selectValue" :data="list" @change="handleChange"></rz-color-picker>

<span style="padding:0 16px;">默认选中第一个</span>
<rz-color-picker select-first-default :data="list" @change="handleChange"></rz-color-picker>
</template>
<script>
export default {
  data(){
    return {
      list:[
        {label: '不限', value: '-1',color:''},
        {label: '蓝色', value: '1',color:'blue'},
        {label: '红色', value: '2',color:'red'},
        {label: '绿色', value: '3',color:'green'},
        {label: '橙色', value: '4',color:'orange'},
        {label: '灰色', value: '5',color:'gray'},
        {label: '白色', value: '6',color:'white'},
        {label: '紫色', value: '7',color:'purple'},
        {label: '黄色', value: '8',color:'yellow'},
        {label: '天蓝色', value: '9',color:'skyblue'},
      ],
      selectValue: '9'
    }
  },
  methods:{
    handleChange(value){
      console.log(value)
    }
  }
}

</script>
```
:::
### Digit Attributes
| 参数                 | 说明                                  | 类型    | 可选值      | 默认值 |
| -------------------- | ------------------------------------- | ------- | ----------- | ------ |
| data                 | 必填                                  | array   | []          | —      |
| select-value         | 非必填, 已选项                        | string  | -           | —      |
| select-first-default | 非必填, 是否默认选中第一个, 默认false | boolean | true, false | —      |
| unlimited-value      | 非必填, [不限] 选项的value设定           | string  | -           | '-1'   |