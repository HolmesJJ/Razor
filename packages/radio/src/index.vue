<template>
  <label
    class="rz-radio"
    :class="[
      border && radioSize ? 'rz-radio--' + radioSize : '',
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },
      { 'is-bordered': border },
      { 'is-checked': model === label }
    ]"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <span
      class="rz-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    >
      <span class="rz-radio__inner"></span>
      <input
        class="rz-radio__original"
        :value="label"
        type="radio"
        aria-hidden="true"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
      >
    </span>
    <span class="rz-radio__label" @keydown.stop>
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
import Emitter from "rz/mixins/emitter";


export default {
  name: "Radio",

  options: {
    name: "Radio"
  },

  mixins: [Emitter],

  inject: {
    Form: {
      default: ""
    },

    FormItem: {
      default: ""
    }
  },

  props: {
    value: {},
    label: {},
    disabled: Boolean,
    name: String,
    border: Boolean,
    size: String
  },

  data() {
    return {
      focus: false
    };
  },
  computed: {
    isGroup() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.name !== "RadioGroup") {
          parent = parent.$parent;
        } else {
          /* eslint-disable-next-line */
          this._radioGroup = parent;
          return true;
        }
      }
      return false;
    },
    model: {
      get() {
        return this.isGroup ? this._radioGroup.value : this.value;
      },
      set(val) {
        if (this.isGroup) {
          this.dispatch("RadioGroup", "input", [val]);
        } else {
          this.$emit("input", val);
        }
      }
    },
    _formItemSize() {
      return (this.FormItem || {}).FormItemSize;
    },
    radioSize() {
      const temRadioSize =
        this.size || this._formItemSize || (this.$RAZOR || {}).size;
      return this.isGroup
        ? this._radioGroup.radioGroupSize || temRadioSize
        : temRadioSize;
    },
    isDisabled() {
      return this.isGroup
        ? this._radioGroup.disabled ||
            this.disabled ||
            (this.Form || {}).disabled
        : this.disabled || (this.Form || {}).disabled;
    },
    tabIndex() {
      return !this.isDisabled
        ? this.isGroup
          ? this.model === this.label
            ? 0
            : -1
          : 0
        : -1;
    }
  },

  methods: {
    handleChange() {
      this.$nextTick(() => {
        this.$emit("change", this.model);
        this.isGroup &&
          this.dispatch("RadioGroup", "handleChange", this.model);
      });
    }
  }
};
</script>
