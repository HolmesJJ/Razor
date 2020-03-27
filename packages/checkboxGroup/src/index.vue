<script>
import Emitter from "rz/mixins/emitter";

export default {
  name: "CheckboxGroup",

  options: {
    name: "CheckboxGroup"
  },

  mixins: [Emitter],

  inject: {
    FormItem: {
      default: ""
    }
  },

  props: {
    value: {},
    disabled: Boolean,
    min: Number,
    max: Number,
    size: String,
    fill: String,
    textColor: String
  },

  computed: {
    _formItemSize() {
      return (this.FormItem || {}).formItemSize;
    },
    checkboxGroupSize() {
      return this.size || this._formItemSize || (this.$RAZOR || {}).size;
    }
  },

  watch: {
    value(value) {
      this.dispatch("FormItem", "el.form.change", [value]);
    }
  }
};
</script>

<template>
  <div class="rz-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>
