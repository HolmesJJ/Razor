<template>
  <link rel="stylesheet" :href="styles[skinType]">
</template>

<script>
import white from "pkg/theme/white/index.scss";
import dark from "pkg/theme/dark/index.scss";
import { skinType } from "doc/utils/skin";
export default {
  name: "Skin",
  data() {
    return {
      styles: {
        white,
        dark
      }
    };
  },
  props: {
    skinType: {
      type: String,
      default: skinType.dark
    }
  }
};
</script>
