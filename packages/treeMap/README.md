### TreeMap

```
视频源基本用法
```

:::demo

```html
<template>
  <div>
    <rz-button type="primary" @click.native="visible = !visible"
      >打开视频源选择器</rz-button
    >
    <rz-dialog
      title="选择视频源"
      :visible.sync="visible"
      width="80%"
      @open="handleOpen"
      @close="handleClose"
    >
      <div style="height: 660px">
        <rz-tree-map
          ref="treeMap"
          :data="data"
          :treeProps="treeProps"
          :mapProps="mapProps"
          @select-change="handleSelectChange"
          @tree-loaded="handleLoaded"
        ></rz-tree-map>
      </div>

      <span slot="footer" class="dialog-footer">
        <rz-button type="info" @click="visible = false">取 消</rz-button>
        <rz-button type="primary" @click="handleConfirm">确 定</rz-button>
      </span>
    </rz-dialog>
  </div>
  <!-- :renderAfterExpand="false" -->
</template>

<script>
  import MockService from "./mock/fetch.ts";
  export default {
    data() {
      return {
        visible: false,
        data: [],
        treeProps: {
          loading: false
        },
        mapProps: {
          mapConfig: {
            type: "baidu",
            content: {
              url:
                "http://api.map.baidu.com/getscript?v=2.0&ak=ecLlUVteVbnznhXOD2ad67bcmrQgOKi8&services=&t=20171031174121",
              theme: "midnight",
              // drawingManagerUrl: './assets/baiduMapDrawingTool/baiduMapDrawManager.js',
              // drawingManagerCss: "./assets/baiduMapDrawingTool/baiduMapDrawManager.css"
            },
            setting: {
              center: [113.924229, 22.485389],
              zoom: 8,
              minZoom: 3,
              maxZoom: 18
            }
          },
          center: [113.924229, 22.485389],
          zoom: 12
        }
      };
    },
    methods: {
      handleOpen() {
        this.treeProps.loading = true;
        MockService.fetch().then(data => {
          this.data = data;
          this.treeProps.loading = false;
        });
      },
      handleClose() {
        this.$refs.treeMap.destroyTree();
        this.data = [];
        this.$refs.treeMap.resetStore();
      },
      handleConfirm() {
        console.log("选中的视频源", this.$refs.treeMap.getSelectedNode());
      },
      handleSelectChange(event) {
        console.log("select-change", event);
      },
      handleLoaded() {
        this.$refs.treeMap.setSelect(["sunglass1.264"], "name", true);
      }
    }
  };
</script>

<style>
  .rz-dialog__body {
    padding: 0;
  }
</style>
```

:::

### Attributes

| 参数      | 说明                                             | 类型         | 可选值 | 默认值 |
| --------- | ------------------------------------------------ | ------------ | ------ | ------ |
| data      | 传入的原始数据, 必须得保证是树结构。             | Tree, Tree[] | -      | -      |
| treeProps | 树组件的 Props, 具体可参考 [bigDataTree] 的 参数 | -            | -      | -      |
| mapProps  | 地图组件 Props, 具体可参考 [sMap] 的参数         | -            | -      | -      |
