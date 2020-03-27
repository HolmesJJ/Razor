<template>
  <ul class="rz-tree-map__drawing-tools-ctrl">
    <li v-for="(choice, idx) in toolConf"
      :key="choice.mode"
      class="drawing-tools-item"
      :class="{'is-selected': selectedIdx === idx }"
      @click="change2Mode(choice.mode, idx)">{{ choice.modeText }}</li>
  </ul>
</template>

<script lang="ts">

import { Vue, Component, Prop, Emit } from "vue-property-decorator";

interface DrawingConf {
  mode: string;
  modeText: string;
}

@Component({
  name: "MapDrawingToolBar"
})
export default class MapDrawingToolBar extends Vue {
  @Prop() drawingToolsConf!: DrawingConf[];

  @Prop({ required: true }) initialMode: string;

  toolConf: DrawingConf[] = [];

  mode: string = '';    
 
  selectedIdx: number = -1;

  initLock: boolean = false;
  // todo 国际化
  defaultDrawingToolsConf: DrawingConf[] = [
    {
      mode: 'rectangle',
      modeText: '矩形'
    },
    {
      mode: 'circle',
      modeText: '圆形'
    },
    {
      mode: 'polygon',
      modeText: '多边形'
    },
    {
      mode: 'hander',
      modeText: '恢复拖拽'
    }
  ]
  
  mounted() {
    this.toolConf = this.drawingToolsConf ? this.drawingToolsConf : this.defaultDrawingToolsConf;
    this.mode = this.initialMode;
    this.toolConf.forEach((conf, index) => {
      if (conf.mode === this.mode) {
        this.selectedIdx = index;
      }
    })
    if (this.selectedIdx === -1) {
      console.error(
        "[Razor Error][Tree Map] 框选初始值不在框选配置中，请检查配置..."
      );
    }
  }

  @Emit('change')
  change2Mode(mode, idx): string {
    this.selectedIdx = idx;
    this.mode = mode;
    return this.mode;
  }
}
</script>