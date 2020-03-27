<template>
  <label
    class="rz-checkbox"
    :class="[
      border && checkboxSize ? 'rz-checkbox--' + checkboxSize : '',
      { 'is-disabled': isDisabled },
      { 'is-bordered': border },
      { 'is-checked': isChecked },
      { 'is-circle': circle}
    ]"
    role="checkbox"
    :aria-checked="indeterminate ? 'mixed': isChecked"
    :aria-disabled="isDisabled"
    :id="id"
  >
    <span
      class="rz-checkbox__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focus
      }"
      aria-checked="mixed"
    >
      <span class="rz-checkbox__inner"></span>

      <input
        v-if="trueLabel || falseLabel"
        class="rz-checkbox__original"
        type="checkbox"
        aria-hidden="true"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        v-model="model"
        @change="handleChange"
        @click.stop="handleClick"
        @focus="focus = true"
        @blur="focus = false"
      />
      <input
        v-else
        class="rz-checkbox__original"
        type="checkbox"
        aria-hidden="true"
        :disabled="isDisabled"
        :value="label"
        :name="name"
        v-model="model"
        @change="handleChange"
        @click.stop="handleClick"
        @focus="focus = true"
        @blur="focus = false"
      />
    </span>
    <span class="rz-checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Emitter from "rz/mixins/emitter";

@Component({
  name: "Checkbox",
  mixins: [Emitter],
  inject: {
    Form: {
      default: ""
    },
    FormItem: {
      default: ""
    }
  }
})
export default class Checkbox extends Vue {
  readonly dispatch: (parent: string, eventName: string, value: any) => any;
  readonly Form: any; // inject todo 是否按这个方式实现
  readonly FormItem: any; // inject todo 是否按这个方式实现

  _checkboxGroup: any;
  selfModel: boolean = false;
  focus: boolean = false;
  isLimitExceeded: boolean = false;

  @Prop()
  value: any;

  @Prop()
  readonly label: any;

  @Prop({ type: Boolean })
  readonly indeterminate: boolean;

  @Prop({ type: Boolean })
  readonly disabled: boolean;

  @Prop({ type: Boolean })
  readonly checked: boolean;

  @Prop({ type: String })
  readonly name: string;

  @Prop({ default: false })
  readonly circle: boolean;

  @Prop({ type: [String, Number] })
  readonly trueLabel: string | number;

  @Prop({ type: [String, Number] })
  readonly falseLabel: any;

  @Prop({ type: String })
  readonly id: string; /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/

  @Prop({ type: String }) // 实践例如tree
  readonly controls: string; /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/

  @Prop({ type: Boolean })
  readonly border: boolean;

  @Prop({ type: String })
  readonly size: string;

  get model() {
    return this.isGroup
      ? this.store
      : this.value !== undefined
        ? this.value
        : this.selfModel;
  }
  set model(val) {
    if (this.isGroup) {
      this.isLimitExceeded = false;
      this._checkboxGroup.min !== undefined &&
        val.length < this._checkboxGroup.min &&
        (this.isLimitExceeded = true);

      this._checkboxGroup.max !== undefined &&
        val.length > this._checkboxGroup.max &&
        (this.isLimitExceeded = true);

      this.isLimitExceeded === false &&
        this.dispatch("CheckboxGroup", "input", [val]); // event dispatch 是否真的需要 todo
    } else {
      this.$emit("input", val);
      this.selfModel = val;
    }
  }

  get isChecked() {
    if ({}.toString.call(this.model) === "[object Boolean]") {
      return this.model;
    } else if (Array.isArray(this.model)) {
      return this.model.indexOf(this.label) > -1;
    } else if (this.model !== null && this.model !== undefined) {
      return this.model === this.trueLabel;
    }
    return false;
  }

  get isGroup() {
    let parent = this.$parent;
    while (parent) {
      if (parent.$options.name !== "CheckboxGroup") {
        parent = parent.$parent;
      } else {
        this._checkboxGroup = parent;
        return true;
      }
    }
    return false;
  }

  get store() {
    return this._checkboxGroup ? this._checkboxGroup.value : this.value;
  }

  get isDisabled() {
    return this.isGroup
      ? (this._checkboxGroup && this._checkboxGroup.disabled) ||
          this.disabled ||
          (this.Form || {}).disabled
      : this.disabled || (this.Form || {}).disabled;
  }

  get formItemSize() {
    return (this.FormItem || {}).FormItemSize;
  }
  get checkboxSize() {
    const temCheckboxSize = this.size || this.formItemSize;
    // || (this.$RAZOR || {}).size; // todo $RAZOR 代表??
    return this.isGroup
      ? this._checkboxGroup.checkboxGroupSize || temCheckboxSize
      : temCheckboxSize;
  }

  @Watch("value")
  changeValue(val) {
    this.dispatch("FormItem", "el.form.change", val);
  }

  addToStore() {
    if (Array.isArray(this.model) && this.model.indexOf(this.label) === -1) {
      this.model.push(this.label);
    } else {
      this.model = this.trueLabel || true;
    }
  }

  handleChange(ev) {
    if (this.isLimitExceeded) return;
    let value;
    if (ev.target.checked) {
      value = this.trueLabel === undefined ? true : this.trueLabel;
    } else {
      value = this.falseLabel === undefined ? false : this.falseLabel;
    }
    this.$emit("change", value, ev);
    this.$nextTick(() => {
      this.focus = false;
      if (this.isGroup) {
        // 父级传递,todo 是否这么做
        this.dispatch("CheckboxGroup", "change", [this._checkboxGroup.value]);
      }
    });
  }

  handleClick(ev) {
    this.$emit("click", ev);
  }

  created() {
    this.checked && this.addToStore();
  }

  mounted() {
    // 为indeterminate元素 添加aria-controls 属性
    if (this.indeterminate) {
      this.$el.setAttribute("aria-controls", this.controls);
    }
  }
}
</script>
