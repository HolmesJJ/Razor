<template>
  <i class="rz-digit">{{text}}<slot></slot></i>
</template>

<script lang='ts'>

import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({
  name: "Digit"
})
export default class Digit extends Vue {
  @Prop({ type: Number, default: 0 })
  readonly number: number;

  @Prop({ type: Boolean, default: true })
  readonly filterFlag: boolean;

  @Prop({ type: Boolean, default: true })
  readonly format: boolean;

  @Prop({ type: Number, default: 1000 })
  readonly duration: number;

  @Prop({ type: Number, default: 20 })
  readonly delay: number;

  @Prop({ type: String, default: "- -" })
  readonly emptyText: string;

  count: number = 0;
  text: string = "";
  timer = null;
  delayTimer = null

  @Watch("number", { immediate: true })
  handleNumberChange() {
    clearTimeout(this.delayTimer);
    clearInterval(this.timer);
    this.delayTimer = setTimeout(() => this.handleChange(), this.delay);
  }

  handleChange() {
    const value = this.number - this.count;

    if(value <= 0 ){
      this.count = this.number;
      if (this.filterFlag) {
        this.text = this.getText(this.count);
      } else {
        this.text = this.count === 0 ? this.emptyText : this.count.toString();
      }
      clearInterval(this.timer);
      return;
    }

    const timeGap = 16;
    // 执行每一次要加的值
    const countGap = Math.max(1, Math.floor(value / (this.duration / timeGap)));

    clearInterval(this.timer);
    
    this.timer = setInterval(() => {
      if (this.count >= this.number) {
        this.count = this.number;
        if (this.filterFlag) {
          this.text = this.getText(this.count);
        } else {
          this.text = this.count === 0 ? this.emptyText : this.count.toString();
        }
        clearInterval(this.timer);
        return;
      }
      this.count += countGap;
      if (this.filterFlag) {
        this.text = this.getText(this.count);
      } else {
        this.text = this.count === 0 ? this.emptyText : this.count.toString();
      }
    }, timeGap);
  }

  mounted() {
    clearInterval(this.timer);
    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(() => this.handleChange(), this.delay);
  }

  // 过滤（N）E+显示
  getText(val) {
    if (!val) return this.emptyText;
    let res = val;
    let unit = "";
    const size = 100000000;
    if (val >= size) {
      res = Math.floor(Number(val / size) * 10) / 10;
      unit = "E+";
    } else {
      res = this.format ? this.formatNumber(val) : val;
    }
    return res + unit;
  }

  // 添加千分位分隔符
  formatNumber(number) {
    const num = +number;
    let result;
    if (!num) {
      result = "0";
    } else {
      const str = `${num}`;
      const rev = str
        .split("")
        .reverse()
        .join("");
      const added = rev.replace(/\d{3}(?!$)/g, s => `${s},`);
      result = added
        .split("")
        .reverse()
        .join("");
    }
    return result;
  }

  beforeDestroy() {
    clearInterval(this.timer);
    clearTimeout(this.delayTimer);
  }
}
</script>
