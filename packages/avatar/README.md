## Avatar 头像
<script>
  export default {
    data () {
      return {
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        avatarDemoImg: require('./image/avatarDemoImg.png'),
        avatarDemoImg1: require('./image/avatarDemoImg1.png'),
        sizeList: ["large", "medium", "small"],
        fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
        url: 'http://pic.rmb.bdstatic.com/f54083119edfb83c4cfe9ce2eeebc076.jpeg',
        checked: false,
        avatarList:[
          {
            checked: false,
            size: "medium",
          },
          {
            checked: false,
            size: "medium",
          },
          {
            checked: true,
            size: "medium",
          },
          {
            checked: false,
            size: "medium",
          }
        ]
      }
    },
    methods: {
      errorHandler() {
        console.info('image load fail !');
        return true
      },
      handleChange(value,avatar){
        this.$message(`change: ${value}}`);
      },
      handleListChange(value,avatar){
        avatar.checked = value;
        this.$message(`change: ${value},${JSON.stringify(avatar)}`);
        console.log(this.avatarList)
      }
    }
  }
</script>
用图标、图片或者字符的形式展示用户或事物信息。

### 基本用法

通过 `shape` 和 `size` 设置头像的形状和大小。


<style lang="scss" scoped>
.demo-avatar {
  background: rgba(86,102,141,0.5);
  padding:16px;
  border-radius: 3px;

  &.demo-basic {
    text-align: center;

    .demo-basic--circle, .demo-basic--square {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .block {
        flex: 1;
      }

      .block:not(:last-child) {
        border-right: 1px solid rgba(224, 230, 237, 0.5);
      }
    }

  }

  .sub-title {
    margin-bottom: 10px;
    font-size: 14px;
    color: #8492a6;
  }

  .rz-col:not(:last-child) {
    border-right: 1px solid rgba(224,230,237,.5);
  }  
}
 .demo-avatar-type {
    display: flex;

    >div {
      flex: 1;
      text-align: center;
    }

    >div:not(:last-child) {
      border-right: 1px solid rgba(224,230,237,.5);
    }
  }
.demo-avatar-fit {
    display: flex;
    text-align: center;
    justify-content: space-between;

    .block {
      flex: 1;
      display: flex;
      flex-direction: column;
      flex-grow: 0;
    }

    .title {
      margin-bottom: 10px;
      font-size: 14px;
      color: #8492a6;
    }
    
  }
  .avatar-icon{
      font-size: 72px;
      color: rgba(#56668d,0.5);
  }
</style>
:::demo
```html
<template>
  <rz-row class="demo-avatar demo-basic">
    <rz-col :span="24">
      <div class="sub-title">circle</div>
      <div class="demo-basic--circle">
        <div class="block">
          <rz-avatar :checked="checked" :src="avatarDemoImg" @change="handleChange" :size="72">
          </rz-avatar>
        </div>

        <div class="block">
          <rz-avatar :show-check="false" size="small" icon="rz-icon-picture" :src="avatarDemoImg1"></rz-avatar>
        </div>
      </div>
    </rz-col>
  </rz-row>
</template>
<script>
  export default {
    data () {
      return {
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        sizeList: ["large", "medium", "small"]
      }
    }
  }
</script>

```
:::

:::demo
```html
<template>
  <rz-row class="demo-avatar demo-basic">
    <rz-col :span="24">
      <div class="sub-title">square</div>
      <div class="demo-basic--circle">
        <div class="block"><rz-avatar :show-check="false" shape="square" :size="72" icon="rz-icon-picture"></rz-avatar></div>
        <div class="block" v-for="size in sizeList" :key="size">
          <rz-avatar :show-check="false" shape="square" :size="size" icon="rz-icon-picture"></rz-avatar>
        </div>
      </div>
    </rz-col>
  </rz-row>
</template>

```
:::

:::demo
```html

<template>
  <rz-row class="demo-avatar demo-basic">
    <rz-col :span="24">
      <div class="sub-title">circle list</div>
      <div class="demo-basic--circle">
        <div class="block" v-for="avatar,index in avatarList" :key="index">
          <rz-avatar 
            :checked="avatar.checked" 
            :size="avatar.size" 
            @change="(value) => handleListChange(value,avatar)" 
            icon="rz-icon-picture">
          </rz-avatar>
        </div>
      </div>
    </rz-col>
  </rz-row>
</template>

<script>
  export default {
    data () {
      return {
        avatarList:[
          {
            checked: false,
            size: "medium",
          },
          {
            checked: false,
            size: "medium",
          },
          {
            checked: false,
            size: "medium",
          },
          {
            checked: false,
            size: "medium",
          }
        ]
      }
    },
    methods:{
      handleListChange(value,avatar){
        avatar.checked = value;
        this.$message(`change: ${value},${JSON.stringify(avatar)}`);
        console.log(this.avatarList)
      }
    }
  }
</script>
```
:::

### 展示类型

支持三种类型：图标、图片和字符

:::demo
```html
<template>
  <div class="demo-avatar-type">
    <div>
      <rz-avatar icon="rz-icon-service"></rz-avatar>
    </div>
    <div>
      <rz-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></rz-avatar>
    </div>
    <div>
      <rz-avatar> user </rz-avatar>
    </div>
  </div>
</template>
```
:::

### 图片加载失败的 fallback 行为

当展示类型为图片的时候，图片加载失败的 fallback 行为

:::demo
```html
<template>
  <div class="demo-avatar-type">
    <rz-avatar :show-check="false" shape="square" :size="60" src="https://empty" :error="errorHandler">
      <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
    </rz-avatar>
  </div>
</template>
<script>
  export default {
    methods: {
      errorHandler() {
        console.info('image load fail !');
        return true
      }
    }
  }
</script>

```
:::

### 图片如何适应容器框

当展示类型为图片的时候，使用 `fit` 属性定义图片如何适应容器框，同原生 [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)。

:::demo
```html
<template>
  <div class="demo-avatar-fit">
    <div class="block" v-for="fit in fits" :key="fit">
        <span class="title">{{ fit }}</span>
        <rz-avatar :show-check="false" shape="square" :size="100" :fit="fit" :src="url"></rz-avatar>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
        url: 'http://pic33.nipic.com/20131007/13639685_123501617185_2.jpg'
      }
    }
  }
</script>

```
:::

### Attributes

| 参数      | 说明                                                               | 类型          | 可选值                                     | 默认值 |
| --------- | ------------------------------------------------------------------ | ------------- | ------------------------------------------ | ------ |
| showCheck | 设置头像的是否显示checkbox                                         | boolean       |                                            | true   |
| icon      | 设置头像的图标类型，参考 Icon 组件                                 | string        |                                            |        |
| size      | 设置头像的大小                                                     | number/string | number / large / medium / small            | large  |
| shape     | 设置头像的形状                                                     | string        | circle / square                            | circle |
| src       | 图片头像的资源地址                                                 | string        |                                            |        |
| srcSet    | 以逗号分隔的一个或多个字符串列表表明一系列用户代理使用的可能的图像 | string        |                                            |        |
| alt       | 描述图像的替换文本                                                 | string        |                                            |        |
| fit       | 当展示类型为图片的时候，设置图片如何适应容器框                     | string        | fill / contain / cover / none / scale-down | cover  |


### Events

| 事件名 | 说明                                                                 | 回调参数   |
| ------ | -------------------------------------------------------------------- | ---------- |
| error  | 图片类头像加载失败的回调， 返回 false 会关闭组件默认的 fallback 行为 | (e: Event) |

### Slot

| 名称    | 说明               |
| ------- | ------------------ |
| default | 自定义头像展示内容 |
