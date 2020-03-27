<template>
  <form
    class="rz-form"
    :class="[
    labelPosition ? 'rz-form--label-' + labelPosition : '',
    { 'rz-form--inline': inline }
  ]"
  >
    <slot></slot>
  </form>
</template>
<script>
import objectAssign from "rz/utils/merge";

export default {
  name: "Form",

  options: {
    name: "Form"
  },

  provide() {
    return {
      Form: this
    };
  },

  props: {
    formData: Object,
    rules: Object,
    labelPosition: String,
    labelWidth: String,
    labelSuffix: {
      type: String,
      default: ""
    },
    inline: Boolean,
    inlineMessage: Boolean,
    statusIcon: Boolean,
    showMessage: {
      type: Boolean,
      default: true
    },
    size: String,
    disabled: Boolean,
    validateOnRuleChange: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    model: {
      get() {
        return this.formData;
      }
    }
  },
  watch: {
    rules() {
      if (this.validateOnRuleChange) {
        this.validate(() => {});
      }
    }
  },
  data() {
    return {
      fields: []
    };
  },
  created() {
    this.$on("el.form.addField", field => {
      if (field) {
        this.fields.push(field);
      }
    });
    /* istanbul ignore next */
    this.$on("el.form.removeField", field => {
      if (field.prop) {
        this.fields.splice(this.fields.indexOf(field), 1);
      }
    });
  },
  methods: {
    resetFields() {
      if (!this.model) {
        process.env.NODE_ENV !== "production" &&
          console.warn(
            "[Razor Warn][Form]model is required for resetFields to work."
          );
        return;
      }
      this.fields.forEach(field => {
        if (typeof field === "object" && toString.call(field) === "[object Array]") {
          field.forEach(f=>{
            if (typeof f.resetField !== "function" || toString.call(f.resetField) !== "[object Function]") {
              throw new Error("[Razor Warn][Form Item] resetField must be a function.");
            }
            f.resetField();
          })
          return
        }
        field.resetField();
      });
    },
    clearValidate(props = []) {
      const fields = props.length
        ? this.fields.filter(field => props.indexOf(field.prop) > -1)
        : this.fields;
      fields.forEach(field => {
        field.clearValidate();
      });
    },
    validate(callback) {
      if (!this.model) {
        console.warn(
          "[Razor Warn][Form]model is required for validate to work!"
        );
        return;
      }

      let promise;
      // if no callback, return promise
      if (typeof callback !== "function" && window.Promise) {
        promise = new window.Promise((resolve, reject) => {
          callback = function(valid) {
            valid ? resolve(valid) : reject(valid);
          };
        });
      }

      let valid = true;
      let count = 0;
      // 如果需要验证的fields为空，调用验证时立刻返回callback
      if (this.fields.length === 0 && callback) {
        callback(true);
      }
      let invalidFields = {};
      this.fields.forEach(field => {
        field.validate("", (message, field) => {
          if (message) {
            valid = false;
          }
          invalidFields = objectAssign({}, invalidFields, field);
          if (
            typeof callback === "function" &&
            ++count === this.fields.length
          ) {
            callback(valid, invalidFields);
          }
        });
      });

      if (promise) {
        return promise;
      }
    },
    validateField(prop, cb) {
      let field = this.fields.filter(field => field.prop === prop)[0];
      if (!field) {
        throw new Error("must call validateField with valid prop string!");
      }

      field.validate("", cb);
    }
  }
};
</script>
