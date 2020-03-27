<template>
  <ul class="rz-tree-map__drawing-tools-ctrl">
    <li
      v-for="(choice, idx) in toolConf"
      :key="choice.mode"
      class="drawing-tools-item"
      :class="{'is-selected': selectedIdx === idx && idx <= 2 && actived }"
      @click="change2Mode(choice.mode, idx)"
    >
      <rz-icon :label="choice.icon"></rz-icon>
      {{ choice.modeText }}
    </li>
  </ul>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

import RzIcon from "pkg/icon";

import { t } from "rz/locale";

interface DrawingConf {
  mode: string;
  icon?: string;
  modeText: string;
}

@Component({
  name: "MapToolbar",
  components: {
    RzIcon
  }
})
export default class MapToolbar extends Vue {
  @Prop() drawingToolsConf!: DrawingConf[];

  @Prop({ required: true }) initialMode: string;

  toolConf: DrawingConf[] = [];

  mode: string = "";

  actived: boolean = false;

  selectedIdx: number = -1;

  initLock: boolean = false;

  defaultDrawingToolsConf: DrawingConf[] = [
    {
      mode: "rectangle",
      icon: "icon-rectangle",
      modeText: t("el.massTree.drawTool.rectangle")
    },
    {
      mode: "circle",
      icon: "icon-circle",
      modeText: t("el.massTree.drawTool.circle")
    },
    {
      mode: "polygon",
      icon: "icon-polygon",
      modeText: t("el.massTree.drawTool.polygon")
    },
    {
      mode: "clear",
      icon: 'icon-deleteC',
      modeText: t("el.massTree.drawTool.hander")
    }
  ];

  mounted() {
    this.toolConf = this.drawingToolsConf
      ? this.drawingToolsConf
      : this.defaultDrawingToolsConf;
    this.mode = this.initialMode;
    this.toolConf.forEach((conf, index) => {
      if (conf.mode === this.mode) {
        this.selectedIdx = index;
      }
    });
  }

  change2Mode(mode, idx) {
    if (mode === "clear") {
      this.actived = false;
      this.$emit("change", mode);
    } else {
      if (this.actived && this.selectedIdx === idx) {
        this.actived = false;
      } else if (this.actived && idx < 3) {
        this.selectedIdx = idx;
      } else {
        this.actived = !this.actived;
        this.selectedIdx = idx;
      }

      this.mode = this.actived ? mode : "hander";
      this.$emit("change", this.mode);
    }
  }
}
</script>