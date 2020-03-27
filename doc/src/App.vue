<template>
  <!-- <div id="app" :style="{'background': `url(${background})`}"> -->
  <div id="app" :class="{
      'show-header': !showHeader
    }">
    <skin v-if="!devMode" :skinType="skinType"></skin>
    <rz-scrollbar
      class="rz-main-srollerbar"
      wrapClass="rz-main-srollerbar__wrap"
      style="height:100%"
      :wrapStyle="'overflow-x: hidden;'"
    >
      <!-- <dev-skin v-if="devMode" :skinType="skinType"></dev-skin> -->
      <Logo v-if="showLogo"></Logo>
      <doc-header @changeSkin="changeSkin" v-show="showHeader"></doc-header>
      <div class="main" :class="{dark: isDark}">
        <div class="main-content">
          <doc-side-nav></doc-side-nav>
          <div class="main__container">
            <router-view></router-view>
          </div>
        </div>
      </div>
      <Contact />
    </rz-scrollbar>
  </div>
</template>

<script>
import DocHeader from "./component/Header";
import DocSideNav from "./component/SideNav";
import Skin from "./component/Skin";
import Contact from "./component/Contact";
// import DevSkin from "./component/DevSkin";
import Logo from "./component/Logo";
import hljs from "highlight.js";
import { skinType } from "doc/utils/skin";
import showHeader from "./mixins/showHeader";
// import background from "./assets/images/background.png";

const highlightCode = () => {
  const preEl = document.querySelectorAll("pre");

  preEl.forEach(el => {
    hljs.highlightBlock(el);
  });
};

export default {
  name: "App",
  mixins: [showHeader],
  components: {
    DocHeader,
    DocSideNav,
    Skin,
    // DevSkin,
    Logo,
    Contact
  },
  computed: {
    devMode() {
      return process && process.env && process.env.NODE_ENV === "development";
    },
    isDark() {
      return this.skinType === skinType.dark;
    }
  },
  watch: {
    "$route.path": {
      handler() {
        document.querySelector(".rz-main-srollerbar__wrap").scrollTop = 0;
      }
    }
  },
  data() {
    return {
      // background,
      skinType: skinType.dark,
      showLogo: false
    };
  },
  methods: {
    changeSkin() {
      this.skinType =
        this.skinType === skinType.dark ? skinType.white : skinType.dark;
    }
  },
  mounted() {
    highlightCode();
    setTimeout(() => {
      this.showLogo = false;
    }, 2800);
  },
  updated() {
    highlightCode();
  }
};
</script>

<style lang="scss">
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: transparent;

  &-thumb {
    border-radius: 4px;
    width: 8px;
    background-color: #56668d;
    &:hover {
      background-color: #090d16;
    }
  }
}

::-webkit-scrollbar-track-piece {
  width: 8px;
  background-color: transparent;
}

::-webkit-scrollbar-corner {
  display: none;
}

.main__container {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #000;
    font-weight: 600;
  }
  section > table {
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
    margin-bottom: 45px;
    line-height: 1.5em;

    thead {
      display: table-header-group;
      vertical-align: middle;
      border-color: inherit;
      tr {
        display: table-row;
        vertical-align: inherit;
        border-color: inherit;
        th {
          text-align: left;
          white-space: nowrap;
          color: #666;
          font-weight: 400;
          &:first-child {
            padding-left: 10px;
          }
        }
      }
    }
    td {
      border-bottom: 1px solid lightgray;
      padding: 15px;
      padding-left: 0px;
      max-width: 250px;
      &:first-child {
        padding-left: 10px;
      }
    }
  }
}
.main-content {
  width: 1140px;
  margin: 0 auto;
}
// .rz-main-srollerbar > .rz-scrollbar__wrap {
//   overflow-x: hidden;
// }
</style>

<style lang="scss" scoped>
#app {
  // width: 100%;
  height: calc(100% - 141px);
  padding-top: 100px;
  padding-bottom: 40px; // for contact area;
}
#app.show-header {
  height: calc(100% - 40px);;
  padding-top: 0px;
}

.main {
  &.dark {
    .main__container section > table {
      background: rgba(31, 42, 64, 1);
    }
  }
  &__container {
    padding: 20px;
    margin-left: 240px;
    height: 100%;
  }
}
</style>


