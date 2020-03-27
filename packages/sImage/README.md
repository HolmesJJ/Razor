### SImage

:::demo

```html
<template>
  <rz-button @click.native="changeREM">改变REM</rz-button>
  <rz-button @click.native="toggleAllowZoom">{{text}}</rz-button>
  <rz-s-image
    :src="singleSrc"
    width="128"
    height="260"
    :allowZoom="allowZoom"
    :flexable="true"
  ></rz-s-image>

  

  <rz-s-image
    :src="singleSrc"
    width="64"
    height="116"
    :bounding="{start: {x: 2, y: 17}, end: {x: 145, y: 328 }}"
  ></rz-s-image>

  <rz-s-image
    :src="singleSrc"
    width="128"
    height="160"
    :allowZoom="true"
    :ratioError="0.1"
  ></rz-s-image>

  <rz-s-image
    :src="manmanSrc"
    width="90"
    height="120"
    type="face"
    :allowZoom="true"
  ></rz-s-image>

  <rz-s-image
    :src="carSrc"
    width="146"
    height="116"
    :bounding="{start: {x: 20, y: 21}, end: {x: 252, y: 270 }}"
  ></rz-s-image>
  <rz-s-image
    :src="carSrc"
    width="146"
    height="126"
    :ratioError="0.1"
    :bounding="{start: {x: 20, y: 21}, end: {x: 252, y: 270 }}"
  ></rz-s-image>

  <rz-s-image
    :src="carSrc"
    width="146"
    height="136"
    :bounding="{start: {x: 20, y: 21}, end: {x: 252, y: 270 }}"
  ></rz-s-image>
</template>

<script>
  export default {
    data() {
      return {
        allowZoom: false,
        text: "开启缩放",
        singleSrc: require("doc/assets/images/骑手.jpeg"),
        boxSrc: require("doc/assets/images/manman.png"),
        carSrc: require("doc/assets/images/car.png"),
        example1Src: require("doc/assets/images/example1.png"),
        example2Src: require("doc/assets/images/example2.png"),
        example3Src: require("doc/assets/images/example3.png"),
        manmanSrc: require("doc/assets/images/manman2.png")
      };
    },
    methods: {
      toggleAllowZoom() {
        this.allowZoom = !this.allowZoom;
        this.text = this.allowZoom ? "关闭缩放" : "开启缩放";
      },
      changeREM() {
        document.body.style.fontSize = '12px'
      }
    }
  };
</script>
```

:::

:::demo

```html
<rz-s-image
  :src="boxSrc"
  width="232"
  height="390"
  :allowZoom="true"
  :flexable="true"
  :bounding="{start: { x: 921, y: 492}, end: {x: 1353, y: 1079}}"
></rz-s-image>


<rz-s-image
  :src="example1Src"
  width="104"
  height="182"
  :allowZoom="true"
  :bounding="{start: {x: 1281, y: 483}, end: {x: 1826, y: 1079 }}"
></rz-s-image>

<rz-s-image
  :src="example2Src"
  width="76"
  height="180"
  :allowZoom="true"
  :bounding="{start: {x: 1843, y: 518}, end: {x: 1919, y: 731 }}"
></rz-s-image>

<rz-s-image
  :src="example3Src"
  width="102"
  height="180"
  :bounding="{start: {x: 670, y: 426}, end: {x: 862, y: 982 }}"
></rz-s-image>
```

:::
