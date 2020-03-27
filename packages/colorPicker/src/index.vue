<template>
  <!-- 编写 colorPicker 组件 -->
  <rz-select class="rz-colorPicker" :value="curValue" @input="select" :placeholder="placeholder">
    <rz-option v-for="item in list" :value="item.value" :label="item.label" :key="item.label">
      <li class="rz-colorPicker__option" @click.stop="click(item)">
        <div
          v-if="item.value !== unlimitedValue"
          class="rz-colorPicker__option--color"
          :style="{backgroundColor: item.color || 'white'}"
        ></div>
        <div v-if="item.value === unlimitedValue" class="rz-colorPicker__option--color is-unlimited">
          <span></span>
        </div>
        <div class="rz-colorPicker__option--text">{{ item.label }}</div>
        <rz-checkbox class="rz-colorPicker__option--checkbox" v-model="item.checked"></rz-checkbox>
      </li>
    </rz-option>
  </rz-select>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import RzSelect from "pkg/select";
import RzCheckbox from "pkg/checkbox";

@Component({
  name: "ColorPicker",
  components: {
    RzSelect,
    RzCheckbox
  }
})
export default class ColorPicker extends Vue {
  @Prop({
    type: Array,
    required: true,
    default() {
      return [];
    }
  })
  data: any[];

  @Prop({
    type: String,
    default: "请选择"
  })
  placeholder: string;

  @Prop({
    type: String,
    default: ""
  })
  selectValue: string;

  @Prop({
    type: String,
    default: "-1"
  })
  unlimitedValue: string;

  @Prop({
    type: Boolean,
    default: false
  })
  selectFirstDefault: boolean;

  curValue = "";

  get list() {
    return this.data.map(item => {
      const razorChecked = item.value === this.curValue;
      return {
        ...item,
        checked: razorChecked
      };
    });
  }

  @Watch('selectValue')
  handleSelectChange(value){
    this.curValue = value;
  }

  created() {
    if (this.selectValue) {
      this.curValue = this.selectValue;
    } else if (this.selectFirstDefault) {
      this.curValue = this.data[0].value;
    }
  }

  select() {}

  click(item) {
    this.curValue = item.value;
    delete item.checked;
    this.$emit("change", { ...item });
  }
}
</script>
