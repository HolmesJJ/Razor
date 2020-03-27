<template>
  <!-- todo 国际化 -->
  <!-- topbar 顶部栏 -->
  <div class="rz-tree-map__topbar">
    <div class="rz-tree-map__count">
      已选择
      <span>{{count}}</span>
      个视频源
    </div>
    <div class="rz-tree-map__type">
      <span>选择视频源类型</span>
      <rz-select v-model="cameraType" placeholder="请选择" @change="handleSelectChange">
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

import { Vue, Component } from "vue-property-decorator";

import store from "./service/store";

@Component
export default class Topbar extends Vue {
  get count(): number {
    return store.getters.getSelectedCount;
  }

  cameraType: number = 0;

  //   可配置？ 返回啥呢？ value or label
  cameraTypeOptions: any = [
    {
      value: 0,
      label: "默认"
    },
    {
      value: 1,
      label: "商场"
    },
    {
      value: 2,
      label: "写字楼"
    }
  ];

  handleSelectChange(event) {
    store.commit("setCameraType", event);
  }
}
</script>
