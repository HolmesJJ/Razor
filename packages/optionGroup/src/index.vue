<template>
  <ul class="rz-select-group__wrap" v-show="visible">
    <li class="rz-select-group__title">{{ label }}</li>
    <li>
      <ul class="rz-select-group">
        <slot></slot>
      </ul>
    </li>
  </ul>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Emitter from "rz/mixins/emitter";

@Component({
  name: "OptionGroup",
  mixins: [Emitter]
})
export default class OptionGroup extends Vue {
  @Prop({ type: String, default: "" })
  readonly label: string;

  @Prop({ type: Boolean, default: false })
  disabled: boolean;

  readonly broadcast: (comName: string, eventName: string, val?: any) => any;
  visible: boolean = true;

  @Watch("visible")
  visibleChange(val) {
    this.broadcast("Option", "handleGroupDisabled", val);
  }

  queryChange() {
    this.visible =
      this.$children &&
      Array.isArray(this.$children) &&
      this.$children.some(option => (option as any).visible === true);
  }

  created() {
    this.$on("queryChange", this.queryChange);
  }
  
  mounted() {
    if (this.disabled) {
      this.broadcast("Option", "handleGroupDisabled", this.disabled);
    }
  }
}
</script>
