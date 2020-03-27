<script>
export default {
  data(){
    return {
      visible: true,
      hover: false,
      number: 10000
    }
  },
  methods:{
    toggle(){
      this.visible = !this.visible;
      if(this.visible){
        this.number = 10000* Math.random()
      }
    },
    togglehover(){
      this.hover = !this.hover;
    }
  }
}
</script>
### ColorfulBall

:::demo
```html
<style lang="scss">
</style>
<div style="padding:20px; min-height:460px;" @mouseenter="togglehover"  @mouseleave="togglehover">
  <rz-button type="info" @click="toggle">
    切换
  </rz-button>
  <rz-colorfulBall :is-hover="hover" :visible.sync="visible" style="margin:0 auto">
    <span>
      <br/>
      <rz-digit :number="number" style="font-weight: 800;font-size: 40px;"></rz-digit>
      <br/>
    </span>
  </rz-colorfulBall>
</div>
```
:::