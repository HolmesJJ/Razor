import Picker from "../index.vue";
import TimePanel from "../panel/time";
import TimeRangePanel from "../panel/time-range";

export default {
  mixins: [Picker],

  name: "TimePicker",

  options: {
    name: "TimePicker"
  },

  props: {
    isRange: Boolean,
    arrowControl: Boolean,
    size: String
  },

  data() {
    return {
      type: ""
    };
  },

  watch: {
    isRange(isRange) {
      if (this.picker) {
        this.unmountPicker();
        this.type = isRange ? "timerange" : "time";
        this.panel = isRange ? TimeRangePanel : TimePanel;
        this.mountPicker();
      } else {
        this.type = isRange ? "timerange" : "time";
        this.panel = isRange ? TimeRangePanel : TimePanel;
      }
    }
  },

  created() {
    this.type = this.isRange ? "timerange" : "time";
    this.panel = this.isRange ? TimeRangePanel : TimePanel;
  }
};
