<template>
  <div class="rz-collapse-item" :class="{'is-active': isActive}">
    <div
      role="tab"
      :aria-expanded="isActive"
      :aria-controls="`rz-collapse-content-${id}`"
      :aria-describedby="`rz-collapse-content-${id}`"
    >
      <div
        class="rz-collapse-item__header"
        @click="handleHeaderClick"
        role="button"
        :id="`rz-collapse-head-${id}`"
        tabindex="0"
        @keyup.space.enter.stop="handleEnterClick"
        :class="{
          'focusing': focusing,
          'is-active': isActive
        }"
        @focus="handleFocus"
        @blur="focusing = false"
      >
        <i class="rz-collapse-item__arrow rz-icon-arrow-right" :class="{'is-active': isActive}"></i>
        <slot name="title">{{title}}</slot>
      </div>
    </div>
    <rz-collapse-transition>
      <div
        class="rz-collapse-item__wrap"
        v-show="isActive"
        role="tabpanel"
        :aria-hidden="!isActive"
        :aria-labelledby="`rz-collapse-head-${id}`"
        :id="`rz-collapse-content-${id}`"
      >
        <div class="rz-collapse-item__content">
          <slot></slot>
        </div>
      </div>
    </rz-collapse-transition>
  </div>
</template>
<script>
import RzCollapseTransition from "rz/transitions/collapse-transition";
import Emitter from "rz/mixins/emitter";
import { generateId } from "rz/utils/util";

export default {
  name: "CollapseItem",

  options: {
    name: "CollapseItem"
  },

  mixins: [Emitter],

  components: { RzCollapseTransition },

  data() {
    return {
      contentWrapStyle: {
        height: "auto",
        display: "block"
      },
      contentHeight: 0,
      focusing: false,
      isClick: false
    };
  },

  inject: ["collapse"],

  props: {
    title: String,
    name: {
      type: [String, Number],
      default() {
        return this._uid;
      }
    }
  },

  computed: {
    isActive() {
      if (
        typeof this.collapse.activeNames === "object" &&
        this.collapse.activeNames.length
      ) {
        return this.collapse.activeNames.indexOf(this.name) > -1;
      } else {
        return this.collapse.activeNames == this.name;
      }
    },
    id() {
      return generateId();
    }
  },

  methods: {
    handleFocus() {
      setTimeout(() => {
        if (!this.isClick) {
          this.focusing = true;
        } else {
          this.isClick = false;
        }
      }, 50);
    },
    handleHeaderClick() {
      this.dispatch("Collapse", "item-click", this);
      this.focusing = false;
      this.isClick = true;
    },
    handleEnterClick() {
      this.dispatch("Collapse", "item-click", this);
    }
  }
};
</script>
