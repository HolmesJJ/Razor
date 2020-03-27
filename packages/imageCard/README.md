<script>
export default {
    data() {
        return {
            data2: {
              src: 'http://n.sinaimg.cn/translate/600/w1920h1080/20180424/6Gzs-fzqvvsa3882201.jpg',
              width: 128,
              height: 160,
              bounding: {start: { x: 508, y: 302}, end: {x: 608, y: 406}},
              info: '90%'
            },
            data1: [{
              src: 'http://n.sinaimg.cn/translate/600/w1920h1080/20180424/6Gzs-fzqvvsa3882201.jpg',
              width: 98,
              height: 122,
              bounding: {start: { x: 508, y: 302}, end: {x: 608, y: 406}},
              info: '90%'
            }, 
            {
              src: 'http://n.sinaimg.cn/translate/600/w1920h1080/20180424/6Gzs-fzqvvsa3882201.jpg',
              width: 98,
              height: 122,
              bounding: {start: { x: 508, y: 302}, end: {x: 608, y: 406}},
              info: '90%'
            }],
            data3: [
            {
              src:
                "http://n.sinaimg.cn/translate/600/w1920h1080/20180424/6Gzs-fzqvvsa3882201.jpg",
              width: 98,
              height: 122,
              bounding: { start: { x: 508, y: 302 }, end: { x: 608, y: 406 } },
              info: "90%"
            },
            {
              src:
                "http://n.sinaimg.cn/translate/600/w1920h1080/20180424/6Gzs-fzqvvsa3882201.jpg",
              width: 98,
              height: 122,
              bounding: { start: { x: 508, y: 302 }, end: { x: 608, y: 406 } },
              info: "90%"
            },
            {
              src:
                "http://n.sinaimg.cn/translate/600/w1920h1080/20180424/6Gzs-fzqvvsa3882201.jpg",
              width: 98,
              height: 122,
              bounding: { start: { x: 508, y: 302 }, end: { x: 608, y: 406 } },
              info: "90%"
            }
          ],
            score: '90%',
            showIndex: 1,
            selected1: false,
            selected2: false
        }
    },
    methods: {
        handleSelect(event) {
            this.actived = event.select
            console.log('change', event);
        },
        handleClick(event) {
          console.log('click');
        },
        handleCheckboxClick(event) {
          console.log('checkbox-click', event);
        }
    }
}
</script>

</style>

### Image 图片

基础用法：
:::demo

```html
<template>
  <div>
    <rz-image-card :data="data2" :transition="false"> </rz-image-card>
    <rz-image-card :data="data2" :showInfo="false"> </rz-image-card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        data2: {
          src:
            "http://n.sinaimg.cn/translate/600/w1920h1080/20180424/6Gzs-fzqvvsa3882201.jpg",
          width: 128,
          height: 160,
          bounding: { start: { x: 508, y: 302 }, end: { x: 608, y: 406 } },
          info: "90%"
        }
      };
    }
  };
</script>
```

:::

允许缩放

:::demo

```html
<template>
  <rz-image-card :data="data2" :transition="false" :allowZoom="true">
  </rz-image-card>
</template>
```

:::

显示分数
:::demo

```html
<template>
  <rz-image-card
    :data="data1"
    :transition="false"
    :showScore="true"
    :score="score"
    :showInfo="false"
  >
  </rz-image-card>
</template>
<script>
  export default {
    data() {
      return {
        data1: [
          {
            src:
              "http://n.sinaimg.cn/translate/600/w1920h1080/20180424/6Gzs-fzqvvsa3882201.jpg",
            width: 98,
            height: 122,
            bounding: { start: { x: 508, y: 302 }, end: { x: 608, y: 406 } },
            info: "90%"
          },
          {
            src:
              "http://n.sinaimg.cn/translate/600/w1920h1080/20180424/6Gzs-fzqvvsa3882201.jpg",
            width: 98,
            height: 122,
            bounding: { start: { x: 508, y: 302 }, end: { x: 608, y: 406 } },
            info: "90%"
          }
        ],
        score: "90%"
      };
    }
  };
</script>
```

:::

显示多张图片, 可以通过 `showInfoIndex` 控制需要显示 info 的图片
:::demo

```html
<template>
  <rz-image-card :data="data3" :showInfoIndex="showIndex"> </rz-image-card>
  <template>
    <script>
      export default {
        data() {
          return {
            data3: [
              {
                src:
                  "http://n.sinaimg.cn/translate/600/w1920h1080/20180424/6Gzs-fzqvvsa3882201.jpg",
                width: 98,
                height: 122,
                bounding: {
                  start: { x: 508, y: 302 },
                  end: { x: 608, y: 406 }
                },
                info: "90%"
              },
              {
                src:
                  "http://n.sinaimg.cn/translate/600/w1920h1080/20180424/6Gzs-fzqvvsa3882201.jpg",
                width: 98,
                height: 122,
                bounding: {
                  start: { x: 508, y: 302 },
                  end: { x: 608, y: 406 }
                },
                info: "90%"
              },
              {
                src:
                  "http://n.sinaimg.cn/translate/600/w1920h1080/20180424/6Gzs-fzqvvsa3882201.jpg",
                width: 98,
                height: 122,
                bounding: {
                  start: { x: 508, y: 302 },
                  end: { x: 608, y: 406 }
                },
                info: "90%"
              }
            ],
            showIndex: 1
          };
        }
      };
    </script></template
  ></template
>
```

:::

添加勾选框

:::demo

```html
<template>
  <div>
    <rz-image-card
      :allow-select="true"
      :actived="selected1"
      v-model="selected1"
      :data="data1"
      :score="score"
      :showInfoIndex="showIndex"
      @click="handleClick"
      @checkbox-click="handleCheckboxClick"
      @change="handleSelect"
    >
      <div class="content">
        <p>这里是其他内容, 内容很长</p>
      </div>
    </rz-image-card>

    <rz-image-card
      :allow-select="true"
      :actived="selected2"
      v-model="selected2"
      :data="data2"
      showCheckbox="always"
      :showSelectedLabel="true"
      selectedLabel="比中"
      :activeStyle="false"
      @click="handleClick"
      @change="handleSelect"
    >
      <div class="content">
        <p>这里是其他内容, 内容很长</p>
      </div>
    </rz-image-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        selected: false
      };
    }
  };
</script>
```

:::

添加额外内容

:::demo

```html
<template>
  <div>
    <rz-image-card
      :data="data2"
      :contentPadding="{left: 0, right: 0}"
      :showSelectedLabel="true"
      selectedLabel="比中"
    >
      <div class="content">
        <p>这里是其他内容, 内容很长</p>
      </div>
    </rz-image-card>

    <rz-image-card
      content-position="right"
      :data="data1"
      :containerPadding="{top: 20, bottom: 20}"
      :allowSelect="true"
    >
      <div class="content">
        <p>这里是其他内容</p>
      </div>
    </rz-image-card>

    <rz-image-card content-position="right" :data="data1">
      <span slot="info">自定义info</span>
    </rz-image-card>
  </div>
</template>
```

:::

### ImageCard Attributes

| 参数              | 说明                                                                                | 类型                                                                 | 可选值        | 默认值  |
| ----------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------- | ------- |
| data              | 组件接收的数据                                                                      | { src, width, height, customData, info, bounding} 对象，或对象的数组 | —             | —       |
| allow-select      | 是否可勾选                                                                          | boolean                                                              | —             | false   |
| actived           | 是否显示激活样式                                                                    | boolean                                                              | —             | false   |
| score             | 质量分数                                                                            | string                                                               | —             | --      |
| transition        | 是否启用缩放动画                                                                    | boolean                                                              | —             | true    |
| showCheckbox      | 何时显示 checkbox                                                                   | string                                                               | hover, always | hover   |
| showSelectedLabel | 选中时是否显示提示文字                                                              | boolean                                                              |               | false   |
| selectedLabel     | 选中时提示文字内容                                                                  | string                                                               |               | -       |
| showInfo          | 是否显示每个 image 的信息                                                           | boolean                                                              |               | true    |
| showInfoIndex     | 需要显示信息的 image 的数组下标                                                     | number, number[]                                                     |               | 0       |
| containerPadding  | 容器 padding                                                                        | {top: number, right: number, left: number, bottom: number}           |               | -       |
| contentPadding    | slot 部分 padding                                                                   | {top: number, right: number, left: number, bottom: number}           |               | -       |
| bgColor           | 容器的背景颜色                                                                      | string                                                               | -             | #56668D |
| needFlex (已舍弃) | 是否按照原比例显示                                                                  | boolean                                                              | -             | false   |
| needFit (已舍弃)  | 是否根据位置自动调整以消除补边（需要 bounding）                                     | boolean                                                              | -             | false   |
| ratioError        | 比例误差，在 needFlex = true 时，当图片和容器的宽高比小于这个误差时，图片会平铺显示 | number                                                               | -             | 0.1     |
| allowZoom         | 是否允许图片缩放                                                                    | boolean                                                              | -             | false    |
| activeStyle       | 是否显示激活样式                                                                    | boolean                                                              | -             | true    |
| activeHover       | 是否显示hover样式                                                                    | boolean                                                              | -             | true    |
| type | 需要呈现的图片类型 | string | 'face' | - |
| emptySrc | 当图片链接报错时需要展示的图片 | string | - | - |
| loadingSrc | 当图片加载中时需要显示的图片 | string | _ | _ |

### ImageCard Events

| 事件名称 | 说明               | 回调参数                                                              |
| -------- | ------------------ | --------------------------------------------------------------------- |
| change   | 点击勾选框之后触发 | 返回勾选框的 boolean 值和传入的 data, {select: boolean, data: object} |
| click    | 点击组件后触发     | 返回传入的 data 值                                                    |
| checkbox-click | 点击勾选框之后触发 | 返回点击时的 boolean 值（change之前的值） 和传入的data |

### ImageCard Slot

| name    | 说明                   |
| ------- | ---------------------- |
| default | ImageCard 的其他内容   |
| info    | ImageCard 的 info 内容 |
