### MassTreeMap

视频源基本用法

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
      width="1342px"
      @open="handleOpen"
      @close="handleClose"
    >
      <div style="height: 731px">
        <rz-mass-tree-map
          v-if="visible"
          ref="treeMap"
          :treeProps="treeProps"
          :mapProps="mapProps"
          :cameraTypeOptions="cameraTypeOptions"
          :editable="editable"
          :defaultType="defaultType"
          @select-change="handleSelectChange"
          @camera-type-change="handleCameraTypeChange"
        ></rz-mass-tree-map>
      </div>

      <span slot="footer" class="dialog-footer">
        <rz-button type="info" @click="visible = false">取 消</rz-button>
        <rz-button type="primary" @click="handleConfirm">确 定</rz-button>
      </span>
    </rz-dialog>
  </div>
</template>

<script>
  import MockService from "./__mock__/fetch.ts";
  export default {
    data() {
      return {
        editable: true,
        defaultType:'mall',
        visible: false,
        treeProps: {
          loading: false
        },
        cameraTypeOptions: [
          {
            value: "default",
            label: "默认"
          },
          {
            value: "mall",
            label: "商场"
          }
        ],
        mapProps: {
          showToolbar: true,
          mapConfig: {
            type: "baidu",
            content: {
              url:
                "http://api.map.baidu.com/getscript?v=2.0&ak=ecLlUVteVbnznhXOD2ad67bcmrQgOKi8&services=&t=20171031174121",
              theme: "midnight"
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
          this.$refs.treeMap.loadData(data).then(() => {
            this.treeProps.loading = false;
            this.$refs.treeMap.setSelect(["bXt2lgfWtG"], true);
          });
        });
      },
      handleClose() {
        this.$refs.treeMap.destroy();
      },
      handleConfirm() {
        console.log("选中的视频源", this.$refs.treeMap.getSelectedLeaf());
        this.visible = false;
      },
      handleSelectChange(event) {
        console.log("select-change", event);
      },
      handleLoaded() {
        this.$refs.treeMap.setSelect(["sunglass1.264"], "name", true);
      },
      handleCameraTypeChange(event) {
        console.log("视频源类型", event);
        this.handleOpen();
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

| 参数                         | 说明                                                   | 类型    | 可选值 | 默认值 |
| ---------------------------- | ------------------------------------------------------ | ------- | ------ | ------ |
| treeProps                    | 树的配置，具体见 massTree 文档                         | -       | -      | -      |
| mapProps.mapConfig           | 地图的配置，具体见 sMap 文档                           | -       | -      | -      |
| mapProps.showToolbar(已废弃) | 是否显示框选栏                                         | boolean | -      | true   |
| editable                     | 是否可以编辑，当为true时，会显示框选栏，可进行类型切换 | boolean | -      | true   |
| defaultType                  | 默认的类型                                             | string  | -      |        |

### Events

| 事件名        | 说明                          | 参数                                                                         |
| ------------- | ----------------------------- | ---------------------------------------------------------------------------- |
| select-change | 当有视频源勾选状态 改变时触发 | { select: boolean, node: []}, select: 是否勾选 ， node: 状态改变的视频源数组 |
| tree-loaded   | 当树的数据加载完毕时触发      | -                                                                            |
