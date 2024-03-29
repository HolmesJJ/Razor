<template>
  <div
    class="rz-autocomplete"
    v-clickoutside="close"
    aria-haspopup="listbox"
    role="combobox"
    :aria-expanded="suggestionVisible"
    :aria-owns="id"
  >
    <rz-input
      ref="input"
      v-bind="[$props, $attrs]"
      @input="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown.up.native.prevent="highlight(highlightedIndex - 1)"
      @keydown.down.native.prevent="highlight(highlightedIndex + 1)"
      @keydown.enter.native="handleKeyEnter"
      @keydown.native.tab="close"
    >
      <template slot="prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </template>
      <template slot="append" v-if="$slots.append">
        <slot name="append"></slot>
      </template>
      <template slot="prefix" v-if="$slots.prefix">
        <slot name="prefix"></slot>
      </template>
      <template slot="suffix" v-if="$slots.suffix">
        <slot name="suffix"></slot>
      </template>
    </rz-input>
      <!-- visible-arrow -->
    <rz-autocomplete-suggestions
      :class="[popperClass ? popperClass : '']"
      :popper-options="popperOptions"
      :append-to-body="popperAppendToBody"
      ref="suggestions"
      :placement="placement"
      :id="id"
    >
      <li
        v-for="(item, index) in suggestions"
        :key="index"
        :class="{'highlighted': highlightedIndex === index}"
        @click="select(item)"
        :id="`${id}-item-${index}`"
        role="option"
        :aria-selected="highlightedIndex === index"
      >
        <slot :item="item">{{ item[valueKey] }}</slot>
      </li>
    </rz-autocomplete-suggestions>
  </div>
</template>
<script>
import debounce from "throttle-debounce/debounce";
import RzInput from 'pkg/input';
import Clickoutside from "rz/directive/clickoutside";
import RzAutocompleteSuggestions from "./autocomplete-suggestions.vue";
import Emitter from "rz/mixins/emitter";
import Migrating from "rz/mixins/migrating";
import { generateId } from "rz/utils/util";
import Focus from "rz/mixins/focus";

export default {
  name: "Autocomplete",

  mixins: [Emitter, Focus("input"), Migrating],

  inheritAttrs: false,

  options: {
    name: "Autocomplete"
  },

  components: {
    RzInput,
    RzAutocompleteSuggestions
  },

  directives: { Clickoutside },

  props: {
    valueKey: {
      type: String,
      default: "value"
    },
    popperClass: String,
    popperOptions: Object,
    placeholder: String,
    disabled: Boolean,
    name: String,
    size: String,
    value: String,
    maxlength: Number,
    minlength: Number,
    autofocus: Boolean,
    fetchSuggestions: Function,
    triggerOnFocus: {
      type: Boolean,
      default: true
    },
    customItem: String,
    selectWhenUnmatched: {
      type: Boolean,
      default: false
    },
    prefixIcon: String,
    suffixIcon: String,
    label: String,
    debounce: {
      type: Number,
      default: 300
    },
    placement: {
      type: String,
      default: "bottom-start"
    },
    hideLoading: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activated: false,
      suggestions: [],
      loading: false,
      highlightedIndex: -1,
      suggestionDisabled: false
    };
  },
  computed: {
    suggestionVisible() {
      const suggestions = this.suggestions;
      let isValidData = Array.isArray(suggestions) && suggestions.length > 0;
      return (isValidData || this.loading) && this.activated;
    },
    id() {
      return `rz-autocomplete-${generateId()}`;
    }
  },
  watch: {
    suggestionVisible(val) {
      this.broadcast("AutocompleteSuggestions", "visible", [
        val,
        this.$refs.input.$refs.input.offsetWidth
      ]);
    }
  },
  methods: {
    getMigratingConfig() {
      return {
        props: {
          "custom-item": "custom-item is removed, use scoped slot instead.",
          props: "props is removed, use value-key instead."
        }
      };
    },
    getData(queryString) {
      if (this.suggestionDisabled) {
        return;
      }
      this.loading = true;
      this.fetchSuggestions(queryString, suggestions => {
        this.loading = false;
        if (this.suggestionDisabled) {
          return;
        }
        if (Array.isArray(suggestions)) {
          this.suggestions = suggestions;
        } else {
          console.error(
            "[Razor Error][Autocomplete]autocomplete suggestions must be an array"
          );
        }
      });
    },
    handleChange(value) {
      this.$emit("input", value);
      this.suggestionDisabled = false;
      if (!this.triggerOnFocus && !value) {
        this.suggestionDisabled = true;
        this.suggestions = [];
        return;
      }
      this.debouncedGetData(value);
    },
    handleFocus(event) {
      this.activated = true;
      this.$emit("focus", event);
      if (this.triggerOnFocus) {
        this.debouncedGetData(this.value);
      }
    },
    handleBlur(event) {
      this.$emit("blur", event);
    },
    close() {
      this.activated = false;
    },
    handleKeyEnter(e) {
      if (
        this.suggestionVisible &&
        this.highlightedIndex >= 0 &&
        this.highlightedIndex < this.suggestions.length
      ) {
        e.preventDefault();
        this.select(this.suggestions[this.highlightedIndex]);
      } else if (this.selectWhenUnmatched) {
        this.$emit("select", { value: this.value });
        this.$nextTick(() => {
          this.suggestions = [];
          this.highlightedIndex = -1;
        });
      }
    },
    select(item) {
      this.$emit("input", item[this.valueKey]);
      this.$emit("select", item);
      this.$nextTick(() => {
        this.suggestions = [];
        this.highlightedIndex = -1;
      });
    },
    highlight(index) {
      if (!this.suggestionVisible || this.loading) {
        return;
      }
      if (index < 0) {
        this.highlightedIndex = -1;
        return;
      }
      if (index >= this.suggestions.length) {
        index = this.suggestions.length - 1;
      }
      const suggestion = this.$refs.suggestions.$el.querySelector(
        ".rz-autocomplete-suggestion__wrap"
      );
      const suggestionList = suggestion.querySelectorAll(
        ".rz-autocomplete-suggestion__list li"
      );

      let highlightItem = suggestionList[index];
      let scrollTop = suggestion.scrollTop;
      let offsetTop = highlightItem.offsetTop;

      if (
        offsetTop + highlightItem.scrollHeight >
        scrollTop + suggestion.clientHeight
      ) {
        suggestion.scrollTop += highlightItem.scrollHeight;
      }
      if (offsetTop < scrollTop) {
        suggestion.scrollTop -= highlightItem.scrollHeight;
      }
      this.highlightedIndex = index;
      this.$el
        .querySelector(".rz-input__inner")
        .setAttribute(
          "aria-activedescendant",
          `${this.id}-item-${this.highlightedIndex}`
        );
    }
  },
  mounted() {
    this.debouncedGetData = debounce(this.debounce, this.getData);
    this.$on("item-click", item => {
      this.select(item);
    });
    let $input = this.$el.querySelector(".rz-input__inner");
    $input.setAttribute("role", "textbox");
    $input.setAttribute("aria-autocomplete", "list");
    $input.setAttribute("aria-controls", "id");
    $input.setAttribute(
      "aria-activedescendant",
      `${this.id}-item-${this.highlightedIndex}`
    );
  },
  beforeDestroy() {
    this.$refs.suggestions.$destroy();
  }
};
</script>
