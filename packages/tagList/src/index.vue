<template>
  <div class="rz-tagList">
    <rz-tag
      :popover-delay="popoverDelay"
      :key="index"
      v-for="(tag,index) in list"
      @click="handleClickTag(tag)"
      :activated="!!getTagState(tag)"
      size="large"
    >{{ tag.label }}</rz-tag>
  </div>
</template>

<script lang='ts'>

import { Vue, Component, Prop, Watch, Emit } from "vue-property-decorator";
import RzTag from "pkg/tag";

let $tagId = 0;
@Component({
  name: "TagList",
  components: {
    RzTag
  }
})
export default class TagList extends Vue {
  @Prop({
    type: Array,
    default() {
      return [];
    }
  })
  data: any[];

  @Prop({
    type: Array,
    default() {
      return [];
    }
  })
  selectList: any[];

  @Prop({
    type: String,
    default: "label"
  })
  labelKey: string;

  @Prop({
    type: String,
    default: "id"
  })
  idKey: string;

  // 单选多选
  @Prop({
    type: String,
    default: "multiple"
  })
  mode: string;

  // 单选多选
  @Prop({
    type: Boolean,
    default: false
  })
  atLeastOne: boolean;

  // 单选多选
  @Prop({
    type: Number,
    default: 0
  })
  popoverDelay: number;

  list: any[] = [];
  selectMap: any = {};

  @Watch("data")
  handleDataChange(value) {
    this.list = this.generateList(value);
  }

  @Watch("selectList")
  handleSelectListChange() {
    this.generateList(this.list);
  }

  @Emit("change")
  emitChange({ tag, selectList }) {
    return { tag, selectList };
  }

  created() {
    this.list = this.generateList(this.data);
  }

  // 生成列表
  generateList(list) {
    const _self = this;
    this.selectMap = {};
    const hasIdKey = this.hasIdKey();
    const result = list.map(item => {
      const tag = { ...item };
      tag.label = item[_self.labelKey];
      const id =
        typeof tag[_self.idKey] !== "undefined" ? tag[_self.idKey] : $tagId++;
      tag.id = id;
      this.$set(_self.selectMap, id, !!_self.isSelected(item, hasIdKey));
      return tag;
    });
    return result;
  }

  isSelected(tag, hasIdKey: boolean = false) {
    const _self = this;
    let flag = false;
    if (hasIdKey) {
      flag = this.selectList.find(item => {
        if (_self.idKey && item[_self.idKey]) {
          return item[_self.idKey] === tag[_self.idKey];
        }
      });
    } else {
      flag = this.selectList.find(item => {
        return item[_self.labelKey] === tag[_self.labelKey];
      });
    }
    return flag;
  }

  hasIdKey() {
    return this.data.length && this.data.every(item => item[this.idKey]);
  }

  getTagState(tag) {
    const { id } = tag;
    return this.selectMap[id];
  }

  // 点选
  handleClickTag(tag) {
    let selectList = [...this.selectList];
    const id = tag[this.idKey];
    let _tag = { ...tag };
    const hasIdKeyFlag = this.hasIdKey(); // 是否有唯一标识

    if (!hasIdKeyFlag) {
      delete _tag[this.idKey];
    }

    if (this.selectMap[id]) {
      // 单选模式
      // 至少要有一个选择
      if (this.mode === "radio" && this.atLeastOne) {
        return;
      }
      selectList = selectList.filter(item => {
        if (hasIdKeyFlag) {
          return item[this.idKey] !== id;
        }
        return item[this.labelKey] !== tag[this.labelKey];
      });
      this.$set(this.selectMap, id, false);
    } else {
      // 单选模式
      if (this.mode === "radio") {
        Object.keys(this.selectMap).forEach(k => {
          this.$set(this.selectMap, k, false);
        });
        selectList = [];
      }
      selectList.push(_tag);
      this.$set(this.selectMap, id, true);
    }

    this.emitChange({ tag: _tag, selectList });
  }
}
</script>
