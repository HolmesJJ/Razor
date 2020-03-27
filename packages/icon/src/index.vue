<template>
  <i :class="realName"></i>
</template>

<script>
export default {
  name: "Icon",

  options: {
    name: "Icon"
  },

  props: {
    name: String,
    label: String
  },
  computed: {
    realName() {
      if (this.label) {
        return "iconfont " + this.label;
      }
      return "rz-icon-" + this.name;
    }
  }
};
</script>
