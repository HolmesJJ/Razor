<template>
  <label
    class="rz-radio-button"
    :class="[
      size ? 'rz-radio-button--' + size : '',
      { 'is-active': value === label },
      { 'is-disabled': isDisabled },
      { 'is-focus': focus }
    ]"
    role="radio"
    :aria-checked="value === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="value = isDisabled ? value : label"
  >
    <!-- v-ripple="{
      enable: withRipple && !isDisabled,
      color: withRipple? rippleColor:'',
    }"-->
    <input
      class="rz-radio-button__orig-radio"
      :value="label"
      type="radio"
      v-model="value"
      :name="name"
      @change="handleChange"
      :disabled="isDisabled"
      tabindex="-1"
      @focus="focus = true"
      @blur="focus = false"
    />
    <span
      class="rz-radio-button__inner"
      :style="value === label ? activeStyle : null"
      @keydown.stop
    >
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
import Emitter from "rz/mixins/emitter";
// import ripple from "rz/directive/ripple.js";

export default {
  name: "RadioButton",

  options: {
    name: "RadioButton"
  },
  directives: {
    // ripple
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
    label: {},
    disabled: Boolean,
    name: String
    // rippleColor: {
    //   default: 'rgba(255,255,255, .35)',
    //   type: String
    // },
    // withRipple: {
    //   default: true,
    //   type: Boolean
    // }
  },
  data() {
    return {
      focus: false
    };
  },
  computed: {
    value: {
      get() {
        return this._radioGroup.value;
      },
      set(value) {
        this._radioGroup.$emit("input", value);
      }
    },
    _radioGroup() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.name !== "RadioGroup") {
          parent = parent.$parent;
        } else {
          return parent;
        }
      }
      return false;
    },
    activeStyle() {
      return {
        backgroundColor: this._radioGroup.fill || "",
        borderColor: this._radioGroup.fill || "",
        boxShadow: this._radioGroup.fill
          ? `-1px 0 0 0 ${this._radioGroup.fill}`
          : "",
        color: this._radioGroup.textColor || ""
      };
    },
    _formItemSize() {
      return (this.FormItem || {}).FormItemSize;
    },
    size() {
      return (
        this._radioGroup.radioGroupSize ||
        this._formItemSize ||
        (this.$RAZOR || {}).size
      );
    },
    isDisabled() {
      return (
        this.disabled || this._radioGroup.disabled || (this.Form || {}).disabled
      );
    },
    tabIndex() {
      return !this.isDisabled
        ? this._radioGroup
          ? this.value === this.label
            ? 0
            : -1
          : 0
        : -1;
    }
  },

  methods: {
    handleChange() {
      this.$nextTick(() => {
        this.dispatch("RadioGroup", "handleChange", this.value);
      });
    }
  }
};
</script>
