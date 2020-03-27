### SearchInput 搜索输入框

### 基本用法

:::demo

```html
<div class="search-input-wrapper">
  <rz-search-input
    v-model="keyword1"
    :options="options"
    :placeholder="placeholder[selectedIndex]"
    @search="handleSearchClicked"
    @clear="handleKeywordCleared"
    @change="handleInputChange"
    @input="handleInput"
    @focus="handleFocus"
    @blur="handleBlur"
    @select-change="handleSelectChange"
  ></rz-search-input>
</div>

<div class="search-input-wrapper">
  <rz-search-input
    v-model="keyword2"
    :placeholder="singlePlaceholder"
    @search="handleSearchClicked"
    @clear="handleKeywordCleared"
    @change="handleInputChange"
    @input="handleInput"
    @focus="handleFocus"
    @blur="handleBlur"
  ></rz-search-input>
</div>

<div class="search-input-wrapper">
  <rz-search-input
    :disabled="true"
    :round="false"
    size="large"
    v-model="keyword3"
    :options="options"
    :placeholder="placeholder[selectedIndex1]"
    @search="handleSearchClicked"
    @clear="handleKeywordCleared"
    @change="handleInputChange"
    @input="handleInput"
    @focus="handleFocus"
    @blur="handleBlur"
    @select-change="handleSelectChange1"
  ></rz-search-input>
</div>

<div class="search-input-wrapper">
  <rz-search-input
    :round="false"
    size="large"
    v-model="keyword4"
    :placeholder="singlePlaceholder"
    @search="handleSearchClicked"
    @clear="handleKeywordCleared"
    @change="handleInputChange"
    @input="handleInput"
    @focus="handleFocus"
    @blur="handleBlur"
  ></rz-search-input>
</div>

<div class="search-input-wrapper is-focusActive">
  <rz-search-input
    v-model="keyword5"
    :options="options"
    :placeholder="placeholder[selectedIndex]"
    :focusActive="true"
    @search="handleSearchClicked"
    @clear="handleKeywordCleared"
    @change="handleInputChange"
    @input="handleInput"
    @focus="handleFocus"
    @blur="handleBlur"
    @select-change="handleSelectChange"
  ></rz-search-input>
</div>

<script>
  export default {
    data() {
      return {
        options: [
          {
            value: "1",
            label: "搜任务"
          },
          {
            value: "2",
            label: "搜告警"
          }
        ],
        placeholder: {
          0: "搜任务的placeholder",
          1: "搜告警的placeholder"
        },
        keyword1: "默认搜索文字",
        keyword2: "",
        keyword3: "test",
        keyword4: "",
        keyword5: "",
        selectedIndex: 0,
        selectedIndex1: 0,
        singlePlaceholder: "请输入身份证ID"
      };
    },
    methods: {
      handleSearchClicked: function(data) {
        console.log("search clicked", data);
      },
      handleKeywordCleared: function() {
        console.log("keyword cleared");
      },
      handleInputChange: function(newValue) {
        console.log("change", newValue);
      },
      handleInput: function(newValue) {
        console.log("input", newValue);
      },
      handleFocus: function(event) {
        console.log("focus", event);
      },
      handleBlur: function(event) {
        console.log("blur", event);
      },
      handleSelectChange: function(key) {
        console.log("select change", key);
        this.selectedIndex = key;
      },
      handleSelectChange1: function(key) {
        console.log("select change", key);
        this.selectedIndex1 = key;
      }
    }
  };
</script>
```

<style>
.search-input-wrapper {
  width: 320px;
  margin-bottom: 20px;
}
.search-input-wrapper.is-focusActive {
  border-top: 1px solid #56668d;
  border-bottom: 1px solid #56668d;
  padding: 8px;
  box-sizing: border-box;
}
</style>

:::

### Search Input Attributes

| 参数                                 | 说明                              | 类型    | 可选值 | 默认值   |
| ------------------------------------ | --------------------------------- | ------- | ------ | -------- |
| placeholder                          | input 部分的 placeholder          | string  | —      | 空字符串 |
| round                                | 是否全圆角                        | boolean | —      | true     |
| size                                 | input 的大小                      | string  | —      | ''       |
| disabled                             | 控制可用状态                      | boolean | —      | false    |
| show-search                          | 控制搜索按钮                      | boolean | —      | true     |
| inputValue（已废弃, 请使用 v-model） | input 部分默认显示的内容          | string  | —      | 无       |
| focusActive                          | 是否在 focus 状态下才显示背景颜色 | boolean | —      | false    |
| default-option                       | 控制默认选项                      | number  | —      | 0        |

### Search Input Events

| 事件名称      | 说明                                     | 回调参数                  |
| ------------- | ---------------------------------------- | ------------------------- |
| search        | 可清空的单选模式下用户点击清空按钮时触发 | 当前的数据                |
| clear         | 当 input 被清除的时候触发                | 当前的数据                |
| blur          | 失去焦点时触发                           | (event: Event)            |
| focus         | 获得焦点时触发                           | (event: Event)            |
| change        | 值改变时触发                             | (value: string \| number) |
| input         | 值改变立刻触发                           | (value: string \| number) |
| select-change | 菜单选择改变时触发                       | 选择的 options 的 index   |
