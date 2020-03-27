<template>
    <div class="rz-card" :style="cardStyle" :class="className" @click="handleClick">
      <slot></slot>
    </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component({
  name: 'Card'
})
export default class Card extends Vue {
  
  @Prop({type:Object, default(){ return {} }})
  cardStyle: any;

  @Prop({ type:Object, default(){
    return {}
  } })
  cardClass: object;

  @Prop({ type: Boolean, default: false })
  activated: boolean;

  get className(){
    const _className = {
      "is-activated": this.activated
    }

    return Object.assign(_className, this.cardClass)
  }

  @Emit('click')
  handleClick(event){
    return event;
  }
}
</script>
