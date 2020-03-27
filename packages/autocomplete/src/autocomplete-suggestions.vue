<template>
  <transition name="rz-zoom-in-top" @after-leave="doDestroy">
    <div
      v-show="showPopper"
      class="rz-autocomplete-suggestion rz-popper"
      :class="{ 'is-loading': !parent.hideLoading && parent.loading }"
      :style="{ width: dropdownWidth }"
      role="region">
      <rz-scrollbar
        tag="ul"
        wrap-class="rz-autocomplete-suggestion__wrap"
        view-class="rz-autocomplete-suggestion__list">
        <li v-if="!parent.hideLoading && parent.loading"><i class="rz-icon-loading"></i></li>
        <slot v-else>
        </slot>
      </rz-scrollbar>
    </div>
  </transition>
</template>
<script>
import Popper from 'rz/utils/vue-popper';
import Emitter from 'rz/mixins/emitter';
import RzScrollbar from '../../scrollbar';

export default {
  name: "AutocompleteSuggestions",

  components: { RzScrollbar },
    
  mixins: [Popper, Emitter],

  data() {
    return {
      parent: this.$parent,
      dropdownWidth: ''
    };
  },

  props: {
    options: {
      default() {
        return {
          gpuAcceleration: false
        };
      }
    },
    id: String
  },

  methods: {
    select(item) {
      this.dispatch('Autocomplete', 'item-click', item);
    }
  },

  updated() {
    /* eslint-disable-next-line */
    this.$nextTick(_ => {
      this.popperJS && this.updatePopper();
    });
  },

  mounted() {
    this.$parent.popperElm = this.popperElm = this.$el;
    this.referenceElm = this.$parent.$refs.input.$refs.input;
    this.referenceList = this.$el.querySelector('.rz-autocomplete-suggestion__list');
    this.referenceList.setAttribute('role', 'listbox');
    this.referenceList.setAttribute('id', this.id);
  },

  created() {
    this.$on('visible', (val, inputWidth) => {
        
      this.dropdownWidth = inputWidth + 'px';
      this.showPopper = val;
    });
  }
};
</script>
