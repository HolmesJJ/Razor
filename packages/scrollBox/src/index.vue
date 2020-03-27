<template>
    <!-- 编写 scrollBox 组件 -->
    <div class="rz-scroll-box" :class="className">
      <span v-if="!vertical" class="rz-scroll-box__operator rz-scroll-box__operator__left" @click="prev">
        <rz-icon name="arrow-left"></rz-icon>
      </span>
      <span v-if="!vertical" class="rz-scroll-box__operator rz-scroll-box__operator__right" @click="next">
        <rz-icon name="arrow-right"></rz-icon>
      </span>
      <span v-if="vertical" class="rz-scroll-box__operator rz-scroll-box__operator__up" @click="prev">
        <rz-icon name="arrow-up"></rz-icon>
      </span>
      <span v-if="vertical" class="rz-scroll-box__operator rz-scroll-box__operator__down" @click="next">
        <rz-icon name="arrow-down"></rz-icon>
      </span>

      <div class="rz-scroll-box__container" :style="containerStyle" ref="container">
        <slot></slot>
      </div>
    </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import RzIcon from "pkg/icon";
//horizontal, vertical 
@Component({
  name: 'ScrollBox',
  components:{
    RzIcon
  }
})
export default class ScrollBox extends Vue {
 
  @Prop({type: Boolean, default: false})
  vertical: boolean

  get className(){
    return {
      "is-vertical": this.vertical,
    }
  }

  get boxOffset(){
    const container = (this.$el  as HTMLElement);
    const { offsetWidth, offsetHeight } = container;
    return { offsetWidth, offsetHeight }
  }

  get containerOffset(){
    const container = (this.$refs.container  as HTMLElement);
    const { offsetWidth, offsetHeight } = container;
    return { offsetWidth, offsetHeight }
  }

  get containerStyle(){
    let style = {};
    if(this.vertical){
      style = {
        "transform": `translateY(${this.translate}px)`,
        "width":"100%",
      }
    }else{
      style = {
        "transform": `translateX(${this.translate}px)`,
        "height":"100%",
      }
    }
    return style
  }

  index: number = 0;
  translate: number = 0;
  maxIndex: number = 0;

  @Watch('vertical')
  handleVerticalChange(){
    this.init();
  }

  init(){
    this.index = 0;
    this.maxIndex = this.getMaxIndex();
  }

  prev(){
    if( this.index <= 0 ){
      return;
    }
    const oldindex = this.index;
    this.index -= 1;
    const { offsetWidth, offsetHeight } = this.boxOffset;
    const offset = this.vertical?  offsetHeight : offsetWidth
    this.translate = this.calculateTranslate(oldindex, this.index, offset)
  }

  next(){
    if(this.index >= this.maxIndex){
      return;
    }
    const oldindex = this.index;
    this.index += 1;
    const { offsetWidth, offsetHeight } = this.boxOffset;
    const offset = this.vertical?  offsetHeight : offsetWidth
    this.translate = this.calculateTranslate(oldindex, this.index, offset);
  }

  calculateTranslate(oldIndex, acitveIndex, offset): number{
    let translate = this.translate;
    if(acitveIndex > oldIndex){
      translate = translate - (acitveIndex - oldIndex) * offset;
    }else{
      translate = translate + (oldIndex - acitveIndex) * offset;
    }
    return translate
  }

  getMaxIndex(): number{
    let maxIndex = 0
    const { offsetWidth, offsetHeight } = this.boxOffset;
    const { offsetWidth: containerOffsetWidth, offsetHeight: containerOffsetHeight } = this.containerOffset;

    if(this.vertical){
      maxIndex = containerOffsetHeight / offsetHeight;
      // 整除情况
      if(!(maxIndex > Math.floor(maxIndex))){
        if(Math.floor(maxIndex) === 0){
          return 0
        }
        maxIndex = maxIndex - 1;
      }else{
        maxIndex = Math.floor(maxIndex)
      }
    }else{
      maxIndex = containerOffsetWidth / offsetWidth;
      // 整除情况
      if(!(maxIndex > Math.floor(maxIndex))){
        if(Math.floor(maxIndex) === 0){
          return 0
        }
        maxIndex = maxIndex - 1;
      }else{
        maxIndex = Math.floor(maxIndex)
      }
    }
    return maxIndex
  }
  
  mounted(){
    this.init();
  }

}
</script>
