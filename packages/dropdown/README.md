<style>
  .demo-box {
    .rz-dropdown {
      vertical-align: top;

      & + .rz-dropdown {
        margin-left: 15px;
      }
    }
    .rz-dropdown-link {
      cursor: pointer;
      color: #d5d5d5;
    }
    .rz-icon-arrow-down {
      font-size: 12px;
    }
  }

  .block-col-2 {
    margin: 0 -24px;

    .rz-col {
      padding: 30px 0;
      text-align: center;
      border-right: 1px solid #eff2f6;

      &:last-child {
        border-right: 0;
      }
    }
  }
  .block-col-2 .rz-col {
    padding:0 30px;
    text-align: center;
    border-right: 1px solid #eff2f6;
  }
  .block-col-2 .rz-col:last-child{
    border-right: 0;
  }


 .demo-dropdown .demonstration {
   display: block;
   color: #8492a6;
   font-size: 14px;
   margin-bottom: 20px;
 }
</style>

<script>
  export default {
    methods: {
      handleClick() {
        alert('button click');
      },
      handleCommand(command) {
        this.$message('click on item ' + command);
      }
    }
  }
</script>
## Dropdown 下拉菜单

将动作或菜单折叠到下拉菜单中。

### 基础用法

移动到下拉菜单上，展开更多操作。

:::demo 通过组件`slot`来设置下拉触发的元素以及需要通过具名`slot`为`dropdown` 来设置下拉菜单。默认情况下，下拉按钮只要`hover`即可，无需点击也会显示下拉菜单。

```html
<rz-dropdown>
  <span class="rz-dropdown-link">
    下拉菜单<i class="rz-icon-arrow-down rz-icon--right"></i>
  </span>
  <rz-dropdown-menu slot="dropdown">
    <rz-dropdown-item>黄金糕</rz-dropdown-item>
    <rz-dropdown-item>狮子头</rz-dropdown-item>
    <rz-dropdown-item>螺蛳粉</rz-dropdown-item>
    <rz-dropdown-item disabled>双皮奶</rz-dropdown-item>
    <rz-dropdown-item divided>蚵仔煎</rz-dropdown-item>
  </rz-dropdown-menu>
</rz-dropdown>
<style>
  /* 样式参考
  .rz-dropdown-link {
    cursor: pointer;
    color: $--color-text-regular;
  } 
  */
</style>
```
:::

### 触发对象

可使用按钮触发下拉菜单。

:::demo 设置`split-button`属性来让触发下拉元素呈现为按钮组，左边是功能按钮，右边是触发下拉菜单的按钮，设置为`true`即可。

```html
<rz-dropdown>
  <rz-button type="primary">
    更多菜单<i class="rz-icon-arrow-down rz-icon--right"></i>
  </rz-button>
  <rz-dropdown-menu slot="dropdown">
    <rz-dropdown-item>黄金糕</rz-dropdown-item>
    <rz-dropdown-item>狮子头</rz-dropdown-item>
    <rz-dropdown-item>螺蛳粉</rz-dropdown-item>
    <rz-dropdown-item>双皮奶</rz-dropdown-item>
    <rz-dropdown-item>蚵仔煎</rz-dropdown-item>
  </rz-dropdown-menu>
</rz-dropdown>
<rz-dropdown split-button type="primary" @click="handleClick">
  更多菜单
  <rz-dropdown-menu slot="dropdown">
    <rz-dropdown-item>黄金糕</rz-dropdown-item>
    <rz-dropdown-item>狮子头</rz-dropdown-item>
    <rz-dropdown-item>螺蛳粉</rz-dropdown-item>
    <rz-dropdown-item>双皮奶</rz-dropdown-item>
    <rz-dropdown-item>蚵仔煎</rz-dropdown-item>
  </rz-dropdown-menu>
</rz-dropdown>


<script>
  export default {
    methods: {
      handleClick() {
        alert('button click');
      }
    }
  }
</script>

```
:::

### 触发方式

可以配置 click 激活或者 hover 激活。

:::demo 在`trigger`属性设置为`click`即可。
```html
<rz-row class="block-col-2">
  <rz-col :span="12">
    <span class="demonstration">hover 激活</span>
    <br/><br/><br/>
    <rz-dropdown>
      <span class="rz-dropdown-link">
        下拉菜单<i class="rz-icon-arrow-down rz-icon--right"></i>
      </span>
      <rz-dropdown-menu slot="dropdown">
        <rz-dropdown-item>黄金糕</rz-dropdown-item>
        <rz-dropdown-item>狮子头</rz-dropdown-item>
        <rz-dropdown-item>螺蛳粉</rz-dropdown-item>
        <rz-dropdown-item>双皮奶</rz-dropdown-item>
        <rz-dropdown-item>蚵仔煎</rz-dropdown-item>
      </rz-dropdown-menu>
    </rz-dropdown>
  </rz-col>
  <rz-col :span="12">
    <span class="demonstration">click 激活</span>
    <br/><br/><br/>
    <rz-dropdown trigger="click">
      <span class="rz-dropdown-link">
        下拉菜单<i class="rz-icon-arrow-down rz-icon--right"></i>
      </span>
      <rz-dropdown-menu slot="dropdown">
        <rz-dropdown-item>黄金糕</rz-dropdown-item>
        <rz-dropdown-item>狮子头</rz-dropdown-item>
        <rz-dropdown-item>螺蛳粉</rz-dropdown-item>
        <rz-dropdown-item>双皮奶</rz-dropdown-item>
        <rz-dropdown-item>蚵仔煎</rz-dropdown-item>
      </rz-dropdown-menu>
    </rz-dropdown>
  </rz-col>
</rz-row>
```



:::

### 菜单隐藏方式

可以`hide-on-click`属性来配置。

:::demo 下拉菜单默认在点击菜单项后会被隐藏，将`hide-on-click`属性默认为`false`可以关闭此功能。
```html
<rz-dropdown :hide-on-click="false">
  <span class="rz-dropdown-link">
    下拉菜单<i class="rz-icon-arrow-down rz-icon--right"></i>
  </span>
  <rz-dropdown-menu slot="dropdown">
    <rz-dropdown-item>黄金糕</rz-dropdown-item>
    <rz-dropdown-item>狮子头</rz-dropdown-item>
    <rz-dropdown-item>螺蛳粉</rz-dropdown-item>
    <rz-dropdown-item disabled>双皮奶</rz-dropdown-item>
    <rz-dropdown-item divided>蚵仔煎</rz-dropdown-item>
  </rz-dropdown-menu>
</rz-dropdown>

<style>
  /* .rz-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .rz-icon-arrow-down {
    font-size: 12px;
  } */
</style>
```
:::

### 指令事件

点击菜单项后会触发事件，用户可以通过相应的菜单项 key 进行不同的操作

:::demo
```html
<rz-dropdown @command="handleCommand">
  <span class="rz-dropdown-link">
    下拉菜单<i class="rz-icon-arrow-down rz-icon--right"></i>
  </span>
  <rz-dropdown-menu slot="dropdown">
    <rz-dropdown-item command="a">黄金糕</rz-dropdown-item>
    <rz-dropdown-item command="b">狮子头</rz-dropdown-item>
    <rz-dropdown-item command="c">螺蛳粉</rz-dropdown-item>
    <rz-dropdown-item command="d" disabled>双皮奶</rz-dropdown-item>
    <rz-dropdown-item command="e" divided>蚵仔煎</rz-dropdown-item>
  </rz-dropdown-menu>
</rz-dropdown>

<style>
  /* .rz-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .rz-icon-arrow-down {
    font-size: 12px;
  } */
</style>

<script>
  export default {
    methods: {
      handleCommand(command) {
        console.log('click on item ' + command)
        this.$message('click on item ' + command);
      }
    }
  }
</script>
```
:::

### 不同尺寸

Dropdown 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的尺寸。

:::demo 额外的尺寸：`medium`、`small`、`mini`，通过设置`size`属性来配置它们。

```html
<rz-dropdown split-button type="primary">
  默认尺寸
  <rz-dropdown-menu slot="dropdown">
    <rz-dropdown-item>黄金糕</rz-dropdown-item>
    <rz-dropdown-item>狮子头</rz-dropdown-item>
    <rz-dropdown-item>螺蛳粉</rz-dropdown-item>
    <rz-dropdown-item>双皮奶</rz-dropdown-item>
    <rz-dropdown-item>蚵仔煎</rz-dropdown-item>
  </rz-dropdown-menu>
</rz-dropdown>

<rz-dropdown size="medium" split-button type="primary">
  中等尺寸
  <rz-dropdown-menu slot="dropdown">
    <rz-dropdown-item>黄金糕</rz-dropdown-item>
    <rz-dropdown-item>狮子头</rz-dropdown-item>
    <rz-dropdown-item>螺蛳粉</rz-dropdown-item>
    <rz-dropdown-item>双皮奶</rz-dropdown-item>
    <rz-dropdown-item>蚵仔煎</rz-dropdown-item>
  </rz-dropdown-menu>
</rz-dropdown>

<rz-dropdown size="small" split-button type="primary">
  小型尺寸
  <rz-dropdown-menu slot="dropdown">
    <rz-dropdown-item>黄金糕</rz-dropdown-item>
    <rz-dropdown-item>狮子头</rz-dropdown-item>
    <rz-dropdown-item>螺蛳粉</rz-dropdown-item>
    <rz-dropdown-item>双皮奶</rz-dropdown-item>
    <rz-dropdown-item>蚵仔煎</rz-dropdown-item>
  </rz-dropdown-menu>
</rz-dropdown>

<rz-dropdown size="mini" split-button type="primary">
  超小尺寸
  <rz-dropdown-menu slot="dropdown">
    <rz-dropdown-item>黄金糕</rz-dropdown-item>
    <rz-dropdown-item>狮子头</rz-dropdown-item>
    <rz-dropdown-item>螺蛳粉</rz-dropdown-item>
    <rz-dropdown-item>双皮奶</rz-dropdown-item>
    <rz-dropdown-item>蚵仔煎</rz-dropdown-item>
  </rz-dropdown-menu>
</rz-dropdown>
```
:::

### Dropdown Attributes
| 参数          | 说明                                                                 | 类型    | 可选值                                               | 默认值     |
| ------------- | -------------------------------------------------------------------- | ------- | ---------------------------------------------------- | ---------- |
| type          | 菜单按钮类型，同 Button 组件(只在`split-button`为 true 的情况下有效) | string  | —                                                   | —         |
| size          | 菜单尺寸，在`split-button`为 true 的情况下也对触发按钮生效           | string  | medium / small / mini                                | —         |
| split-button  | 下拉触发元素呈现为按钮组                                             | boolean | —                                                   | false      |
| placement     | 菜单弹出位置                                                         | string  | top/top-start/top-end/bottom/bottom-start/bottom-end | bottom-end |
| trigger       | 触发下拉的行为                                                       | string  | hover, click                                         | hover      |
| hide-on-click | 是否在点击菜单项后隐藏菜单                                           | boolean | —                                                   | true       |
| show-timeout  | 展开下拉菜单的延时（仅在 trigger 为 hover 时有效）                   | number  | —                                                   | 250        |
| hide-timeout  | 收起下拉菜单的延时（仅在 trigger 为 hover 时有效）                   | number  | —                                                   | 150        |

### Dropdown Events
| 事件名称       | 说明                                          | 回调参数                      |
| -------------- | --------------------------------------------- | ----------------------------- |
| click          | `split-button` 为 true 时，点击左侧按钮的回调 | —                            |
| command        | 点击菜单项触发的事件回调                      | dropdown-item 的指令          |
| visible-change | 下拉框出现/隐藏时触发                         | 出现则为 true，隐藏则为 false |

### Dropdown Menu Item Attributes
| 参数     | 说明       | 类型                 | 可选值 | 默认值 |
| -------- | ---------- | -------------------- | ------ | ------ |
| command  | 指令       | string/number/object | —     | —     |
| disabled | 禁用       | boolean              | —     | false  |
| divided  | 显示分割线 | boolean              | —     | false  |
