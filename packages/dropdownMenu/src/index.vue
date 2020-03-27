<template>
  <transition name="rz-zoom-in-top" @after-leave="doDestroy">
    <ul
      class="rz-dropdown-menu rz-popper"
      v-show="showPopper"
      :class="[size && `rz-dropdown-menu--${size}`]"
    >
      <slot></slot>
    </ul>
  </transition>
</template>

<script lang="ts">

import { Vue, Component, Prop, Inject, Watch } from "vue-property-decorator";
import Popper from "rz/utils/vue-popper";

@Component({
  name: "DropdownMenu",
  mixins: [Popper]
})
export default class DropdownMenu extends Vue {
  @Prop({ type: Boolean, default: true })
  readonly visibleArrow: boolean;

  @Prop({ type: Number, default: 0 })
  readonly arrowOffset: number;

  @Inject()
  readonly dropdown: any;

  readonly updatePopper: () => any;

  $parent: any;
  popperElm: any;
  referenceElm: any;
  showPopper: boolean;
  currentPlacement: boolean;

  @Watch("dropdown.placement")
  handleCurrentPlacement() {
    this.currentPlacement = this.dropdown.placement;
  }

  size: any;

  created() {
    this.size = this.dropdown.dropdownSize;

    this.$on("updatePopper", () => {
      if (this.showPopper) this.updatePopper();
    });
    this.$on("visible", val => {
      this.showPopper = val;
    });
  }

  mounted() {
    this.$parent.popperElm = this.popperElm = this.$el;
    this.referenceElm = this.$parent.$el;
  }
}
</script>
