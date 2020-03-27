<template>
  <div
    class="rz-on-off"
    :class="{ 'is-disabled': switchDisabled, 'is-checked': checked, 'is-text': isTextType }"
    role="on-off"
    :aria-checked="checked"
    :aria-disabled="switchDisabled"
    @click="switchValue"
  >
    <input
      class="rz-on-off__input"
      type="checkbox"
      @change="handleChange"
      ref="input"
      :id="id"
      :name="name"
      :true-value="activeValue"
      :false-value="inactiveValue"
      :disabled="switchDisabled"
      @keydown.enter="switchValue"
    />
    <div class="rz-on-off__default-core" v-if="!isTextType">
      <span
        :class="['rz-on-off__label', 'rz-on-off__label--left', !checked ? 'is-active' : '']"
        v-if="inactiveIconClass || inactiveText"
      >
        <i :class="[inactiveIconClass]" v-if="inactiveIconClass"></i>
        <span v-if="!inactiveIconClass && inactiveText" :aria-hidden="checked">{{ inactiveText }}</span>
      </span>
      <span class="rz-on-off__core" ref="core" :style="{ 'width': coreWidth + 'px' }">
        <span class="rz-on-off__core--circle">
          <span v-if="loading" class="rz-on-off__core--loading-circle"></span>
        </span>
      </span>
      <span
        :class="['rz-on-off__label', 'rz-on-off__label--right', checked ? 'is-active' : '']"
        v-if="activeIconClass || activeText"
      >
        <i :class="[activeIconClass]" v-if="activeIconClass"></i>
        <span v-if="!activeIconClass && activeText" :aria-hidden="!checked">{{ activeText }}</span>
      </span>
    </div>

    <div class="rz-on-off__text-core" :class="{'is-disabled': switchDisabled}" v-if="isTextType">
      <span
        class="rz-on-off__circle"
        :style="{width: textCircleWidth, left: checked ? '0px' : leafTextWidth}"
        :class="{'is-inactived': !this.checked, animate: this.ready}"
      ></span>
      <span
        :class="['rz-on-off__label', 'rz-on-off__label--left', checked ? 'is-active' : '']"
        v-if="activeIconClass || activeText"
        ref="activeLeft"
      >
        <i :class="[activeIconClass]" v-if="activeIconClass"></i>
        <span v-if="!activeIconClass && activeText" :aria-hidden="!checked">{{ activeText }}</span>
      </span>

      <span
        :class="['rz-on-off__label', 'rz-on-off__label--right', !checked ? 'is-active' : '']"
        v-if="inactiveIconClass || inactiveText"
        ref="activeRight"
      >
        <i :class="[inactiveIconClass]" v-if="inactiveIconClass"></i>
        <span v-if="!inactiveIconClass && inactiveText" :aria-hidden="checked">{{ inactiveText }}</span>
      </span>
    </div>
  </div>
</template>
<script>
import Focus from "rz/mixins/focus";
import Migrating from "rz/mixins/migrating";

export default {
  name: "OnOff",

  options: { name: "OnOff" },

  mixins: [Focus("input"), Migrating],
  inject: {
    Form: {
      default: ""
    }
  },
  props: {
    type: {
      type: String,
      default: "default"
    },
    value: {
      type: [Boolean, String, Number],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 36
    },
    activeIconClass: {
      type: String,
      default: ""
    },
    inactiveIconClass: {
      type: String,
      default: ""
    },
    activeText: String,
    inactiveText: String,
    activeColor: {
      type: String,
      default: ""
    },
    inactiveColor: {
      type: String,
      default: ""
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    },
    name: {
      type: String,
      default: ""
    },
    id: String,
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      coreWidth: this.width,
      textCircleWidth: "48px",
      leafTextWidth: "48px",
      ready: false
    };
  },
  created() {
    if (!~[this.activeValue, this.inactiveValue].indexOf(this.value)) {
      this.$emit("input", this.inactiveValue);
    }
  },
  computed: {
    checked() {
      return this.value === this.activeValue;
    },
    switchDisabled() {
      return this.disabled || (this.Form || {}).disabled || this.loading;
    },
    // 加入text类型
    isTextType() {
      return this.type === "text";
    }
  },
  watch: {
    checked(val) {
      this.$refs.input.checked = val;
      if (this.activeColor || this.inactiveColor) {
        this.setBackgroundColor();
      }

      if (this.isTextType) {
        const elm = val ? this.$refs.activeLeft : this.$refs.activeRight;
        const padding = 20;
        const widthValue = parseFloat(getComputedStyle(elm).width);
        this.textCircleWidth = widthValue + padding + "px";
      }
    }
  },
  methods: {
    /* eslint-disable-next-line */
    handleChange(event) {
      this.$emit(
        "input",
        !this.checked ? this.activeValue : this.inactiveValue
      );
      this.$emit(
        "change",
        !this.checked ? this.activeValue : this.inactiveValue
      );
      this.$nextTick(() => {
        // set input's checked property
        // in case parent refuses to change component's value
        this.$refs.input.checked = this.checked;
      });
    },
    setBackgroundColor() {
      let newColor = this.checked ? this.activeColor : this.inactiveColor;
      this.$refs.core.style.borderColor = newColor;
      this.$refs.core.style.backgroundColor = newColor;
    },
    switchValue() {
      !this.switchDisabled && this.handleChange();
    },
    getMigratingConfig() {
      return {
        props: {
          "on-color": "on-color is renamed to active-color.",
          "off-color": "off-color is renamed to inactive-color.",
          "on-text": "on-text is renamed to active-text.",
          "off-text": "off-text is renamed to inactive-text.",
          "on-value": "on-value is renamed to active-value.",
          "off-value": "off-value is renamed to inactive-value.",
          "on-icon-class": "on-icon-class is renamed to active-icon-class.",
          "off-icon-class": "off-icon-class is renamed to inactive-icon-class."
        }
      };
    }
  },
  mounted() {
    /* istanbul ignore if */
    this.coreWidth = this.width || 36;
    if (this.activeColor || this.inactiveColor) {
      this.setBackgroundColor();
    }
    if (this.$refs.input) {
      this.$refs.input.checked = this.checked;
    }

    if (this.$refs.activeLeft || this.$refs.activeRight) {
      const elm = this.checked ? this.$refs.activeLeft : this.$refs.activeRight;
      const leftElm = this.$refs.activeLeft;
      const padding = 20;
      const margin = 16;
      const widthValue = parseFloat(getComputedStyle(elm).width);
      const leftWidthValue = parseFloat(getComputedStyle(leftElm).width);
      this.textCircleWidth = widthValue + padding + "px";
      this.leafTextWidth = leftWidthValue + margin + "px";
      this.$nextTick(() => (this.ready = true));
    }
  }
};
</script>
