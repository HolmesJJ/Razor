<script>
  export default {
    data() {
      return {
        activeName: 'second',
        activeName2: 'first',
        activeNameDark: 'second',
        editableTabsValue: '2',
        editableTabsValue2: '2',
        editableTabs: [{
          title: 'Tab 1',
          name: '1',
          content: 'Tab 1 content'
        }, {
          title: 'Tab 2',
          name: '2',
          content: 'Tab 2 content'
        }],
        editableTabs2: [{
          title: 'Tab 1',
          name: '1',
          content: 'Tab 1 content'
        }, {
          title: 'Tab 2',
          name: '2',
          content: 'Tab 2 content'
        }],
        tabIndex: 2,
        tabPosition: 'top'
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      handleTabsEdit(targetName, action) {
        if (action === 'add') {
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            title: 'New Tab',
            name: newTabName,
            content: 'New Tab content'
          });
          this.editableTabsValue = newTabName;
        }
        if (action === 'remove') {
          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }
          
          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        }
      },
      addTab(targetName) {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs2.push({
          title: 'New Tab',
          name: newTabName,
          content: 'New Tab content'
        });
        this.editableTabsValue2 = newTabName;
      },
      removeTab(targetName) {
        let tabs = this.editableTabs2;
        let activeName = this.editableTabsValue2;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        
        this.editableTabsValue2 = activeName;
        this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);
      }
    }
  }
</script>

## Tabs 标签页

分隔内容上有关联但属于不同类别的数据集合。

### 基础用法

基础的、简洁的标签页。

:::demo Tabs 组件提供了选项卡功能，默认选中第一个标签页，你也可以通过 `value` 属性来指定当前选中的标签页。

```html
<template>
  <rz-tabs v-model="activeName" @tab-click="handleClick" position="center">
    <rz-tab-pane label="管理" name="first">管理</rz-tab-pane>
    <rz-tab-pane label="配置管理" name="second">配置管理</rz-tab-pane>
    <rz-tab-pane label="角色管理" name="third">角色管理</rz-tab-pane>
  </rz-tabs>
</template>
<script>
  export default {
    data() {
      return {
        activeName: "second"
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>
```

:::

使用 tabGap 自定义 tab 直接的间距, 使用 size 调整大小
:::demo

```html
<template>
  <rz-tabs
    v-model="activeName2"
    @tab-click="handleClick"
    position="center"
    size="small"
    :tabGap="24"
  >
    <rz-tab-pane label="管理" name="first">管理</rz-tab-pane>
    <rz-tab-pane label="配置管理" name="second">配置管理</rz-tab-pane>
    <rz-tab-pane label="角色管理" name="third">角色管理</rz-tab-pane>
  </rz-tabs>
</template>
<script>
  export default {
    data() {
      return {
        activeName2: "second"
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>
```

:::

<!-- ### 深色模式

深色模式的导航栏。

:::demo 只需要把`type`属性设置为`dark-stretch`

```html
<template>
  <rz-tabs
    type="dark-stretch"
    v-model="activeNameDark"
    @tab-click="handleClick"
  >
    <rz-tab-pane icon="success" label="用户管理" name="first"
      >用户管理</rz-tab-pane
    >
    <rz-tab-pane icon="success" label="配置管理" name="second"
      >配置管理</rz-tab-pane
    >
    <rz-tab-pane icon="success" label="角色管理" name="third"
      >角色管理</rz-tab-pane
    >
    <rz-tab-pane icon="success" label="定时任务补偿" name="fourth"
      >定时任务补偿</rz-tab-pane
    >
    <rz-tab-pane icon="success" label="部门管理" name="fifth"
      >部门管理</rz-tab-pane
    >
  </rz-tabs>
</template>
<script>
  export default {
    data() {
      return {
        activeName: "second"
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>
```

:::

### 选项卡样式

选项卡样式的标签页。

:::demo 只需要设置 `type` 属性为 `card` 就可以使选项卡改变为标签风格。

```html
<template>
  <rz-tabs v-model="activeName2" type="card" @tab-click="handleClick">
    <rz-tab-pane label="用户管理" name="first">用户管理</rz-tab-pane>
    <rz-tab-pane label="配置管理" name="second">配置管理</rz-tab-pane>
    <rz-tab-pane label="角色管理" name="third">角色管理</rz-tab-pane>
    <rz-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</rz-tab-pane>
  </rz-tabs>
</template>
<script>
  export default {
    data() {
      return {
        activeName2: "first"
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>
```

:::

### 卡片化

卡片化的标签页。

:::demo 将`type`设置为`border-card`。

```html
<rz-tabs type="border-card">
  <rz-tab-pane label="用户管理">用户管理</rz-tab-pane>
  <rz-tab-pane label="配置管理">配置管理</rz-tab-pane>
  <rz-tab-pane label="角色管理">角色管理</rz-tab-pane>
  <rz-tab-pane label="定时任务补偿">定时任务补偿</rz-tab-pane>
</rz-tabs>
```

:::

### 位置

可以通过 `tab-position` 设置标签的位置

:::demo 标签一共有四个方向的设置 `tabPosition="left|right|top|bottom"`

```html
<template>
  <rz-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
    <rz-radio-button label="top">top</rz-radio-button>
    <rz-radio-button label="right">right</rz-radio-button>
    <rz-radio-button label="bottom">bottom</rz-radio-button>
    <rz-radio-button label="left">left</rz-radio-button>
  </rz-radio-group>

  <rz-tabs type="plain" :tab-position="tabPosition" style="height: 200px;">
    <rz-tab-pane label="用户管理">用户管理</rz-tab-pane>
    <rz-tab-pane label="配置管理">配置管理</rz-tab-pane>
    <rz-tab-pane label="角色管理">角色管理</rz-tab-pane>
    <rz-tab-pane label="定时任务补偿">定时任务补偿</rz-tab-pane>
  </rz-tabs>
</template>
<script>
  export default {
    data() {
      return {
        tabPosition: "top"
      };
    }
  };
</script>
```

:::

### 自定义标签页

可以通过具名 `slot` 来实现自定义标签页的内容

:::demo

```html
<rz-tabs type="border-card">
  <rz-tab-pane>
    <span slot="label"><i class="rz-icon-date"></i> 我的行程</span>
    我的行程
  </rz-tab-pane>
  <rz-tab-pane label="消息中心">消息中心</rz-tab-pane>
  <rz-tab-pane label="角色管理">角色管理</rz-tab-pane>
  <rz-tab-pane label="定时任务补偿">定时任务补偿</rz-tab-pane>
</rz-tabs>
```

:::

### 动态增减标签页

增减标签页按钮只能在选项卡样式的标签页下使用

:::demo

```html
<rz-tabs
  v-model="editableTabsValue"
  type="card"
  editable
  @edit="handleTabsEdit"
>
  <rz-tab-pane
    :key="item.name"
    v-for="(item, index) in editableTabs"
    :label="item.title"
    :name="item.name"
  >
    {{item.content}}
  </rz-tab-pane>
</rz-tabs>
<script>
  export default {
    data() {
      return {
        editableTabsValue: "2",
        editableTabs: [
          {
            title: "Tab 1",
            name: "1",
            content: "Tab 1 content"
          },
          {
            title: "Tab 2",
            name: "2",
            content: "Tab 2 content"
          }
        ],
        tabIndex: 2
      };
    },
    methods: {
      handleTabsEdit(targetName, action) {
        if (action === "add") {
          let newTabName = ++this.tabIndex + "";
          this.editableTabs.push({
            title: "New Tab",
            name: newTabName,
            content: "New Tab content"
          });
          this.editableTabsValue = newTabName;
        }
        if (action === "remove") {
          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }

          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        }
      }
    }
  };
</script>
```

:::

### 自定义增加标签页触发器

:::demo

```html
<div style="margin-bottom: 20px;">
  <rz-button size="small" @click="addTab(editableTabsValue2)">
    add tab
  </rz-button>
</div>
<rz-tabs
  v-model="editableTabsValue2"
  type="card"
  closable
  @tab-remove="removeTab"
>
  <rz-tab-pane
    v-for="(item, index) in editableTabs2"
    :key="item.name"
    :label="item.title"
    :name="item.name"
  >
    {{item.content}}
  </rz-tab-pane>
</rz-tabs>
<script>
  export default {
    data() {
      return {
        editableTabsValue2: "2",
        editableTabs2: [
          {
            title: "Tab 1",
            name: "1",
            content: "Tab 1 content"
          },
          {
            title: "Tab 2",
            name: "2",
            content: "Tab 2 content"
          }
        ],
        tabIndex: 2
      };
    },
    methods: {
      addTab(targetName) {
        let newTabName = ++this.tabIndex + "";
        this.editableTabs2.push({
          title: "New Tab",
          name: newTabName,
          content: "New Tab content"
        });
        this.editableTabsValue2 = newTabName;
      },
      removeTab(targetName) {
        let tabs = this.editableTabs2;
        let activeName = this.editableTabsValue2;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue2 = activeName;
        this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);
      }
    }
  };
</script>
``` -->

:::

### Tabs Attributes

| 参数         | 说明                                                                        | 类型                                | 可选值                | 默认值              |
| ------------ | --------------------------------------------------------------------------- | ----------------------------------- | --------------------- | ------------------- |
| type         | 风格类型                                                                    | string                              | card/border-card      | —                   |
| closable     | 标签是否可关闭                                                              | boolean                             | —                     | false               |
| addable      | 标签是否可增加                                                              | boolean                             | —                     | false               |
| editable     | 标签是否同时可增加和关闭                                                    | boolean                             | —                     | false               |
| value        | 绑定值，选中选项卡的 name                                                   | string                              | —                     | 第一个选项卡的 name |
| tab-position | 选项卡所在位置                                                              | string                              | top/right/bottom/left | top                 |
| stretch      | 标签的宽度是否自撑开                                                        | boolean                             | -                     | false               |
| before-leave | 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。 | Function(activeName, oldActiveName) | —                     | —                   |
| position     | 标签的位置                                                                  | string                              | start/center/end      | start               |
| tabGap       | 标签直接的间距                                                              | number                              | -                     | 32                  |

### Tabs Events

| 事件名称   | 说明                                    | 回调参数              |
| ---------- | --------------------------------------- | --------------------- |
| tab-click  | tab 被选中时触发                        | 被选中的标签 tab 实例 |
| tab-remove | 点击 tab 移除按钮后触发                 | 被删除的标签的 name   |
| tab-add    | 点击 tabs 的新增按钮后触发              | —                     |
| edit       | 点击 tabs 的新增按钮或 tab 被关闭后触发 | (targetName, action)  |

### Tab-pane Attributes

| 参数     | 说明                                             | 类型    | 可选值 | 默认值                                                |
| -------- | ------------------------------------------------ | ------- | ------ | ----------------------------------------------------- |
| label    | 选项卡标题                                       | string  | —      | —                                                     |
| disabled | 是否禁用                                         | boolean | —      | false                                                 |
| name     | 与选项卡 activeName 对应的标识符，表示选项卡别名 | string  | —      | 该选项卡在选项卡列表中的顺序值，如第一个选项卡则为'1' |
| closable | 标签是否可关闭                                   | boolean | —      | false                                                 |
| lazy     | 标签是否延迟渲染                                 | boolean | —      | false                                                 |
