## Timeline 时间线
<script>
  export default {
    data() {
      return {
        reverse: false,
        activities: [{
          content: '活动按期开始',
          timestamp: '2018-04-15',
          state:"error",
          icon:"warning"
        }, {
          content: '通过审核',
          timestamp: '2018-04-13',
          state:"success",
          icon:"circle-check-outline"
        }, {
          content: '创建成功',
          timestamp: '2018-04-11',
          state:"success",
          icon:"circle-check-outline"
        }],
        activities1: [{
          content: '支持使用图标',
          color: '#0bbd87',
          timestamp: '2018-04-12 20:46',
          size: 'large',
          type: 'primary',
          icon: 'rz-icon-more'
        }, {
          content: '支持自定义颜色',
          timestamp: '2018-04-03 20:46',
          color: '#0bbd87'
        }, {
          content: '支持自定义尺寸',
          timestamp: '2018-04-03 20:46',
          size: 'large'
        }, {
          content: '默认样式的节点',
          timestamp: '2018-04-03 20:46'
        }]
      };
    }
  };
</script>
可视化地呈现时间流信息。
<style lang="scss">
  .timeline-demo {
    padding: 8px;
    .radio{
      margin-bottom: 32px;
    }
    .rz-timeline-item__dot{
      left: -7px;
      top: -8px;
    }
    .timeline-icon{
      border-radius: 50%;
      width: 24px;
      height: 24px;
      background: #1f2a40;
      line-height: 24px;
      text-align: center;

      &.error{
        color: #E5624C;
      }

      &.success{
        color: #4DA971;
      }
      i{
        font-size: 24px;
        font-weight: normal;
      }
      
    }
  }
</style>
### 基础用法

Timeline 可拆分成多个按照时间戳正序或倒序排列的 activity，时间戳是其区分于其他控件的重要特征，使⽤时注意与 Steps 步骤条等区分。

:::demo
```html
<div class="block timeline-demo">
  <div class="radio">
    排序：
    <rz-radio-group v-model="reverse">
      <rz-radio :label="true">倒序</rz-radio>
      <rz-radio :label="false">正序</rz-radio>
    </rz-radio-group>
  </div>

  <rz-timeline :reverse="reverse">
    <rz-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :timestamp="activity.timestamp">
      <div slot="dot" class="timeline-icon" :class="activity.state">
        <rz-icon :name="activity.icon"></rz-icon>
      </div>
    </rz-timeline-item>
  </rz-timeline>
</div>
<style lang="scss">
  .timeline-demo {
    padding: 8px;
    .radio{
      margin-bottom: 32px;
    }
    .rz-timeline-item__dot{
      left: -7px;
      top: -8px;
    }
    .timeline-icon{
      border-radius: 50%;
      width: 24px;
      height: 24px;
      background: #1f2a40;
      line-height: 24px;
      text-align: center;

      &.error{
        color: #E5624C;
      }

      &.success{
        color: #4DA971;
      }
      i{
        font-size: 24px;
        font-weight: normal;
      }
      
    }
  }
</style>
<script>
  export default {
    data() {
      return {
        reverse: true,
        activities: [{
          content: '活动按期开始',
          timestamp: '2018-04-15'
        }, {
          content: '通过审核',
          timestamp: '2018-04-13'
        }, {
          content: '创建成功',
          timestamp: '2018-04-11'
        }],
      };
    }
  };
</script>
```
:::

### ⾃定义节点样式

可根据实际场景⾃定义节点尺⼨、颜⾊，或直接使⽤图标。

:::demo
```html
<div class="block">
  <rz-timeline>
    <rz-timeline-item
      v-for="(activity, index) in activities1"
      :key="index"
      :icon="activity.icon"
      :type="activity.type"
      :color="activity.color"
      :size="activity.size"
      :timestamp="activity.timestamp">
      {{activity.content}}
    </rz-timeline-item>
  </rz-timeline>
</div>

<script>
  export default {
    data() {
      return {
        activities1: [{
          content: '支持使用图标',
          timestamp: '2018-04-12 20:46',
          size: 'large',
          color: '#0bbd87',
          type: 'primary',
          icon: 'rz-icon-more'
        }, {
          content: '支持自定义颜色',
          timestamp: '2018-04-03 20:46',
          color: '#0bbd87'
        }, {
          content: '支持自定义尺寸',
          timestamp: '2018-04-03 20:46',
          size: 'large'
        }, {
          content: '默认样式的节点',
          timestamp: '2018-04-03 20:46'
        }]
      };
    }
  };
</script>
```
:::

### ⾃定义时间戳

当内容在垂直⽅向上过⾼时，可将时间戳置于内容之上。

:::demo
```html
<div class="block">
  <rz-timeline>
    <rz-timeline-item timestamp="2018/4/12" placement="bottom">
        <p>用户可以自定义任何内容 1,定制 placement 时间戳的位置</p>
    </rz-timeline-item>
    <rz-timeline-item timestamp="2018/4/3" hide-timestamp>
        <p>用户可以自定义任何内容 2</p>
        <p>用户可以隐藏时间戳</p>
    </rz-timeline-item>
    <rz-timeline-item timestamp="2018/4/2" placement="top">
        <p>用户自定义内容 3</p>
    </rz-timeline-item>
  </rz-timeline>
</div>
```
:::

### Timeline Attributes
| 参数    | 说明                         | 类型    | 可选值 | 默认值 |
| ------- | ---------------------------- | ------- | ------ | ------ |
| reverse | 指定节点排序方向，默认为正序 | boolean | —      | false  |

### Timeline-item Attributes
| 参数           | 说明               | 类型           | 可选值                                      | 默认值 |
| -------------- | ------------------ | -------------- | ------------------------------------------- | ------ |
| timestamp      | 时间戳             | string         | -                                           | —      |
| hide-timestamp | 是否隐藏时间戳     | boolean        | —                                           | false  |
| placement      | 时间戳位置         | string         | top / bottom                                | bottom |
| type           | 节点类型           | string         | primary / success / warning / danger / info | -      |
| color          | 节点颜色           | string         | hsl / hsv / hex / rgb                       | -      |
| height         | 节点高度           | string, number | -                                           | 120px  |
| size           | 节点尺寸           | string         | normal / large                              | normal |
| icon           | 节点图标           | string         | —                                           | -      |
| dashed         | 节点竖线是否为虚线 | boolean        | —                                           | false  |

### Timeline-Item Slot
| name | 说明                 |
| ---- | -------------------- |
| —    | Timeline-Item 的内容 |
| dot  | 自定义节点           |
