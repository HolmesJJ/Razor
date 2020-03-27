<template>
  <li
    @mouseenter="hoverItem"
    @click.stop="selectOptionClick"
    class="rz-select-dropdown__item"
    v-show="visible"
    :class="{
      'selected': itemSelected,
      'is-disabled': disabled || groupDisabled || limitReached,
      'hover': hover
    }"
  >
    <slot>
      <span>{{ currentLabel }}</span>
    </slot>
  </li>
</template>

<script lang="ts">

import { Vue, Component, Prop, Inject, Watch } from "vue-property-decorator";
import Emitter from "rz/mixins/emitter";
import { getValueByPath, escapeRegexpString } from "rz/utils/util";

@Component({
  name: "Option",
  mixins: [Emitter]
})
export default class Option extends Vue {
  @Prop({ type: [String, Number] })
  label: string | number;

  @Prop({ required: true })
  readonly value: any;

  @Prop({ type: Boolean })
  readonly parentCreated: boolean;

  @Prop({ type: Boolean, default: false })
  readonly disabled: boolean;

  @Inject({
    default: () => {
      return {};
    }
  })
  select: any;

  // mixins
  readonly dispatch: (parent: string, eventName: string, value?: any) => any;

  get isObject() {
    return (
      Object.prototype.toString.call(this.value).toLowerCase() ===
      "[object object]"
    );
  }
  get currentLabel() {
    return this.label || (this.isObject ? "" : this.value);
  }

  get currentValue() {
    return this.value || this.label || "";
  }

  get itemSelected() {
    if (!this.select.multiple) {
      return this.isEqual(this.value, this.select.value);
    } else {
      return this.contains(this.select.value, this.value);
    }
  }

  get limitReached() {
    if (this.select.multiple) {
      return (
        !this.itemSelected &&
        (this.select.value || []).length >= this.select.multipleLimit &&
        this.select.multipleLimit > 0
      );
    } else {
      return false;
    }
  }

  index: number = -1;
  groupDisabled: boolean = false;
  visible: boolean = true;
  hitState: boolean = false;
  hover: boolean = false;

  @Watch("currentLabel")
  handleCurrentLabelChange() {
    if (!this.parentCreated && !this.select.remote) {
      this.dispatch("Select", "setSelected");
    }
  }

  @Watch("value")
  handleValueChange(val, oldVal) {
    const { remote, valueKey } = this.select;
    if (!this.parentCreated && !remote) {
      if (
        valueKey &&
        typeof val === "object" &&
        typeof oldVal === "object" &&
        val[valueKey] === oldVal[valueKey]
      ) {
        return;
      }
      this.dispatch("Select", "setSelected");
    }
  }
  hoverItem() {
    if (!this.disabled && !this.groupDisabled) {
      this.select.hoverIndex = this.select.options.indexOf(this);
    }
  }
  selectOptionClick() {
    if (this.disabled !== true && this.groupDisabled !== true) {
      this.dispatch("Select", "handleOptionClick", [this, true]);
    }
  }

  isEqual(a, b) {
    if (!this.isObject) {
      return a === b;
    } else {
      const valueKey = this.select.valueKey;
      return getValueByPath(a, valueKey) === getValueByPath(b, valueKey);
    }
  }

  contains(arr = [], target) {
    if (!this.isObject) {
      return arr.indexOf(target) > -1;
    } else {
      const valueKey = this.select.valueKey;
      return arr.some(
        item =>
          getValueByPath(item, valueKey) === getValueByPath(target, valueKey)
      );
    }
  }
  queryChange(query) {
    this.visible =
      new RegExp(escapeRegexpString(query), "i").test(this.currentLabel) ||
      this.parentCreated;
    if (!this.visible) {
      this.select.filteredOptionsCount--;
    }
  }

  handleGroupDisabled(val) {
    this.groupDisabled = val;
  }

  created() {
    this.select.options.push(this);
    this.select.cachedOptions.push(this);
    this.select.optionsCount++;
    this.select.filteredOptionsCount++;

    this.$on("queryChange", this.queryChange);
    this.$on("handleGroupDisabled", this.handleGroupDisabled);
  }

  beforeDestroy() {
    this.select.onOptionDestroy(this.select.options.indexOf(this));
  }
}
</script>
