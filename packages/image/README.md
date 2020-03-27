<script>
export default {
    data() {
        return {
            loadingSrc: require('./image/custom.png'),
            src: 'http://n.sinaimg.cn/translate/600/w1920h1080/20180424/6Gzs-fzqvvsa3882201.jpg',
            src1: require('doc/assets/images/骑手.jpeg'),
            src2: require('doc/assets/images/manman.png'),
            src3: ''
        }
    }
}

</script>

<style>
.rz-image__content {
    margin-top: 30px;
    width: 250px;
}
</style>

### Image 图片

基础用法：
:::demo

```html
<template>
  <rz-image
    :src="src"
    width="128"
    height="160"
    :needFit="true"
    :bounding="{start: { x: 510, y: 302}, end: {x: 608, y: 406}}"
  >
  </rz-image>

  <rz-image :src="src3" width="128" height="160" :loadingSrc="loadingSrc" :emptySrc="loadingSrc"> </rz-image>
</template>

<script>
  export default {
    data() {
      return {
        src:
          "http://n.sinaimg.cn/translate/600/w1920h1080/20180424/6Gzs-fzqvvsa3882201.jpg",
        src3: ""
      };
    }
  };
</script>
```

:::

如果不传 bounding 则会显示整张图片
:::demo

```html
<rz-image :src="src" width="128" height="160" :allowZoom="true"> </rz-image>
```

```script
<script>
export default {
    data() {
        return {
            src: 'http://n.sinaimg.cn/translate/600/w1920h1080/20180424/6Gzs-fzqvvsa3882201.jpg'
        }
    }
}
</script>
```

:::

可以控制图片是否按照原比例显示, 当图片的高宽比和容器的高宽比小于 ratioError 时，平铺显示
:::demo

```html
<rz-image :src="src1" width="128" height="200" :needFlex="true"> </rz-image>

<rz-image :src="src1" width="128" height="240" :needFlex="true"> </rz-image>
```

:::

在传入 bounding 的情况下，可以自动调整位置来消除补边
:::demo

```html
<rz-image
  :src="src2"
  width="232"
  height="390"
  :needFit="false"
  :bounding="{start: { x: 921, y: 492}, end: {x: 1353, y: 1079}}"
></rz-image>

<rz-image
  :src="src2"
  width="232"
  height="390"
  :needFit="true"
  :bounding="{start: { x: 921, y: 492}, end: {x: 1353, y: 1079}}"
></rz-image>
```

:::

### ImageCard Attributes

| 参数              | 说明                                                                                | 类型                                                          | 可选值 | 默认值  |
| ----------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ | ------- |
| width             | 图片宽度                                                                            | string                                                        | —      | —       |
| height            | 图片高度                                                                            | string                                                        | —      | false   |
| src               | 图片地址                                                                            | string                                                        | —      | —       |
| bounding          | 人脸/人体框坐标                                                                     | { start: {x: number, y: number}, end: {x: number, y: number}} | —      | —       |
| bgColor           | 容器的背景颜色                                                                      | string                                                        | -      | #56668D |
| needFlex (已废弃) | 是否按照原比例显示                                                                  | boolean                                                       | -      | false   |
| needFit (已废弃)  | 是否根据位置自动调整以消除补边（需要 bounding）                                     | boolean                                                       | -      | false   |
| ratioError        | 比例误差，在 needFlex = true 时，当图片和容器的宽高比小于这个误差时，图片会平铺显示 | number                                                        | -      | 0.1     |
| allowZoom         | 是否允许图片缩放                                                                    | boolean                                                       | -      | false    |
| info              | 质量分数信息                                                                        | string                                                        | -      | -       |
| showInfo          | 是否显示质量分数信息                                                                | boolean                                                       | -      | false   |
| type | 需要呈现的图片类型 | string | 'face' | - |
| emptySrc | 当图片链接报错时需要展示的图片 | string | - | - |
| loadingSrc | 当图片加载中时需要显示的图片 | string | _ | _ |
