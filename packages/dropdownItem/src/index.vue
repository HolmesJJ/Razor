<template>
  <li
    class="rz-dropdown-menu__item"
    :class="{
      'is-disabled': disabled,
      'rz-dropdown-menu__item--divided': divided
    }"
    @click="handleClick"
    :aria-disabled="disabled"
    :tabindex="disabled ? null : -1"
  >
    <slot></slot>
  </li>
</template>
<script lang="ts">

import { Vue, Component, Prop } from "vue-property-decorator";
import Emitter from "rz/mixins/emitter";

@Component({
  name: "DropdownItem",
  mixins: [Emitter]
})
export default class DropdownItem extends Vue {
  @Prop({
    default: () => {
      return {};
    }
  })
  readonly command: any;

  @Prop({ type: Boolean, default: false })
  readonly disabled: boolean;

  @Prop({ type: Boolean, default: false })
  readonly divided: boolean;

  readonly dispatch: (
    ComponentName: string,
    EventName: string,
    msg: any
  ) => any;

  handleClick(e) { // eslint-disable-line
    this.dispatch("Dropdown", "menu-item-click", [this.command, this]);
  }
}
</script>
