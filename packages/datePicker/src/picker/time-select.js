import Picker from '../index.vue';
import Panel from '../panel/time-select';

export default {
  mixins: [Picker],

  name: 'TimeSelect',

  options: {
    name: 'TimeSelect'
  },

  props: {
    type: {
      type: String,
      default: 'time-select'
    }
  },

  beforeCreate() {
    this.panel = Panel;
  }
};
