<script>
  module.exports = {
    data() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return {
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        pickerOptions2: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          defaultSetting: {
            value: [start, end],
            shortcut: '最近一周'
          },
          innerShortcutsDefault: '最近一周',
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end], true);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end], true);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end], true);
            }
          }]
        },
        pickerOptions3: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          defaultSetting: {
            value: ['', ''],
            shortcut: '不限'
          },
          outerShortcutsDefault: '不限',
          outerShortcuts: [{
            text: '不限',
            onClick(picker) {
              picker.userInput = ['', ''];
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.userInput = [start, end];
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.userInput = [start, end];
            }
          }],
          shortcuts: [{
            text: '不限',
            onClick(picker) {
              picker.$emit('pick', ['', ''], true);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end], true);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end], true);
            }
          }]
        },
        value1: '',
        value2: '',
        value3: '',
        value4: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
        value5: ['', ''],
        value6: '',
        value7: '',
        value8: ''
      };
    },
    methods: {
      handleInputChange(event) {
        console.log('date-time chagne', event);
      },
      reset() {
        this.$refs.picker3.reset();
        this.value8 = '';
      },
      handleOuterChange(event) {
        console.log('outer-change', event);
      }
    }
  };
</script>

<style>
.demo-block .demo-datetime-picker{
  display:flex;
}
.demo-block .demo-datetime-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px #EFF2F6;
  flex: 1;
}
.demo-block .demo-datetime-picker .block:last-child {
  border-right: none;
}

.demo-block .demo-datetime-picker .demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>

## DateTimePicker 日期时间选择器

在同一个选择器里选择日期和时间

:::tip
DateTimePicker 由 DatePicker 和 TimePicker 派生，`Picker Options` 或者其他选项可以参照 DatePicker 和 TimePicker。
:::

### 日期和时间点

:::demo 通过设置`type`属性为`datetime`，即可在同一个选择器里同时进行日期和时间的选择。快捷选项的使用方法与 Date Picker 相同。

```html
<template>
  <div class="demo-datetime-picker">
    <div class="block">
      <span class="demonstration">默认</span>
      <rz-date-picker
        prefixIcon="iconshear"
        v-model="value1"
        type="datetime"
        placeholder="选择日期时间"
      >
      </rz-date-picker>
    </div>
    <div class="block">
      <span class="demonstration">带快捷选项</span>
      <rz-date-picker
        v-model="value2"
        type="datetime"
        placeholder="选择日期时间"
        align="right"
        :picker-options="pickerOptions1"
      >
      </rz-date-picker>
    </div>
    <div class="block">
      <span class="demonstration">设置默认时间</span>
      <rz-date-picker
        v-model="value3"
        type="datetime"
        placeholder="选择日期时间"
        default-time="12:00:00"
        :suffixIcon="false"
      >
      </rz-date-picker>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pickerOptions1: {
          shortcuts: [
            {
              text: "今天",
              onClick(picker) {
                picker.$emit("pick", new Date());
              }
            },
            {
              text: "昨天",
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit("pick", date);
              }
            },
            {
              text: "一周前",
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", date);
              }
            }
          ]
        },
        value1: "",
        value2: "",
        value3: ""
      };
    }
  };
</script>
```

:::

### 日期和时间范围

:::demo 设置`type`为`datetimerange`即可选择日期和时间范围

```html
<template>
  <div class="demo-datetime-picker">
    <div class="block">
      <span class="demonstration">默认</span>
      <rz-date-picker
        v-model="value4"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :showSuffixIcon="false"
      >
      </rz-date-picker>
    </div>
    <div class="block">
      <span class="demonstration">带快捷选项</span>
      <rz-date-picker
        prefixIcon="iconshear"
        v-model="value5"
        type="datetimerange"
        :picker-options="pickerOptions2"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      >
      </rz-date-picker>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return {
        pickerOptions2: {
          defaultSetting: {
            value: [start, end],
            shortcut: '最近一周'
          },
          innerShortcutsDefault: '最近一周',
          shortcuts: [
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        value4: [
          new Date(2000, 10, 10, 10, 10),
          new Date(2000, 10, 11, 10, 10)
        ],
        value5: [start, end],
      };
    }
  };
</script>
```

:::

### 日期和时间范围

:::demo 设置`type`为`datetimerange`即可选择日期和时间范围, 通过`pickerOptions.defaultSetting`来设置`恢复默认`的操作的值，建议其`value`和 v-model 的初始值保持一致，shortcut和 outerShortcutsDefault 或 innerShortcutsDefault 保持一致

```html
<template>
  <div class="demo-datetime-picker">
    <div class="block">
      <span class="demonstration">外部快捷选项</span>
      <rz-date-picker
        ref="picker3"
        size="medium"
        v-model="value5"
        type="datetimerange"
        :picker-options="pickerOptions3"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        @change="handleInputChange"
        @outer-change="handleOuterChange"
      >
      </rz-date-picker>

      <rz-button @click.native="reset">重置</rz-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return {
        pickerOptions3: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          defaultSetting: {
            value: ['', ''],
            shortcut: '不限'
          },
          outerShortcutsDefault: '不限',
          outerShortcuts: [{
            text: '不限',
            onClick(picker) {
              picker.userInput = ['', ''];
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.userInput = [start, end];
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.userInput = [start, end];
            }
          }],
          shortcuts: [{
            text: '不限',
            onClick(picker) {
              picker.$emit('pick', ['', ''], true);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end], true);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end], true);
            }
          }]
        },
        value5: ['', '']
      };
    },
    methods: {
      handleInputChange(event) {
        console.log("date-time chagne", event);
      }
    }
  };
</script>
```

:::

### 默认的起始与结束时刻

:::demo 使用`datetimerange`进行范围选择时，在日期选择面板中选定起始与结束的日期，默认会使用该日期的`00:00:00`作为起始与结束的时刻；通过选项`default-time`可以控制选中起始与结束日期时所使用的具体时刻。`default-time`接受一个数组，数组每项值为字符串，形如`12:00:00`，其中第一项控制起始日期的具体时刻，第二项控制结束日期的具体时刻。

```html
<template>
  <div class="demo-datetime-picker">
    <div class="block">
      <span class="demonstration">起始日期时刻为 12:00:00</span>
      <rz-date-picker
        v-model="value6"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00']"
      >
      </rz-date-picker>
    </div>
    <div class="block">
      <span class="demonstration"
        >起始日期时刻为 12:00:00，结束日期时刻为 08:00:00</span
      >
      <rz-date-picker
        v-model="value7"
        type="datetimerange"
        align="right"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00', '08:00:00']"
      >
      </rz-date-picker>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value6: "",
        value7: ""
      };
    }
  };
</script>
```

:::

### Attributes

| 参数               | 说明                                           | 类型                                        | 可选值                                                                                                                                                                            | 默认值               |
| ------------------ | ---------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| readonly           | 完全只读                                       | boolean                                     | —                                                                                                                                                                                 | false                |
| disabled           | 禁用                                           | boolean                                     | —                                                                                                                                                                                 | false                |
| editable           | 文本框可输入                                   | boolean                                     | —                                                                                                                                                                                 | true                 |
| clearable          | 是否显示清除按钮                               | boolean                                     | —                                                                                                                                                                                 | true                 |
| size               | 输入框尺寸                                     | string                                      | large, small, mini                                                                                                                                                                | —                    |
| placeholder        | 非范围选择时的占位内容                         | string                                      | —                                                                                                                                                                                 | —                    |
| start-placeholder  | 范围选择时开始日期的占位内容                   | string                                      | —                                                                                                                                                                                 | —                    |
| end-placeholder    | 范围选择时结束日期的占位内容                   | string                                      | —                                                                                                                                                                                 | —                    |
| time-arrow-control | 是否使用箭头进行时间选择                       | boolean                                     | —                                                                                                                                                                                 | false                |
| type               | 显示类型                                       | string                                      | year/month/date/week/ datetime/datetimerange/daterange                                                                                                                            | date                 |
| format             | 显示在输入框中的格式                           | string                                      | 见[日期格式](#/zh-CN/component/date-picker#ri-qi-ge-shi)                                                                                                                          | yyyy-MM-dd           |
| align              | 对齐方式                                       | string                                      | left, center, right                                                                                                                                                               | left                 |
| popper-class       | DateTimePicker 下拉框的类名                    | string                                      | —                                                                                                                                                                                 | —                    |
| picker-options     | 当前时间日期选择器特有的选项参考下表           | object                                      | —                                                                                                                                                                                 | {}                   |
| range-separator    | 选择范围时的分隔符                             | string                                      | -                                                                                                                                                                                 | '-'                  |
| default-value      | 可选，选择器打开时默认显示的时间               | Date                                        | 可被`new Date()`解析                                                                                                                                                              | —                    |
| default-time       | 选中日期后的默认具体时刻                       | 非范围选择时：string / 范围选择时：string[] | 非范围选择时：形如`12:00:00`的字符串；范围选择时：数组，长度为 2，每项值为字符串，形如`12:00:00`，第一项指定开始日期的时刻，第二项指定结束日期的时刻。不指定会使用时刻 `00:00:00` | —                    |
| value-format       | 可选，绑定值的格式。不指定则绑定值为 Date 对象 | string                                      | 见[日期格式](#/zh-CN/component/date-picker#ri-qi-ge-shi)                                                                                                                          | —                    |
| name               | 原生属性                                       | string                                      | —                                                                                                                                                                                 | —                    |
| unlink-panels      | 在范围选择器里取消两个日期面板之间的联动       | boolean                                     | —                                                                                                                                                                                 | false                |
| prefix-icon        | 自定义头部图标的类名                           | string                                      | —                                                                                                                                                                                 | ''                   |
| suffix-icon        | 自定义尾部图标的类名                           | string                                      | —                                                                                                                                                                                 | rz-icon-date         |
| show-suffix-icon   | 是否显示尾部图标                               | boolean                                     | —                                                                                                                                                                                 | true                 |
| clear-icon         | 自定义清空图标的类名                           | string                                      | —                                                                                                                                                                                 | rz-icon-circle-close |

### Picker Options

| 参数                  | 说明                                                                  | 类型     | 可选值                       | 默认值 |
| --------------------- | --------------------------------------------------------------------- | -------- | ---------------------------- | ------ |
| shortcuts             | 设置快捷选项，需要传入 { text, onClick } 对象用法参考 demo 或下表     | Object[] | —                            | —      |
| outerShortcuts        | 设置外部快捷选项，需要传入 { text, onClick } 对象用法参考 demo 或下表 | Object[] | —                            | —      |
| outerShortcutsDefault | 设置外部快捷选项的默认选中项                                          | string   | outerShortcuts 中的某个 text |
| disabledDate          | 设置禁用状态，参数为当前日期，要求返回 Boolean                        | Function | —                            | —      |
| firstDayOfWeek        | 周起始日                                                              | Number   | 1 到 7                       | 7      |

### Shortcuts

| 参数    | 说明                                                                                                  | 类型     | 可选值 | 默认值 |
| ------- | ----------------------------------------------------------------------------------------------------- | -------- | ------ | ------ |
| text    | 标题文本                                                                                              | string   | —      | —      |
| onClick | 选中后的回调函数，参数是 vm，可通过触发 'pick' 事件设置选择器的值。例如 vm.\$emit('pick', new Date()) | function | —      | —      |

### Events

| Event Name   | Description              | Parameters                                             |
| ------------ | ------------------------ | ------------------------------------------------------ |
| change       | 用户确认选定的值时触发   | 组件绑定值。格式与绑定值一致，可受 `value-format` 控制 |
| blur         | 当 input 失去焦点时触发  | 组件实例                                               |
| focus        | 当 input 获得焦点时触发  | 组件实例                                               |
| outer-change | 当外部快捷选项改变时触发 | outerShortcut.text                                     |

### Methods

| 方法名 | 说明              | 参数 |
| ------ | ----------------- | ---- |
| focus  | 使 input 获取焦点 | —    |
| reset  | 重置值            | --   |
