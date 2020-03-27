### ScrollBox
<script>
export default {
  data(){
    return {
      list: new Array(10).fill(1).map((i,index)=>index + 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-box-card {
  margin: 8px;
  width: 168px;
  height: 152px;
}
</style>
:::demo
```html
<template>
  <rz-scroll-box>
    <div style="display: flex; padding:0 56px; width: 1800px;height:100%; background:rgba(86, 102, 141, 0.5);">
      <rz-card class="scroll-box-card" :key="index" v-for="item,index in list">
          {{item}}
      </rz-card>
    </div>
  </rz-scroll-box>
  <div style="width:196px;height:376px; margin: 10px auto">
    <rz-scroll-box :vertical="true">
      <rz-card class="scroll-box-card" :key="index" v-for="item,index in list">
          {{item}}
      </rz-card>
    </rz-scroll-box>
  </div>
</template>
```
:::