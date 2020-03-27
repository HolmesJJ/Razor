### BigDataTree

<style>
.tree-demo {
  height: 600px;
  padding: 0;
  margin-bottom: 30px;
}
.tree-row {
  margin-top: 30px;
}
</style>

### 数据结构

```ts
class TreeNode {
  _id!: string;
  type!: "node" | "leaf" | "root";
  level!: number;
  maxLevel?: number;

  statistics!: Statistics | null;

  // 标志位
  selected: boolean = false;
  expanded: boolean = false;
  highlight: boolean = false;
  indeterminate: boolean = false;
  childRendered: boolean = false;

  customData: any;
  children: TreeNode[] = [];
}
```

bigDataTree 组件内置了遍历函数，会对传进来的树进行遍历，然后重新生成新的树，所以需要保证传入的原始数据是一个树结构、或者树结构数组。树节点的数据结构如上所示。
对于每个节点的用户数据会存在 `TreeNode` 的 `customData` 里

### 基础用法

:::demo

```html
<template>
  <div>
    <div class="tree-demo">
      <rz-big-data-tree
        searchPlaceholder="请输入叶子节点名称"
        :allow-select="allowSelect"
        :showStatistics="showSta"
        :showCount="showCount"
        labelKey="name"
        :loading="loading"
        :icon="{node: 'menu', leaf: 'view'}"
        :allowSearch="true"
        :expandLevel="expandLevel"
        :highlights="highlight"
        @click="handleClick"
        @node-click="handleNodeClick"
        @select-change="handleSelectChange"
        ref="tree"
      ></rz-big-data-tree>
    </div>
    <rz-row class="tree-row">
      <rz-button type="primary" @click="getSelectedNode"
        >获取所有选中节点数据</rz-button
      >
      <rz-button type="primary" @click="getSelectedLeaf"
        >获取所有选中叶子数据</rz-button
      >
      <rz-button type="primary" @click="setHighlight"
        >设置叶子节点高亮</rz-button
      >
      <rz-button type="primary" @click="setSelect">设置选中节点</rz-button>
    </rz-row>
    <rz-row class="tree-row">
      <rz-on-off v-model="allowSelect" active-text="显示勾选框"></rz-on-off>
      <rz-on-off v-model="showSta" active-text="显示统计信息"></rz-on-off>
      <rz-on-off v-model="showCount" active-text="显示叶子节点数"></rz-on-off>
    </rz-row>
  </div>
</template>

<script>
  import { genData, fetchData } from "./__mock__/data.js";
  import treeData from "./__mock__/treeData2.json";
  import { travelsal } from "./libs/tree-travelsal.ts";
  export default {
    data() {
      return {
        allowSelect: false,
        selected: false,
        loading: false,
        expandLevel: 1,
        showSta: true,
        showCount: false,
        isHightlight: false,
        highlight: {
          content: [],
          key: "name"
        }
      };
    },
    created() {
      this.loadData();
    },
    methods: {
      handleClick(event) {
        console.log(event);
      },
      handleSelectChange(event) {
        console.log(event);
      },
      getSelectedNode() {
        console.log(this.$refs.tree.getSelectedNode());
      },
      getSelectedLeaf() {
        console.log(this.$refs.tree.getSelectedLeaf());
      },
      handleNodeClick(event) {
        console.log("node-click", event);
      },
      loadData() {
        this.loading = true;
        fetchData(true)
          .then(data => {
            this.$refs.tree.loadData(data);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      setHighlight() {
        if (this.isHightlight) {
          this.highlight.content = [
            "名字很长长长长 Level 1-1-1",
            "名字很长长长长 Level 1-1-3"
          ];
          this.isHightlight = false;
        } else {
          this.highlight.content = [
            "名字很长长长长 Level 1-1-1",
            "名字很长长长长 Level 1-1-2"
          ];
          this.isHightlight = true;
        }
      },
      setSelect() {
        this.selected = !this.selected;
        this.$refs.tree.setSelect(
          [
            { name: "名字很长长长长 Level 1-1-1" },
            { name: "名字很长长长长 Level 1-1-2" }
          ],
          "name",
          this.selected
        );
      }
    }
  };
</script>
```

:::

### Attributes

| 参数                  | 说明                                                                                                                                              | 类型                                       | 可选值                                                                                                               | 默认值                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| data                  | 传入的原始数据, 必须得保证是树结构。                                                                                                              | Tree, Tree[]                               | -                                                                                                                    | -                                                               |
| allowSelect           | 是否显示勾选框，是否可勾选                                                                                                                        | boolean                                    | -                                                                                                                    | false                                                           |
| selectAll             | 是否勾选全部                                                                                                                                      | boolean                                    | -                                                                                                                    | false                                                           |
| showStatistics        | 是否显示统计信息                                                                                                                                  | boolean                                    | -                                                                                                                    | false                                                           |
| showCount             | 是否显示叶子节点数, 当显示统计信息时会隐藏                                                                                                        | boolean                                    | -                                                                                                                    | false                                                           |
| labelKey              | 根据哪一个属性值来显示节点名称                                                                                                                    | string                                     | -                                                                                                                    | 'name'                                                          |
| pageSize              | 滚动加载子节点时，每次滚动加载的数量, 建议不要小于 20                                                                                             | number                                     | -                                                                                                                    | 20                                                              |
| icon                  | 叶子节点和非叶子节点的 icon 样式, 不传时则不显示图标                                                                                              | { node: string, leaf: string}              | -                                                                                                                    | -                                                               |
| allowSearch           | 是否开启搜索功能                                                                                                                                  | boolean                                    | -                                                                                                                    | false                                                           |
| searchTypeLabel       | 搜索框类型文字提示, 目前的搜索只支持两种类型，按非叶子节点搜索(node),按叶子节点搜索 (leaf)                                                        | {node: string; leaf: string}               | -                                                                                                                    | {node: '部门' , leaf: '视频源'}                                 |
| searchTypePlaceholder | 搜索框类型 placeholder 文字提示, 目前的搜索只支持两种类型，按非叶子节点搜索(node),按叶子节点搜索 (leaf)                                           | {node: string; leaf: string}               | -                                                                                                                    | {node: '请输入部门名称' , leaf: '请输入视频源名称'}             |
| expandLevel           | 默认展开的层级                                                                                                                                    | number                                     | -                                                                                                                    | 0                                                               |
| highlights            | 高亮的数据信息, 根据 key 去 customData 里查找是否在 content 中，如果在则高亮显示                                                                  | { content: string[], key: string}          | -                                                                                                                    | -                                                               |
| travelKey             | 遍历函数所使用的 健 信息，根据 travelKey 去判断原始的树结构中，哪些属性表示子节点                                                                 | { resourceKey: string, subNodeKey: string} | -                                                                                                                    | {resourceKey: "resources", subNodeKey: "subTreeNodes"}          |
| filterMethod          | 搜索函数,自定义搜索时的筛选函数，内置的搜索函数采用的是 String.includes 方法，target 为 TreeNode 里的 customData 对象，content 为搜索框输入的内容 | (target: any, content: string) => boolean  | 例子: filterMethod = (target: any, content: string) => target.id === content, 用来判断节点的 id 是否和输入的内容相符 | (target: any, content: string) => target.name.includes(content) |

### Events

| 事件名        | 说明           | 参数                                                                 |
| ------------- | -------------- | -------------------------------------------------------------------- |
| click         | 点击节点时触发 | 节点的原始数据                                                       |
| node-click    | 点击节点时触发 | 节点的 TreeNode 数据                                                 |
| hover         | hover 时触发   | 节点的原始数据                                                       |
| node-hover    | hover 时触发   | 节点的 TreeNode 数据                                                 |
| select-change | 勾选改变时触发 | { select: tree, node: [] } select 属性表示是否选中， node 为数据数组 |

### Slots

| 事件名 | 说明                   |
| ------ | ---------------------- |
| empty  | 当没有数据时显示空样式 |

### Methods

| 方法名              | 说明                                                        | 参数                                                                              |
| ------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------- |
| destroyTee          | 手动销毁树组件                                              | -                                                                                 |
| getSelectedNode     | 获取所有选中的节点数据, 返回 TreeNode 结构                  | -                                                                                 |
| getSelectedNodeData | 获取所有选中的节点的原始数据，返回 TreeNode 的 customData   | -                                                                                 |
| getSelectedLeaf     | 获取所有选中的叶子节点数据，返回 TreeNode 结构              | -                                                                                 |
| getSelectedLeafData | 获取所有选中的叶子节点原始数据，返回 TreeNode 的 customData | -                                                                                 |
| setSelect           | 手动设置选中节点                                            | contents 数组，需要选定的内容，key: 判断健，selected 是否选中, 例子见上面演示代码 |
| setExpandMaxLevel   | 展开至最后一层                                              | -                                                                                 |
