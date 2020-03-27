<template>
  <div
    class="rz-form-item"
    :class="[{
      'rz-form-item--feedback': Form && Form.statusIcon,
      'is-error': validateState === 'error',
      'is-validating': validateState === 'validating',
      'is-success': validateState === 'success',
      'is-required': isRequired || required
    },
    sizeClass ? 'rz-form-item--' + sizeClass : ''
  ]"
  >
    <label
      :for="labelFor"
      class="rz-form-item__label"
      :style="labelStyle"
      v-if="label || $slots.label" 
    >
      <slot name="label">{{label + form.labelSuffix}}</slot>
    </label>
    <div class="rz-form-item__content" :style="contentStyle">
      <slot></slot>
      <transition name="rz-zoom-in-top">
        <div
          v-if="validateState === 'error' && showMessage && form.showMessage"
          class="rz-form-item__error"
          :class="{
            'rz-form-item__error--inline': typeof inlineMessage === 'boolean'
              ? inlineMessage
              : (Form && Form.inlineMessage || false)
          }"
        ><rz-icon class="rz-form-item__icon" :class="iconClass" v-if="showIcon" :name="icon"></rz-icon>{{validateMessage}}</div>
      </transition>
    </div> 
  </div>
</template>
<script>
import AsyncValidator from "async-validator";
import emitter from "rz/mixins/emitter";
import objectAssign from "rz/utils/merge";
import { noop, getPropByPath } from "rz/utils/util";

export default {
  name: "FormItem",

  options: {
    name: "FormItem"
  },

  mixins: [emitter],

  provide() {
    return {
      FormItem: this
    };
  },

  inject: ["Form"],

  props: {
    label: String,
    labelWidth: String,
    prop: String,
    required: {
      type: Boolean,
      default: undefined
    },
    rules: [Object, Array],
    error: String,
    validateStatus: String,
    for: String,
    inlineMessage: {
      type: [String, Boolean],
      default: ""
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    size: String,
    showIcon: { type: Boolean ,default: true},
    icon: { type: String, default: "warning"},
    iconClass:Object
  },
  watch: {
    error: {
      immediate: true,
      handler(value) {
        this.validateMessage = value;
        this.validateState = value ? "error" : "";
      }
    },
    validateStatus(value) {
      this.validateState = value;
    }
  },
  computed: {
    labelFor() {
      return this.for || this.prop;
    },
    labelStyle() {
      const ret = {};
      if (this.Form.labelPosition === "top") return ret;
      const labelWidth = this.labelWidth || this.Form.labelWidth;
      if (labelWidth) {
        ret.width = labelWidth;
      }
      return ret;
    },
    contentStyle() {
      const ret = {};
      const label = this.label;
      if (this.Form.labelPosition === "top" || this.Form.inline) return ret;
      if (!label && !this.labelWidth && this.isNested) return ret;
      const labelWidth = this.labelWidth || this.Form.labelWidth;
      if (labelWidth) {
        ret.marginLeft = labelWidth;
      }
      return ret;
    },
    form() {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== "Form") {
        if (parentName === "FormItem") {
          /* eslint-disable-next-line */
          this.isNested = true;
        }
        parent = parent.$parent;
        parentName = parent.$options.name;
      }
      return parent;
    },
    fieldValue() {
      const model = this.Form.formData;
      if (!model || !this.prop) {
        return;
      }

      let path = this.prop;
      if (path.indexOf(":") !== -1) {
        path = path.replace(/:/, ".");
      }

      return getPropByPath(model, path, true).v;
    },
    isRequired() {
      let rules = this.getRules();
      let isRequired = false;

      if (rules && rules.length) {
        rules.every(rule => {
          if (rule.required) {
            isRequired = true;
            return false;
          }
          return true;
        });
      }
      return isRequired;
    },
    _formSize() {
      return this.Form.size;
    },
    FormItemSize() {
      return this.size || this._formSize;
    },
    sizeClass() {
      return this.FormItemSize || (this.$RAZOR || {}).size;
    },
  },
  data() {
    return {
      validateState: "",
      validateMessage: "",
      validateDisabled: false,
      validator: {},
      isNested: false
    };
  },
  methods: {
    validate(trigger, callback = noop) {
      this.validateDisabled = false;
      const rules = this.getFilteredRule(trigger);
      if ((!rules || rules.length === 0) && this.required === undefined) {
        callback();
        return true;
      }

      this.validateState = "validating";

      const descriptor = {};
      if (rules && rules.length > 0) {
        rules.forEach(rule => {
          delete rule.trigger;
        });
      }
      descriptor[this.prop] = rules;

      const validator = new AsyncValidator(descriptor);
      const model = {};

      model[this.prop] = this.fieldValue;

      validator.validate(
        model,
        { firstFields: true },
        (errors, invalidFields) => {
          this.validateState = !errors ? "success" : "error";
          this.validateMessage = errors ? errors[0].message : "";

          callback(this.validateMessage, invalidFields);
          this.Form && this.Form.$emit("validate", this.prop, !errors);
        }
      );
    },
    clearValidate() {
      this.validateState = "";
      this.validateMessage = "";
      this.validateDisabled = false;
    },
    resetField() {
      this.validateState = "";
      this.validateMessage = "";

      let model = this.Form.formData;
      let value = this.fieldValue;
      let path = this.prop;
      if (path.indexOf(":") !== -1) {
        path = path.replace(/:/, ".");
      }

      let prop = getPropByPath(model, path, true);

      this.validateDisabled = true;
      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(this.initialValue);
      } else {
        prop.o[prop.k] = this.initialValue;
      }

      this.broadcast("TimeSelect", "fieldReset", this.initialValue);
    },
    getRules() {
      let formRules = this.Form ? this.Form.rules : undefined;
      const selfRules = this.rules;
      const requiredRule =
        this.required !== undefined ? { required: !!this.required } : [];

      const prop = getPropByPath(formRules, this.prop || "");
      formRules = formRules ? prop.o[this.prop || ""] || prop.v : [];

      return [].concat(selfRules || formRules || []).concat(requiredRule);
    },
    getFilteredRule(trigger) {
      const rules = this.getRules();

      return rules
        .filter(rule => {
          if (!rule.trigger || trigger === "") return true;
          if (Array.isArray(rule.trigger)) {
            return rule.trigger.indexOf(trigger) > -1;
          } else {
            return rule.trigger === trigger;
          }
        })
        .map(rule => objectAssign({}, rule));
    },
    onFieldBlur() {
      this.validate("blur");
    },
    onFieldChange() {
      if (this.validateDisabled) {
        this.validateDisabled = false;
        return;
      }

      this.validate("change");
    }
  },
  mounted() {
    if (this.prop) {
      this.dispatch("Form", "el.form.addField", [this]);

      let initialValue = this.fieldValue;
      if (Array.isArray(initialValue)) {
        initialValue = [].concat(initialValue);
      }
      Object.defineProperty(this, "initialValue", {
        value: initialValue
      });

      let rules = this.getRules();

      if (rules.length || this.required !== undefined) {
        this.$on("el.form.blur", this.onFieldBlur);
        this.$on("el.form.change", this.onFieldChange);
      }
    }
  },
  beforeDestroy() {
    this.dispatch("Form", "el.form.removeField", [this]);
  }
};
</script>
