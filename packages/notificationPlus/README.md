<script>
  module.exports = {
    data: function() {
      return { 
        visible: false,
        content: '有多条未读告警！',
        listData: [1,2,3,4,5,6,7,8,9,10].map(() => {
          return { label: 'Emma', value: '1' }
        }),
        badgeValue: 10
      }
    },
    methods: {
      handleClear: function() {
        this.visible = false;
      },
      openNotification: function() {
        this.visible = true;
      },
      handleListFooterClick: function() {
        // 点击的时候执行的方法
        // 折叠panel
        this.$refs.notification.setMiniMode(true);
      }
    }
  };
</script>
<style>
.razor-doc-notification-plus__list-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  line-height: 34px;
  padding: 0 20px; 
}
.razor-doc-notification-plus__list-item.rz-doc-notification-plus__list-item--odd {
    background: #eee;
}
.razor-doc-notification-plus__list-footer {
  padding: 25px 0;
  text-align: center;
  color: #4285F4;
  cursor: pointer;
  font-size: 12px;
}
</style>
## Notification Plus 通知

悬浮出现在页面角落，显示全局的通知提醒消息。

### 基本用法

适用性广泛的通知栏

:::demo Notification Plus 组件提供通知功能，在基础通知栏组件的基础上，提供了mini mode（最小化按钮形态），以及展开列表功能，以展示具体的通知告警细节。
```html
<template>
  <rz-button type="primary" @click="openNotification">打开 Notification</rz-button>
  <rz-notification-plus
    :badgeValue="badgeValue"
    @clear="handleClear"
    :visible="visible"
    :content="content"
    :listData="listData"
    listMaxHeight="200"
    ref="notification"
  >
    <template slot="panel-list-item" slot-scope="{ scope }">
      <div :class="{'rz-doc-notification-plus__list-item--odd': scope.$index%2 === 1, 'razor-doc-notification-plus__list-item': true}">
        <div >{{ scope.item.label }}</div>
        <div>{{ scope.item.value }}</div>
      </div>
    </template>
    <template slot="after-list">
      <div class="razor-doc-notification-plus__list-footer" @click="handleListFooterClick()">跳转至“布控”，查看全部告警</div>
    </template>
  </rz-notification-plus>
</template>

<script>
  export default {
    data: function() {
      return {
        visible: false,
        content: '有多条未读告警！',
        listData: [1,2,3,4,5,6,7,8,9,10].map(() => {
          return { label: 'Emma', value: '1' }
        }),
        badgeValue: 10
      }
    },
    methods: {
      handleClear: function() {
        this.visible = false;
      },
      openNotification: function() {
        this.visible = true;
      },
      handleListFooterClick: function() {
        // 点击的时候执行的方法
        // 折叠panel
        this.$refs.notification.setMiniMode(true);
      }
    }
  }
</script>
```
::: 

### Notification Plus Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| label     | Radio 的 value   | string / number / boolean    |       —        |      —   |

### Notification Plus Events
| 事件名称 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| change  | 绑定值变化时触发的事件 |  选中的 Radio label 值  |

### Notification Plus Methods
| 方法名 | 说明 | 参数 |可选值|
| ---- | ---- | ---- | ---- |
| setMiniMode | 设置通知组件是否展示最小化形态 | boolean | true/false |

### Notification Scoped Slot
| name | 说明 |
|------|--------|
| panel-list-item | 自定义panel列表内容，参数为 { item, $index } |