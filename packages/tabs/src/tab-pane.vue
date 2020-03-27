<template>
  <div
    class="rz-tab-pane"
    v-if="(!lazy || loaded) || active"
    v-show="active"
    role="tabpanel"
    :aria-hidden="!active"
    :id="`pane-${paneName}`"
    :aria-labelledby="`tab-${paneName}`"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'TabPane',

  componentName: 'TabPane',

  options: {
    name: 'TabPane'
  },

  props: {
    label: String,
    labelContent: Function,
    icon: String,
    name: String,
    closable: Boolean,
    disabled: Boolean,
    lazy: Boolean
  },

  data() {
    return {
      index: null,
      loaded: false
    };
  },

  computed: {
    isClosable() {
      return this.closable || this.$parent.closable;
    },
    active() {
      const acti = this.$parent.currentName === (this.name || this.index);
      return acti;
    },
    paneName() {
      return this.name || this.index;
    }
  },

  watch: {
    label() {
      this.$parent.$emit('tabLabelChanged');
    },
    active(acti){
      if(acti){
        this.loaded = true;
      }
    }
  }
};
</script>
