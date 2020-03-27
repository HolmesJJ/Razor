<template>
  <div
    :class="[
    type === 'textarea' ? 'rz-textarea' : 'rz-input',
    inputSize ? 'rz-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'rz-input-group': $slots.prepend || $slots.append,
      'rz-input-group--append': $slots.append,
      'rz-input-group--prepend': $slots.prepend,
      'rz-input--prefix': $slots.prefix || prefixIcon,
      'rz-input--suffix': $slots.suffix || suffixIcon || clearable || isWordLimitVisible
    }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="rz-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input
        :tabindex="tabindex"
        v-if="type !== 'textarea'"
        class="rz-input__inner"
        v-bind="$attrs"
        :type="type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autoComplete || autocomplete"
        ref="input"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label"
      >
      <!-- @compositionupdate="handleComposition" -->
      <!-- 前置内容 -->
      <span class="rz-input__prefix" v-if="$slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="rz-input__icon" v-if="prefixIcon" :class="prefixIcon"></i>
      </span>
      <!-- 后置内容 -->
      <span
        class="rz-input__suffix"
        v-if="$slots.suffix || suffixIcon || showClear || validateState && needStatusIcon || isWordLimitVisible"
      >
        <span class="rz-input__suffix-inner">
          <template v-if="!showClear">
            <slot name="suffix"></slot>
            <i class="rz-input__icon" v-if="suffixIcon" :class="suffixIcon"></i>
          </template>
          <i v-else class="rz-input__icon rz-icon-circle-close rz-input__clear" @click="clear"></i>
        </span>
        <span v-if="isWordLimitVisible" class="rz-input__count">
          <span class="rz-input__count-inner">
            {{ textLength }}/{{ upperLimit }}
          </span>
        </span>
        <i
          class="rz-input__icon"
          v-if="validateState"
          :class="['rz-input__validateIcon', validateIcon]"
        ></i>
      </span>
      <!-- 后置元素 -->
      <div class="rz-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      :tabindex="tabindex"
      class="rz-textarea__inner"
      @compositionstart="handleCompositionStart"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      ref="textarea"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :readonly="readonly"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
    ></textarea>
    <span
      v-if="isWordLimitVisible && type === 'textarea'"
      class="rz-input__count"
    >{{ textLength }}/{{ upperLimit }}</span>
  </div>
</template>
<script>
import emitter from "rz/mixins/emitter";
import Migrating from "rz/mixins/migrating";
import calcTextareaHeight from "./calcTextareaHeight";
import merge from "rz/utils/merge";
import { isKorean } from "rz/utils/shared";

export default {
  name: "Input",

  options: {
    name: "Input"
  },

  mixins: [emitter, Migrating],

  inheritAttrs: false,

  inject: {
    Form: {
      default: ""
    },
    FormItem: {
      default: ""
    }
  },

  data() {
    return {
      currentValue:
        this.value === undefined || this.value === null ? "" : this.value,
      textareaCalcStyle: {},
      hovering: false,
      focused: false,
      isComposing: false,
      passwordVisible: false,
      isOnComposition: false,
      valueBeforeComposition: null
    };
  },

  props: {
    value: [String, Number],
    size: String,
    resize: String,
    Form: String,
    disabled: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: "text"
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    autocomplete: {
      type: String,
      default: "off"
    },
    /** @Deprecated in next major version */
    autoComplete: {
      type: String,
      /* eslint-disable-next-line */
      validator(val) {
        process.env.NODE_ENV !== "production" &&
          console.warn(
            "[Razor Warn][Input]'auto-complete' property will be deprecated in next major version. please use 'autocomplete' instead."
          );
        return true;
      }
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false
    },
    tabindex: String,
    showWordLimit: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    _formItemSize() {
      return (this.FormItem || {}).FormItemSize;
    },
    validateState() {
      return this.FormItem ? this.FormItem.validateState : "";
    },
    needStatusIcon() {
      return this.Form ? this.Form.statusIcon : false;
    },
    validateIcon() {
      return {
        validating: "rz-icon-loading",
        success: "rz-icon-circle-check",
        error: "rz-icon-circle-close"
      }[this.validateState];
    },
    textareaStyle() {
      return merge({}, this.textareaCalcStyle, { resize: this.resize });
    },
    inputSize() {
      return this.size || this._formItemSize || (this.$RAZOR || {}).size;
    },
    inputDisabled() {
      return this.disabled || (this.Form || {}).disabled;
    },
    nativeInputValue() {
      return this.value === null || this.value === undefined
        ? ""
        : String(this.value);
    },
    showClear() {
      return (
        this.clearable &&
        !this.disabled &&
        !this.readonly &&
        this.currentValue !== "" &&
        (this.focused || this.hovering)
      );
    },
    isWordLimitVisible() {
      return (
        this.showWordLimit &&
        this.$attrs.maxlength &&
        (this.type === "text" || this.type === "textarea") &&
        !this.inputDisabled &&
        !this.readonly
      );
    },
    upperLimit() {
      return this.$attrs.maxlength;
    },
    textLength() {
      if (typeof this.value === "number") {
        return String(this.value).length;
      }

      return (this.value || "").length;
    },
  },

  watch: {
    value(val) {
      this.$nextTick(this.resizeTextarea);
      if (this.validateEvent) {
        this.dispatch("FormItem", "el.form.change", [val]);
      }
    },
    // native input value is set explicitly
    // do not use v-model / :value in template
    // see: https://github.com/ElemeFE/element/issues/14521
    nativeInputValue() {
      this.setNativeInputValue();
    },
    // when change between <input> and <textarea>,
    // update DOM dependent value and styles
    // https://github.com/ElemeFE/element/issues/14857
    type() {
      this.$nextTick(() => {
        this.setNativeInputValue();
        this.resizeTextarea();
        this.updateIconOffset();
      });
    }
  },

  methods: {
    focus() {
      this.getInput().focus();
    },
    blur() {
      this.getInput().blur();
    },
    getMigratingConfig() {
      return {
        props: {
          icon: "icon is removed, use suffix-icon / prefix-icon instead.",
          "on-icon-click": "on-icon-click is removed."
        },
        events: {
          click: "click is removed."
        }
      };
    },
    handleBlur(event) {
      this.focused = false;
      this.$emit("blur", event);
      if (this.validateEvent) {
        this.dispatch("FormItem", "el.form.blur", [this.currentValue]);
      }
    },
    select() {
      this.getInput().select();
    },
    resizeTextarea() {
      if (this.$isServer) return;
      const { autosize, type } = this;
      if (type !== "textarea") return;
      if (!autosize) {
        this.textareaCalcStyle = {
          minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
        };
        return;
      }
      const minRows = autosize.minRows;
      const maxRows = autosize.maxRows;

      this.textareaCalcStyle = calcTextareaHeight(
        this.$refs.textarea,
        minRows,
        maxRows
      );
    },
    setNativeInputValue() {
      const input = this.getInput();
      if (!input) return;
      if (input.value === this.nativeInputValue) return;
      input.value = this.nativeInputValue;
    },
    handleFocus(event) {
      this.focused = true;
      this.$emit("focus", event);
    },
    handleComposition(event) {
      if (event.type === "compositionend") {
        this.isOnComposition = false;
        this.currentValue = this.valueBeforeComposition;
        this.valueBeforeComposition = null;
        this.handleInput(event);
      } else {
        const text = event.target.value;
        const lastCharacter = text[text.length - 1] || "";
        this.isOnComposition = !isKorean(lastCharacter);
        if (this.isOnComposition && event.type === "compositionstart") {
          this.valueBeforeComposition = text;
        }
      }
    },
    handleCompositionStart() {
      this.isComposing = true;
    },
    handleCompositionEnd(event) {
      this.isComposing = false;
      this.handleInput(event);
    },
    handleInput(event) {
      // should not emit input during composition
      // see: https://github.com/ElemeFE/element/issues/10516
      if (this.isComposing) return;

      // hack for https://github.com/ElemeFE/element/issues/8548
      // should remove the following line when we don't support IE
      if (event.target.value === this.nativeInputValue) return;

      this.currentValue = event.target.value;
      
      this.$emit("input", event.target.value);

      // ensure native input value is controlled
      // see: https://github.com/ElemeFE/element/issues/12850
      this.$nextTick(this.setNativeInputValue);
    },
    handleChange(event) {
      this.$emit("change", event.target.value);
    },
    setCurrentValue(value) {
      if (this.isOnComposition && value === this.valueBeforeComposition) return;
      this.currentValue = value;
      if (this.isOnComposition) return;
      this.$nextTick(this.resizeTextarea);
      if (this.validateEvent && this.currentValue === this.value) {
        this.dispatch("FormItem", "el.form.change", [value]);
      }
    },
    calcIconOffset(place) {
      let elList = [].slice.call(
        this.$el.querySelectorAll(`.rz-input__${place}`) || []
      );
      if (!elList.length) return;
      let el = null;
      for (let i = 0; i < elList.length; i++) {
        if (elList[i].parentNode === this.$el) {
          el = elList[i];
          break;
        }
      }
      if (!el) return;
      const pendantMap = {
        suffix: "append",
        prefix: "prepend"
      };

      const pendant = pendantMap[place];
      if (this.$slots[pendant]) {
        el.style.transform = `translateX(${place === "suffix" ? "-" : ""}${
          this.$el.querySelector(`.rz-input-group__${pendant}`).offsetWidth
        }px)`;
      } else {
        el.removeAttribute("style");
      }
    },
    updateIconOffset() {
      this.calcIconOffset("prefix");
      this.calcIconOffset("suffix");
    },
    clear() {
      this.$emit("input", "");
      this.$emit("change", "");
      this.$emit("clear");
      // this.setCurrentValue("");
      // this.focus();
    },
    getInput() {
      return this.$refs.input || this.$refs.textarea;
    },
    getSuffixVisible() {
      return (
        this.$slots.suffix ||
        this.suffixIcon ||
        this.showClear ||
        this.showPassword ||
        this.isWordLimitVisible ||
        (this.validateState && this.needStatusIcon)
      );
    }
  },

  created() {
    this.$on("inputSelect", this.select);
  },

  mounted() {
    this.setNativeInputValue();
    this.resizeTextarea();
    this.updateIconOffset();
  },

  updated() {
    this.$nextTick(this.updateIconOffset);
  }
};
</script>
