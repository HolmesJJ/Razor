<script>
const data = [{
    label: '一级 1',
    children: [{
      label: '二级 1-1',
      children: [{
        label: '三级 1-1-1'
      }]
    }]
  }, {
    label: '一级 2',
    children: [{
      label: '二级 2-1',
      children: [{
        label: '三级 2-1-1'
      }]
    }, {
      label: '二级 2-2',
      children: [{
        label: '三级 2-2-1'
      }]
    }]
  }, {
    label: '一级 3',
    children: [{
      label: '二级 3-1',
      children: [{
        label: '三级 3-1-1'
      }]
    }, {
      label: '二级 3-2',
      children: [{
        label: '三级 3-2-1'
      }]
    }]
  }];

  const data2 = [{
    id: 1,
    label: '一级 1',
    children: [{
      id: 4,
      label: '二级 1-1',
      children: [{
        id: 9,
        label: '三级 1-1-1'
      }, {
        id: 10,
        label: '三级 1-1-2'
      }]
    }]
  }, {
    id: 2,
    label: '一级 2',
    children: [{
      id: 5,
      label: '二级 2-1'
    }, {
      id: 6,
      label: '二级 2-2'
    }]
  }, {
    id: 3,
    label: '一级 3',
    children: [{
      id: 7,
      label: '二级 3-1'
    }, {
      id: 8,
      label: '二级 3-2'
    }]
  }];

  const data3 = [{
    id: 31,
    label: '一级 2',
    children: [{
      id: 33,
      label: '二级 2-1',
      children: [{
        id: 34,
        label: '三级 3-1-1'
      }, {
        id: 35,
        label: '三级 3-1-2',
        disabled: true
      }]
    }, {
      id: 32,
      label: '二级 2-2',
      disabled: true,
      children: [{
        id: 36,
        label: '三级 3-2-1'
      }, {
        id: 37,
        label: '三级 3-2-2',
        disabled: true
      }]
    }]
  }];

  const data6 = [{
    id: 1,
    label: '一级 1',
    children: [{
      id: 4,
      label: '二级 1-1',
      children: [{
        id: 9,
        label: '三级 1-1-1'
      }, {
        id: 10,
        label: '三级 1-1-2'
      }]
    }]
  }, {
    id: 2,
    label: '一级 2',
    children: [{
      id: 5,
      label: '二级 2-1'
    }, {
      id: 6,
      label: '二级 2-2'
    }]
  }, {
    id: 3,
    label: '一级 3',
    children: [{
      id: 7,
      label: '二级 3-1'
    }, {
      id: 8,
      label: '二级 3-2',
      children: [{
       id: 11,
        label: '三级 3-2-1'
      }, {
        id: 12,
        label: '三级 3-2-2'
      }, {
        id: 13,
        label: '三级 3-2-3'
      }]
    }]
  }];

  const defaultExpandedKeys = [2, 3];
  const defaultCheckedKeys = [5];

export default {
  methods: {
    handleNodeExpand(data, node, vueCom) {
      console.log("你展开了节点", data, node, vueCom);
    },
    handleCheckChange(nodeData, checked, indeterminate){
      console.log('handleCheckChange 你选择了',nodeData, checked, indeterminate)
    },
    getCheckedNodes(){
      console.log('获取已选择的节点',this.$refs.treeSelect.getCheckedNodes())
      return this.$refs.treeSelect.getCheckedNodes()
    },
    getCheckedKeys(){
      console.log('获取已选择的key',this.$refs.treeSelect.getCheckedKeys())
      return this.$refs.treeSelect.getCheckedKeys()
    },
    setCheckedNodes() {
      this.$refs.treeSelect.setCheckedNodes([{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 9,
        label: '三级 1-1-1'
      }]);
    },
    setCheckedKeys() {
      this.$refs.treeSelect.setCheckedKeys([3]);
    },
    resetChecked() {
      this.$refs.treeSelect.setCheckedKeys([]);
    },
    // 造数据
    makeNodes() {
      let nodeLength = 1000;
      let dataLength = 10;

      while (nodeLength > 0) {
        nodeLength--;
        let id = nodeLength + 100;

        var obj = {
          id: id,
          label: id + "label",
          children: []
        };

        for (let i = 0; i < 3; i++) {
          if (
            !this.data[i].children[0].children ||
            !this.data[i].children[0].children.length
          ) {
            this.data[i].children[0].children = [];
          }
          this.data[i].children[0].children.push(obj);
        }
        this.data = Object.freeze(this.data);
      }
    }
  },
  data() {
    return {
      props: {
        children: "children",
        label: "label",
        icon: "icon",
        visible: "visible"
      },
      i: 100,
      emptyText: "暂无数据",
      data,
      data,
      data2,
      data3,
      data4: JSON.parse(JSON.stringify(data2)),
      data5: JSON.parse(JSON.stringify(data2)),
      data6,
      nodeKey: "id",
      currentNodeKey: "",
      defaultExpandedKeys,
      defaultCheckedKeys,
    };
  },

  beforeCreate() {},
  created() {
    // 挂载节点试验
    // this.makeNodes();
  },

  mounted() {},
  updated() {}
};
</script>

## Tree 树形控件

### 基础用法

```
基础的树形结构展示,
[ highlightCurrent ] 高亮当前选择
data['label'] => data[ props['label'] ] , label 对应 props 设置 label 的 key
```

:::demo

```html
<template>
  <rz-tree
    :data="data"
    :props="props"
    :nodeKey="nodeKey"
    :currentNodeKey="currentNodeKey"
    :emptyText="emptyText"
    highlightCurrent
  >
    <span slot-scope="scopeData">{{scopeData.data.label}}</span>
  </rz-tree>
  <!-- :renderAfterExpand="false" -->
</template>

<script>
  export default {
    methods: {
      makeNodes() {
        let nodeLength = 1000;
        let dataLength = 10;

        while (nodeLength > 0) {
          nodeLength--;
          let id = nodeLength + 100;

          var obj = {
            id: id,
            label: id + "label",
            children: []
          };

          for (let i = 0; i < 3; i++) {
            if (
              !this.data[i].children[0].children ||
              !this.data[i].children[0].children.length
            ) {
              this.data[i].children[0].children = [];
            }
            this.data[i].children[0].children.push(obj);
          }
          this.data = Object.freeze(this.data);
        }
      }
    },
    data() {
      return {
        props: {
          children: "children",
          label: "label",
          icon: "icon",
          visible: "visible"
        },
        i: 100,
        emptyText: "暂无数据",
        data: [
          {
            id: 1,
            label: "一级 1",
            children: [
              {
                id: 4,
                label: "二级 1-1",
                children: [
                  {
                    id: 9,
                    label: "三级 1-1-1"
                  },
                  {
                    id: 10,
                    label: "三级 1-1-2"
                  }
                ]
              }
            ]
          },
          {
            id: 2,
            label: "一级 2",
            children: [
              {
                id: 5,
                label: "二级 2-1"
              },
              {
                id: 6,
                label: "二级 2-2"
              }
            ]
          },
          {
            id: 3,
            label: "一级 3",
            children: [
              {
                id: 7,
                label: "二级 3-1"
              },
              {
                id: 8,
                label: "二级 3-2"
              }
            ]
          }
        ],
        nodeKey: "id",
        currentNodeKey: ""
      };
    },

    beforeCreate() {},
    created() {
      // 挂载节点试验
      // this.makeNodes();
    },

    mounted() {},
    updated() {}
  };
</script>
```

:::

### 手风琴例子

#### Tips :

- 在单分组挂载节点挂载较多的情况下建议开启 accordion 手风琴模式,对用户的使用体验更为友好

- [ renderAfterExpand ] 的选项建议为 true ,组件如无特殊声明,则默认为 true
  置为 false 会导致首次渲染过慢不适合多节点渲染

:::demo

```html
<template>
  <rz-tree
    accordion
    :data="data"
    :props="props"
    :nodeKey="nodeKey"
    :currentNodeKey="currentNodeKey"
    :emptyText="emptyText"
    @node-expand="handleNodeExpand"
  >
    <span slot-scope="scopeData">{{scopeData.data.label}}</span>
  </rz-tree>
  <!-- :renderAfterExpand="false" -->
</template>

<script>
  export default {
    methods: {
      handleNodeExpand(data, node, vueCom) {
        console.log("你展开了节点", data, node, vueCom);
      }
    },
    data() {
      return {
        props: {
          children: "children",
          label: "label",
          icon: "icon",
          visible: "visible"
        },
        i: 100,
        emptyText: "暂无数据",
        data: [
          {
            id: 1,
            label: "一级 1",
            children: [
              {
                id: 4,
                label: "二级 1-1",
                children: [
                  {
                    id: 9,
                    label: "三级 1-1-1"
                  },
                  {
                    id: 10,
                    label: "三级 1-1-2"
                  }
                ]
              }
            ]
          },
          {
            id: 2,
            label: "一级 2",
            children: [
              {
                id: 5,
                label: "二级 2-1"
              },
              {
                id: 6,
                label: "二级 2-2"
              }
            ]
          },
          {
            id: 3,
            label: "一级 3",
            children: [
              {
                id: 7,
                label: "二级 3-1"
              },
              {
                id: 8,
                label: "二级 3-2"
              }
            ]
          }
        ],
        nodeKey: "id",
        currentNodeKey: ""
      };
    }
  };
</script>
```

:::

### 手风琴 结合 checkbox 实现节点选择

:::demo

```html
<template>
  <rz-tree
    accordion
    showCheckbox
    :data="data"
    :props="props"
    :nodeKey="nodeKey"
    :currentNodeKey="currentNodeKey"
    :emptyText="emptyText"
    @check-change="handleCheckChange"
  >
    <span slot-scope="scopeData">{{scopeData.data.label}}</span>
  </rz-tree>
</template>

<script>
  export default {
    methods: {
      handleCheckChange(nodeData, checked, indeterminate) {
        console.log(
          "handleCheckChange 你选择了",
          nodeData,
          checked,
          indeterminate
        );
      }
    },
    data() {
      return {
        props: {
          children: "children",
          label: "label",
          icon: "icon",
          visible: "visible"
        },
        i: 100,
        emptyText: "暂无数据",
        data: [
          {
            id: 1,
            label: "一级 1",
            children: [
              {
                id: 4,
                label: "二级 1-1",
                children: [
                  {
                    id: 9,
                    label: "三级 1-1-1"
                  },
                  {
                    id: 10,
                    label: "三级 1-1-2"
                  }
                ]
              }
            ]
          },
          {
            id: 2,
            label: "一级 2",
            children: [
              {
                id: 5,
                label: "二级 2-1"
              },
              {
                id: 6,
                label: "二级 2-2"
              }
            ]
          },
          {
            id: 3,
            label: "一级 3",
            children: [
              {
                id: 7,
                label: "二级 3-1"
              },
              {
                id: 8,
                label: "二级 3-2"
              }
            ]
          }
        ],
        nodeKey: "id",
        currentNodeKey: ""
      };
    }
  };
</script>

<style>
  .demo-block .demo-tree-row {
    margin: 10px 0;
  }
</style>
```

:::

### 默认展开和默认选中

- 可将 Tree 的某些节点设置为默认展开或默认选中
- 分别通过[ default-expanded-keys ] 和[ default-checked-keys ]设置默认展开和默认选中的节点。
- 需要注意的是，此时必须设置[ node-key ]，其值为节点数据中的一个字段名，该字段在整棵树中是唯一的。

:::demo

```html
<template>
  <rz-tree
    ref="treeSelect"
    accordion
    showCheckbox
    :data="data2"
    :props="props"
    :nodeKey="nodeKey"
    :emptyText="emptyText"
    :default-expanded-keys="defaultExpandedKeys"
    :default-checked-keys="defaultCheckedKeys"
  >
    <span slot-scope="scopeData">{{scopeData.data.label}}</span>
  </rz-tree>
  <rz-row class="demo-tree-row">
    <rz-button type="primary" @click="getCheckedNodes"
      >get checked nodes</rz-button
    >
    <rz-button type="primary" @click="getCheckedKeys"
      >get checked keys</rz-button
    >
  </rz-row>
  <rz-row class="demo-tree-row">
    <rz-button type="primary" @click="setCheckedKeys"
      >set checked keys</rz-button
    >
    <rz-button type="primary" @click="setCheckedNodes"
      >set checked nodes</rz-button
    >
  </rz-row>
  <rz-row class="demo-tree-row">
    <rz-button type="primary" @click="resetChecked">reset checked</rz-button>
  </rz-row>
</template>

<script>
  export default {
    methods: {
      handleCheckChange(nodeData, checked, indeterminate) {
        console.log(
          "handleCheckChange 你选择了",
          nodeData,
          checked,
          indeterminate
        );
      },
      getCheckedNodes() {
        console.log(
          "获取已选择的节点",
          this.$refs.treeSelect.getCheckedNodes()
        );
        return this.$refs.treeSelect.getCheckedNodes();
      },
      setCheckedNodes() {
        this.$refs.treeSelect.setCheckedNodes([
          {
            id: 5,
            label: "二级 2-1"
          },
          {
            id: 9,
            label: "三级 1-1-1"
          }
        ]);
      },
      setCheckedKeys() {
        this.$refs.treeSelect.setCheckedKeys([3]);
      },
      resetChecked() {
        this.$refs.treeSelect.setCheckedKeys([]);
      },
      getCheckedKeys() {
        console.log("获取已选择的key", this.$refs.treeSelect.getCheckedKeys());
        return this.$refs.treeSelect.getCheckedKeys();
      }
    },
    data() {
      return {
        props: {
          children: "children",
          label: "label"
        },
        i: 100,
        emptyText: "暂无数据",
        data2: [
          {
            id: 1,
            label: "一级 1",
            children: [
              {
                id: 4,
                label: "二级 1-1",
                children: [
                  {
                    id: 9,
                    label: "三级 1-1-1"
                  },
                  {
                    id: 10,
                    label: "三级 1-1-2"
                  }
                ]
              }
            ]
          },
          {
            id: 2,
            label: "一级 2",
            children: [
              {
                id: 5,
                label: "二级 2-1"
              },
              {
                id: 6,
                label: "二级 2-2"
              }
            ]
          },
          {
            id: 3,
            label: "一级 3",
            children: [
              {
                id: 7,
                label: "二级 3-1"
              },
              {
                id: 8,
                label: "二级 3-2"
              }
            ]
          }
        ],
        nodeKey: "id",
        currentNodeKey: ""
      };
    }
  };
</script>
```

:::

### disabled 选项 控制节点可用状态

:::demo

```html
<template>
  <rz-tree
    showCheckbox
    :data="data3"
    :props="props"
    :nodeKey="nodeKey"
    :default-expanded-keys="[32, 33]"
    :default-checked-keys="[35]"
    :emptyText="emptyText"
    @check-change="handleCheckChange"
  >
    <span slot-scope="scopeData">{{scopeData.data.label}}</span>
  </rz-tree>
</template>

<script>
  export default {
    methods: {
      handleCheckChange(nodeData, checked, indeterminate) {
        console.log(
          "handleCheckChange 你选择了",
          nodeData,
          checked,
          indeterminate
        );
      }
    },
    data() {
      return {
        props: {
          children: "children",
          label: "label",
          icon: "icon",
          visible: "visible"
        },
        i: 100,
        emptyText: "暂无数据",
        data3: [
          {
            id: 31,
            label: "一级 2",
            children: [
              {
                id: 33,
                label: "二级 2-1",
                children: [
                  {
                    id: 34,
                    label: "三级 3-1-1"
                  },
                  {
                    id: 35,
                    label: "三级 3-1-2",
                    disabled: true
                  }
                ]
              },
              {
                id: 32,
                label: "二级 2-2",
                disabled: true,
                children: [
                  {
                    id: 36,
                    label: "三级 3-2-1"
                  },
                  {
                    id: 37,
                    label: "三级 3-2-2",
                    disabled: true
                  }
                ]
              }
            ]
          }
        ],
        nodeKey: "id",
        currentNodeKey: ""
      };
    }
  };
</script>
```

:::

#### 其他组件参考

- 对比 element-ui / ant-design / iview 三个主要 Vue UI 组件库中,同一分组底下挂载一千个节点 ant-design, iview 两个组件库展开需要 2-3 秒;
- elementUI 在一千个节点情况下去除一些多余的功能后基本优化达到 [ 一秒 ] 左右 优势明显;

#### elementUI tree 作为基础的优势

- elementUI 通过外部数据管理方式做到不让 vue 实时 observe 动态挂载节点的方式
- 算法优化方面 函数方法已经改良过一些,做到千级节点秒级响应 ,
- elementUI 另有一个其他的优化, 在节点挂载过一遍后,页面的展开节点会变的顺畅。

#### 给产品的建议

- 建议后期都使用手风琴模式，这样可以做到同同时展开的分组只有一个，分组节点的渲染可以做到最少。
  提高优化渲染速度，并能提高用户体验
- 建议分组节点在 600 - 800 节点之前比较合适,响应速度大约在 0.5s

### Attributes

| 参数                  | 说明                                                                                                             | 类型                              | 可选值 | 默认值 |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------ | ------ |
| data                  | 展示数据                                                                                                         | array                             | —      | —      |
| empty-text            | 内容为空的时候展示的文本                                                                                         | String                            | —      | —      |
| node-key              | 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的                                                             | String                            | —      | —      |
| props                 | 配置选项，具体看下表                                                                                             | object                            | —      | —      |
| render-after-expand   | 是否在第一次展开某个树节点后才渲染其子节点                                                                       | boolean                           | —      | true   |
| load                  | 加载子树数据的方法，仅当 lazy 属性为 true 时生效                                                                 | function(node, resolve)           | —      | —      |
| render-content        | 树节点的内容区的渲染 Function                                                                                    | Function(h, { node, data, store } | —      | —      |
| highlight-current     | 是否高亮当前选中节点，默认值是 false。                                                                           | boolean                           | —      | false  |
| default-expand-all    | 是否默认展开所有节点                                                                                             | boolean                           | —      | false  |
| expand-on-click-node  | 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。 | boolean                           | —      | true   |
| check-on-click-node   | 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点。                                 | boolean                           | —      | false  |
| auto-expand-parent    | 展开子节点的时候是否自动展开父节点                                                                               | boolean                           | —      | true   |
| default-expanded-keys | 默认展开的节点的 key 的数组                                                                                      | array                             | —      | —      |
| show-checkbox         | 节点是否可被选择                                                                                                 | boolean                           | —      | false  |
| check-strictly        | 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false                                           | boolean                           | —      | false  |
| default-checked-keys  | 默认勾选的节点的 key 的数组                                                                                      | array                             | —      | —      |
| filter-node-method    | 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏                  | Function(value, data, node)       | —      | —      |
| accordion             | 是否每次只打开一个同级树节点展开                                                                                 | boolean                           | —      | false  |
| indent                | 相邻级节点间的水平缩进，单位为像素                                                                               | number                            | —      | 16     |
| lazy                  | 是否懒加载子节点，需与 load 方法结合使用                                                                         | boolean                           | —      | false  |

### props

| 参数     | 说明                                                     | 类型                          | 可选值 | 默认值 |
| -------- | -------------------------------------------------------- | ----------------------------- | ------ | ------ |
| label    | 指定节点标签为节点对象的某个属性值                       | string, function(data, node)  | —      | —      |
| children | 指定子树为节点对象的某个属性值                           | string                        | —      | —      |
| disabled | 指定节点选择框是否禁用为节点对象的某个属性值             | boolean, function(data, node) | —      | —      |
| isLeaf   | 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效 | boolean, function(data, node) | —      | —      |

### 方法

`Tree` 内部使用了 Node 类型的对象来包装用户传入的数据，用来保存目前节点的状态。
`Tree` 拥有如下方法：

| 方法名              | 说明                                                                                      | 参数                                                                                                                                             |
| ------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| filter              | 对树节点进行筛选操作                                                                      | 接收一个任意类型的参数，该参数会在 filter-node-method 中作为第一个参数                                                                           |
| updateKeyChildren   | 通过 keys 设置节点子元素，使用此方法必须设置 node-key 属性                                | (key, data) 接收两个参数，1. 节点 key 2. 节点数据的数组                                                                                          |
| getCheckedNodes     | 若节点可被选择（即 `show-checkbox` 为 `true`），则返回目前被选中的节点所组成的数组        | (leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 `false` 2. 是否包含半选节点，默认值为 `false`          |
| setCheckedNodes     | 设置目前勾选的节点，使用此方法必须设置 node-key 属性                                      | (nodes) 接收勾选节点数据的数组                                                                                                                   |
| getCheckedKeys      | 若节点可被选择（即 `show-checkbox` 为 `true`），则返回目前被选中的节点的 key 所组成的数组 | (leafOnly) 接收一个 boolean 类型的参数，若为 `true` 则仅返回被选中的叶子节点的 keys，默认值为 `false`                                            |
| setCheckedKeys      | 通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性                            | (keys, leafOnly) 接收两个参数，1. 勾选节点的 key 的数组 2. boolean 类型的参数，若为 `true` 则仅设置叶子节点的选中状态，默认值为 `false`          |
| setChecked          | 通过 key / data 设置某个节点的勾选状态，使用此方法必须设置 node-key 属性                  | (key/data, checked, deep) 接收三个参数，1. 勾选节点的 key 或者 data 2. boolean 类型，节点是否选中 3. boolean 类型，是否设置子节点 ，默认为 false |
| getHalfCheckedNodes | 若节点可被选择（即 `show-checkbox` 为 `true`），则返回目前半选中的节点所组成的数组        | -                                                                                                                                                |
| getHalfCheckedKeys  | 若节点可被选择（即 `show-checkbox` 为 `true`），则返回目前半选中的节点的 key 所组成的数组 | -                                                                                                                                                |
| getCurrentKey       | 获取当前被选中节点的 key，使用此方法必须设置 node-key 属性，若没有节点被选中则返回 null   | —                                                                                                                                                |
| getCurrentNode      | 获取当前被选中节点的 node，若没有节点被选中则返回 null                                    | —                                                                                                                                                |
| setCurrentKey       | 通过 key 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性                     | (key) 待被选节点的 key，若为 null 则取消当前高亮的节点                                                                                           |
| setCurrentNode      | 通过 node 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性                    | (node) 待被选节点的 node                                                                                                                         |
| getNode             | 根据 data 或者 key 拿到 Tree 组件中的 node                                                | (data) 要获得 node 的 key 或者 data                                                                                                              |
| remove              | 删除 Tree 中的一个节点，使用此方法必须设置 node-key 属性                                  | (data) 要删除的节点的 data 或者 node                                                                                                             |
| append              | 为 Tree 中的一个节点追加一个子节点                                                        | (data, parentNode) 接收两个参数，1. 要追加的子节点的 data 2. 子节点的 parent 的 data、key 或者 node                                              |
| insertBefore        | 为 Tree 的一个节点的前面增加一个节点                                                      | (data, refNode) 接收两个参数，1. 要增加的节点的 data 2. 要增加的节点的后一个节点的 data、key 或者 node                                           |
| insertAfter         | 为 Tree 的一个节点的后面增加一个节点                                                      | (data, refNode) 接收两个参数，1. 要增加的节点的 data 2. 要增加的节点的前一个节点的 data、key 或者 node                                           |

### Events

| 事件名称       | 说明                         | 回调参数                                                                                                                                                           |
| -------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| node-click     | 节点被点击时的回调           | 共三个参数，依次为：传递给 `data` 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。                                                                  |
| check-change   | 节点选中状态发生变化时的回调 | 共三个参数，依次为：传递给 `data` 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点                                               |
| check          | 当复选框被点击的时候触发     | 共两个参数，依次为：传递给 `data` 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性 |
| current-change | 当前选中节点变化时触发的事件 | 共两个参数，依次为：当前节点的数据，当前节点的 Node 对象                                                                                                           |
| node-expand    | 节点被展开时触发的事件       | 共三个参数，依次为：传递给 `data` 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身                                                                    |
| node-collapse  | 节点被关闭时触发的事件       | 共三个参数，依次为：传递给 `data` 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身                                                                    |

### Scoped Slot

| name | 说明                                      |
| ---- | ----------------------------------------- |
| —    | 自定义树节点的内容，参数为 { node, data } |
