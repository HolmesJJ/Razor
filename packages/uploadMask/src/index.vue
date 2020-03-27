<template>
  <div class="rz-uploadMask">
    <div class="rz-uploadMask__content" v-show="animateShow">
      <div
        class="rz-uploadMask__content--animate"
        v-for="(item,index) in imageList"
        :key="item"
        v-show="index === imageIndex"
        :style="getStyle(index)"
      ></div>
      <div class="rz-uploadMask__content--title">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({
  name: "UploadMask"
})
export default class UploadMask extends Vue {
  @Prop({
    default() {
      return [];
    },
    type: Array
  })
  readonly imageList: string[];

  get animateTime() {
    const getImageFromCacheTime = 35;
    const defaultTime = 4000;
    return this.imageList.length
      ? this.imageList.length * getImageFromCacheTime
      : defaultTime;
  }

  get intervalTime() {
    return this.animateTime / this.imageList.length;
  }

  getStyle(index) {
    return {
      "background-image": this.imageList[index]
        ? `url(${this.imageList[index]})`
        : `none`
    };
  }

  imageIndex: number = 0;

  timer = null;

  animateShow: boolean = false;

  @Watch("imageList")
  handleImageListChange(value) { // eslint-disable-line
    this.downLoadImgs(this.setupAnimate);
  }

  setupAnimate(intervalTime?) {
    clearInterval(this.timer);
    this.timer = setInterval(
      this.changeBgIMG,
      typeof intervalTime === "number" && intervalTime
        ? intervalTime
        : this.intervalTime
    );
    this.animateShow = true;
  }

  changeBgIMG() {
    this.imageIndex += 1;
    if (this.imageIndex > this.imageList.length - 1) this.imageIndex = 0;
  }

  downLoadImgs(callback) {
    this.animateShow = false;
    let length = this.imageList.length;
    const promiseList = [];
    const downLoadImage = (resolve, reject, index) => {
      let imgElm = new Image();
      imgElm.src = this.imageList[index];

      imgElm.onload = ev => {
        resolve(ev);
        imgElm.remove();
        imgElm = null;
      };
      imgElm.onerror = () => {
        imgElm.remove();
        reject();
      };
    };

    let i = length - 1;
    while (i > 0) {
      let promise = new Promise((resolve, reject) =>
        downLoadImage(resolve, reject, i)
      );
      i = i - 1;
      promiseList.push(promise);
    }

    Promise.all(promiseList)
      .then(callback)
      .catch(err => console.error("error: downloand Image fail", err));
  }

  mounted() {
    this.downLoadImgs(this.setupAnimate);
  }

  beforeDestroy() {
    clearInterval(this.timer);
  }
}
</script>
