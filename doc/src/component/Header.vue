<template>
  <header class="header">
    <div class="header__container">
      <img :src="logoPath" alt="logo" class="header__logo">
      <p class="header__title">SCG-IVA-BP  Web前端组件库 Razor</p>
      <!-- <rz-button v-if="!devMode" type="primary" class="header__skin" @click="changeSkin">点击换肤</rz-button> -->
    </div>
  </header>
</template>

<script>
import logoPath from "../assets/images/headerLogo.png";
import { skinType } from "doc/utils/skin";

export default {
  name: "Header",
  props: {
    skinType: {
      type: String,
      default: "dark"
    }
  },
  computed: {
    devMode() {
      return process && process.env && process.env.NODE_ENV === "development";
    }
  },
  data() {
    return {
      logoPath,
      buttonType: "primary"
    };
  },
  methods: {
    changeSkin(evt) {
      this.$emit("changeSkin");
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  height: 80px;
  padding: 10px 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-bottom: 1px solid #d3d3d3;
  /* 这里要比Logo动画小 */
  z-index: 1999;
  overflow: hidden;
  &__container {
    width: 1140px;
    height: calc(100% - 20px);
    margin: auto;
    display: flex;
    align-items: center;
    position: relative;
  }
  &__logo {
    width: 200px;
    height: 200px;
  }
  &__skin {
    position: absolute !important;
    right: 20px;
  }

  &__title{
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    width: 100%;
  }
}
</style>
