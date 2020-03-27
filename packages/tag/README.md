<script>
  export default {
    data() {
      return {
        tags: [
          { name: '标签一', type: '' },
          { name: '标签二', type: 'success' },
          { name: '标签三', type: 'info' },
          { name: '标签四', type: 'warning' },
          { name: '标签五', type: 'danger' }
        ],
        dynamicTags: ['标签一', '标签二', '标签三'],
        inputVisible: false,
        inputValue: '',
        list:[
          {label: "something 1"},
          {label: "something 2"},
          {label: "something 3"},
          {label: "something 4"},
          {label: "something 5"},
        ],
        selectList:[
          {label: "something 1"}
        ],
        selectListBackup:[
           {label: "something 1"}
        ],
        list1:[
          {label: "something 1"},
          {label: "something 2"},
          {label: "something 3"},
          {label: "something 4"},
          {label: "something 5"},
        ],
        selectList1:[
          {label: "something 1"}
        ],
        selectListBackup1:[
           {label: "something 1"}
        ]
      };
    },
    methods: {
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      change({ tag, selectList }){
        this.selectList = selectList;
        this.$message({message:JSON.stringify(this.selectList)})
      },
      resetList(){
        this.list = [
          {label: "something 1"},
          {label: "something 2"},
          {label: "something 3"},
          {label: "something 4"},
          {label: "something 5"},
        ],
        this.selectList = [
          ...this.selectListBackup
        ];
      },
      confirm(){
        this.$message({message:JSON.stringify(this.selectList)})
      },
      changeList(){
        this.selectList = [{label: "something 3"},];
        this.selectListBackup = [{label: "something 3"},];
        this.list  = [ 
          {label: "something 2"},
          {label: "something 3"},
          {label: "something 4"},
        ]
      },
      setSelectList(){
        this.selectList = [
          {label: "something 1"},
          {label: "something 2"},
          {label: "something 3"},
          {label: "something 4"},
          {label: "something 5"},
        ]
      },
      clearSelect(){
        this.selectList = [];
      },
      change1({ tag, selectList }){
        this.selectList1 = selectList;
        this.$message({message:JSON.stringify(this.selectList)})
      },
      resetList1(){
        this.selectList1 = [
          ...this.selectListBackup
        ];
      },
      confirm1(){
        this.$message({message:JSON.stringify(this.selectList1)})
      },
      changeList1(){
        this.selectList1 = [{label: "something 3"},];
        this.selectListBackup1 = [{label: "something 3"},];
        this.list1  = [ 
          {label: "something 2"},
          {label: "something 3"},
          {label: "something 4"},
        ]
      },
      clearSelect1(){
        this.selectList1 = [];
      }
    },
  }
</script>

<style>
  .demo-box.demo-tag {
    .rz-tag + .rz-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding: 0 *;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
  }
</style>

## Tag 标签

用于标记和选择。

### 基础用法

:::demo 由`type`属性来选择 tag 的类型，也可以通过`color`属性来自定义背景色。

```html
<rz-tag>常用</rz-tag>
<rz-tag type="lighter">布控</rz-tag>
<rz-tag type="info">银行</rz-tag>

<div style="height: 16px;"></div>

<rz-tag type="colorful">比中</rz-tag>
<rz-tag type="colorful" top>右上角</rz-tag>

<div style="height: 16px;"></div>

<rz-tag type="success">策略</rz-tag>
<rz-tag type="warning">布控</rz-tag>
<rz-tag type="danger">人群</rz-tag>
```

:::

### 不同尺寸

Tag 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的按钮尺寸。

:::demo 额外的尺寸：`medium`、`small`、`mini`，通过设置`size`属性来配置它们。

```html
<rz-tag>默认</rz-tag>
<rz-tag size="medium">中等</rz-tag>
<rz-tag size="small">小型</rz-tag>

<div style="height: 16px;"></div>

<rz-tag size="large">长标签</rz-tag>
<rz-tag size="large">很长很长很长的标签内容</rz-tag>
```

:::

### Plain 样式的 tag

Tag 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的按钮尺寸。

:::demo 额外的尺寸：`medium`、`small`、`mini`，通过设置`size`属性来配置它们。

```html
<rz-tag type="plain">plain 标签</rz-tag>
<rz-tag size="small" type="plain">小型 plain 标签</rz-tag>
```

:::

### 可移除标签

:::demo 设置`closable`属性可以定义一个标签是否可移除。默认的标签移除时会附带渐变动画，如果不想使用，可以设置`disable-transitions`属性，它接受一个`Boolean`，true 为关闭。

```html
<template>
  <div>
    <rz-tag size="huge" closable>高新园四路</rz-tag>
    <rz-tag size="huge" closable>黑色上衣</rz-tag>
    <rz-tag size="huge" closable>白色短裤</rz-tag>

    <div style="height: 20px;"></div>

    <rz-tag v-for="tag in tags" :key="tag.name" closable :type="tag.type">
      {{tag.name}}
    </rz-tag>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tags: [
          { name: '标签一', type: '' },
          { name: '标签二', type: 'success' },
          { name: '标签三', type: 'info' },
          { name: '标签四', type: 'warning' },
          { name: '标签五', type: 'danger' }
        ]
      };
    }
  };
</script>
```

:::

### 动态编辑标签

动态编辑标签可以通过点击标签关闭按钮后触发的 `close` 事件来实现

:::demo

```html
<rz-tag
  :key="tag"
  v-for="tag in dynamicTags"
  closable
  :disable-transitions="false"
  @close="handleClose(tag)"
>
  {{tag}}
</rz-tag>
<rz-input
  class="input-new-tag"
  v-if="inputVisible"
  v-model="inputValue"
  ref="saveTagInput"
  size="mini"
  @keyup.enter.native="handleInputConfirm"
  @blur="handleInputConfirm"
>
</rz-input>
<rz-button v-else class="button-new-tag" size="mini" @click="showInput"
  >+ New Tag</rz-button
>

<style lang="scss">
  .rz-tag + .rz-tag {
    margin-left: 16px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    margin-top: 10px;
    vertical-align: bottom;
  }
</style>

<script>
  export default {
    data() {
      return {
        dynamicTags: ['标签一', '标签二', '标签三'],
        inputVisible: false,
        inputValue: ''
      };
    },
    methods: {
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
    }
  };
</script>
```

:::

### 标签列表

多选型
:::demo

```html
<template>
  <div>
    <rz-tag-list
      :data="list"
      :selectList="selectList"
      @change="change"
    ></rz-tag-list>
    <div style="padding:10px;">
      <rz-button type="primary" @click="confirm">确定</rz-button>
      <rz-button type="info" @click="resetList">取消</rz-button>
      <rz-button type="default" @click="changeList">请求list</rz-button>
    </div>
    <div style="padding:10px;">
      <rz-button @click="resetList">重置</rz-button>
      <rz-button type="warning" @click="clearSelect">清空已选</rz-button>
      <rz-button type="success" @click="setSelectList">全选</rz-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list: [
          { label: 'something 1' },
          { label: 'something 2' },
          { label: 'something 3' },
          { label: 'something 4' },
          { label: 'something 5' }
        ],
        selectList: [{ label: 'something 1' }],
        selectListBackup: [{ label: 'something 1' }]
      };
    },
    methods: {
      change({ tag, selectList }) {
        this.selectList = selectList;
        this.$message({ message: JSON.stringify(this.selectList) });
      },
      resetList() {
        this.selectList = [{ label: 'something 1', id: 1 }];
      },
      confirm() {
        this.$message({ message: JSON.stringify(this.selectList) });
      },
      changeList() {
        this.selectList = [{ label: 'something else' }];
        this.list = [{ label: 'something else' }, { label: 'something' }];
      },
      setSelectList() {
        this.selectList = [
          { label: 'something 1' },
          { label: 'something 2' },
          { label: 'something 3' },
          { label: 'something 4' },
          { label: 'something 5' }
        ];
      },
      clearSelect() {
        this.selectList = [];
      }
    }
  };
</script>
```

:::

### 标签列表

单选
:::demo

```html
<template>
  <div>
    <rz-tag-list
      :data="list1"
      mode="radio"
      :selectList="selectList1"
      @change="change1"
    ></rz-tag-list>
    <div style="padding:10px;">
      <rz-button type="primary" @click="confirm1">确定</rz-button>
      <rz-button type="info" @click="resetList1">取消</rz-button>
      <rz-button type="default" @click="changeList1">请求list</rz-button>
    </div>
    <div style="padding:10px;">
      <rz-button type="warning" @click="clearSelect1">清空已选</rz-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        list1: [
          { label: 'something 1' },
          { label: 'something 2' },
          { label: 'something 3' },
          { label: 'something 4' },
          { label: 'something 5' }
        ],
        selectList1: [{ label: 'something 1' }],
        selectListBackup1: [{ label: 'something 1' }]
      };
    },
    methods: {
      change1({ tag, selectList }) {
        this.selectList = selectList;
        this.$message({ message: JSON.stringify(this.selectList) });
      },
      resetList1() {
        this.selectList = [{ label: 'something else' }];
      },
      confirm1() {
        this.$message({ message: JSON.stringify(this.selectList) });
      },
      changeList1() {
        this.selectList = [{ label: 'something else' }];
        this.list = [{ label: 'something else' }, { label: 'something' }];
      },
      clearSelect1() {
        this.selectList = [];
      }
    }
  };
</script>
```

:::

### Attributes

| 参数                | 说明                                     | 类型    | 可选值                      | 默认值 |
| ------------------- | ---------------------------------------- | ------- | --------------------------- | ------ |
| type                | 主题                                     | string  | success/info/warning/danger | —      |
| closable            | 是否可关闭                               | boolean | —                           | false  |
| disable-transitions | 是否禁用渐变动画                         | boolean | —                           | false  |
| hit                 | 是否有边框描边                           | boolean | —                           | false  |
| color               | 背景色                                   | string  | —                           | —      |
| size                | 尺寸                                     | string  | medium / small / mini       | —      |
| popover-disable     | popover 可用状态(只在 size = large 使用) | boolean | true /false                 | false  |
| popover-delay       | popover 延迟显示时间                     | number  | 0~                          | 200    |

### Events

| 事件名称 | 说明                  | 回调参数 |
| -------- | --------------------- | -------- |
| close    | 关闭 Tag 时触发的事件 | —        |

### tag-list Attributes

| 参数          | 说明                      | 类型        | 可选值 | 默认值 |
| ------------- | ------------------------- | ----------- | ------ | ------ |
| data          | 要渲染的数据列表          | array obj[] | -      | []     |
| selectList    | 已选的项                  | array obj[] | —      | []     |
| labelKey      | 可选项 ,渲染 label 的 key | string      | —      | []     |
| idKey         | 可选项 唯一 id 的 key     | string      | —      | []     |
| popover-delay | popover 延迟显示时间      | number      | 0~     | 200    |


### tag-list Events

| 事件名称 | 说明          | 回调参数                                                    |
| -------- | ------------- | ----------------------------------------------------------- |
| change   | 选择 tag 触发 | { tag, selectList } tag: 当前操作 tag, selectList: 已选列表 |
