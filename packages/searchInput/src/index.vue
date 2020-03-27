<template>
  <div class="rz-search-input" :class="className">
    <div class="selector-area" v-if="options && options.length > 0">
      <rz-dropdown @command="handleSelectionChanged">
        <span class="rz-dropdown-link" :class="linkClassName" :disabled="_disabled">
          {{ options[form.selectedKey] && options[form.selectedKey].label }}
          <i
            class="rz-icon-arrow-down rz-icon--right"
          ></i>
        </span>
        <rz-dropdown-menu slot="dropdown">
          <rz-dropdown-item
            v-for="(o, idx) in options"
            :key="o.value"
            :command="idx"
            :class="{selected: form.selectedKey === idx}"
          >{{ o.label }}</rz-dropdown-item>
        </rz-dropdown-menu>
      </rz-dropdown>
    </div>

    <div
      class="main-input-area"
      :class="{'no-selector': !options || options.length <= 0}"
      @keyup.enter="enter"
    >
      <rz-input
        :disabled="_disabled"
        :value="searchText"
        :placeholder="placeholder"
        @clear="handleInputClear"
        @change="handleInputChange"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        clearable
        ref="input"
      ></rz-input>
    </div>

    <div>
      <i
        v-if="showSearch && !disabled"
        class="rz-search-input-suffix rz-icon-search"
        @click="handleSearchClicked"
      ></i>
      <i
        :key="'disable-search-icon'"
        v-else-if="showSearch && disabled"
        class="rz-search-input-suffix rz-icon-search"
      ></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import RzInput from "pkg/input";
import RzDropdown from "pkg/dropdown";

interface SearchInputForm {
  searchText: string;
  selectedKey?: number;
}
interface DropDownOption {
  value: [string, number];
  label: string;
}

@Component({
  name: "SearchInput",
  components: {
    RzInput,
    RzDropdown
  }
})
export default class SearchInput extends Vue {
  @Prop()
  options: DropDownOption[];

  @Prop({ default: 0 })
  defaultOption: number;

  // @Prop()
  // inputValue: string;

  @Prop({ default: "" })
  value: string;

  @Prop({ default: "" })
  placeholder: string;

  @Prop({ type: Boolean, default: true })
  round: boolean;

  @Prop({ type: String, default: "" })
  size: string;

  @Prop({ type: Boolean, default: true })
  showSearch: boolean;

  @Prop({ default: false }) focusActive: boolean;
  @Prop({ type: Boolean, default: false })
  disabled: boolean;

  data = this.value;

  isFocus: boolean = false;

  get searchText() {
    return this.data;
  }

  set searchText(val) {
    this.data = val;
  }

  selectedKey: number = -1;

  get form(): SearchInputForm {
    return {
      searchText: this.searchText,
      selectedKey: this.selectedKey
    };
  }

  get className() {
    // const _className = {
    //   "is-round": this.round
    // };

    const result = {
      "is-round": this.round,
      "is-focus-active": this.focusActive,
      "is-focus": this.isFocus,
      "is-disabled": this.disabled
    };

    const size = `rz-search-input__${this.size}`;
    result[size] = !!this.size;

    return result;
  }

  get linkClassName() {
    return {
      "is-disabled": this._disabled
    };
  }

  get _disabled() {
    return this.disabled;
  }

  // @Watch("inputValue")
  // handleInputValueChange(val) {
  //   this.searchText = val;
  // }

  @Emit("search")
  handleSearchClicked() {
    return this.form;
  }

  @Emit("clear")
  handleInputClear() {
    return this.form;
  }

  @Emit("change")
  handleInputChange(newValue) {
    return newValue;
  }

  @Emit("input")
  handleInput(newValue) {
    this.searchText = newValue;
    return newValue;
  }

  @Emit("blur")
  handleBlur(event) {
    this.isFocus = false;
    return event;
  }

  @Emit("focus")
  handleFocus(event) {
    this.isFocus = true;
    return event;
  }

  @Emit("select-change")
  handleSelectionChanged(key) {
    this.selectedKey = key;
    return key;
  }

  /* cover clear case */
  @Watch("value")
  handleValueChange(value) {
    this.handleInput(value);
  }

  @Watch("defaultOption")
  handledefaultOptionChange(value) {
    this.selectedKey = value;
  }

  enter() {
    (this.$refs.input as any).blur();
    this.handleSearchClicked();
  }

  created() {
    // this.form = this.options ? { searchText: '', selectedKey: this.defaultOption } : { searchText: '' };
    if (this.options) {
      this.searchText = this.value;
      this.selectedKey = this.defaultOption;
    }
    // this.searchText = this.inputValue ? this.inputValue : "";
  }
}
</script>
