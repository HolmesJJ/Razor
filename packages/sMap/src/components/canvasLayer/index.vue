<template>
  <div></div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Inject } from "vue-property-decorator";

import MapFactory from "../../sdk/factory";

@Component({
  name: "MapCanvasLayer"
})
export default class RzMapCanvasLayer extends Vue {
  canvasLayer: any;

  @Inject() readonly getMap!: Function;

  @Prop() scope!: any;

  created() {
    this.getMap(async (map: any, type: string) => {
      const updateFunc = this.$listeners.update;
      this.canvasLayer = await MapFactory.createCanvasLayer(type, map, {
        update: updateFunc,
        scope: this.scope
      });
    });
  }

  updateCanvas() {
    this.canvasLayer && this.canvasLayer.draw();
  }

  destroyed() {
    this.canvasLayer.remove();
  }
}
</script>
