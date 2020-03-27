<template>
  <!-- topbar 顶部栏 -->
  <div class="rz-tree-map__topbar">
    <div class="rz-tree-map__count">{{t('el.massTree.selectedCount', { selected: count})}}</div>
    <div class="rz-tree-map__type">
      <span>{{t('el.massTree.selectedType')}}</span>
      <rz-select
        :value="cameraType"
        :placeholder="t('el.massTree.doSelect')"
        @change="handleSelectChange"
        :disabled="!editable"
      >
        <rz-option
          v-for="option in cameraTypeOptions"
          :key="option.value"
          :value="option.value"
          :label="option.label"
        ></rz-option>
      </rz-select>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import MessageBox from "pkg/messageBox";

import store from "../service/store";

import Locale from "rz/mixins/locale";

@Component({
  mixins: [Locale]
})
export default class Topbar extends Vue {
  get count(): number {
    return store.getters.getSelectedCount;
  }

  @Prop(Array) cameraTypeOptions: { value: string | number; label: string }[];

  @Prop({
    type: Boolean,
    default: true
  })
  editable: boolean;

  @Prop({
    type: [String, Number]
  })
  defaultType: string | number;

  @Watch("cameraTypeOptions")
  onChange(val) {
    if (val) {
      if (this.defaultType !== undefined) {
        this.cameraType = this.defaultType;
      } else {
        this.cameraType = val[0].value;
      }
    }
  }

  @Watch("defaultType", { immediate: true })
  onTypeChange(val) {
    this.cameraType = val;
  }

  cameraType: string | number = "";

  handleSelectChange(event) {
    MessageBox.confirm("视频源切换之后已设置的数据将被清空，是否切换?", {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    }).then(() => {
      this.cameraType = event;
      this.$emit("camera-type-change", event);
    });
  }
}
</script>
