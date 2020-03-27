<template>
    <!-- 编写 close 组件 -->
    <rz-icon name="close" class="rz-close" @click="emitEvent"></rz-icon>
</template>

<script lang='ts'>
// import Vue from 'vue'
import { Vue, Component, Emit } from 'vue-property-decorator'

@Component({
  name: 'Close'
})
export default class Close extends Vue {
  @Emit('click')
  emitEvent(event){
    return event;
  }
}
</script>
