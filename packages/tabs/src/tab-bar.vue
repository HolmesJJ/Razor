<template>
  <div class="rz-tabs__active-bar" :class="`is-${ rootTabs.tabPosition }`" :style="barStyle"></div>
</template>
<script>
import { arrayFind } from "rz/utils/util";
export default {
  name: "TabBar",

  props: {
    tabs: Array,
    tabGap: Number
  },

  inject: ["rootTabs"],

  computed: {
    barStyle: {
      get() {
        let style = {};
        let offset = 0;
        let tabSize = 0;
        let isActiveTheFistTab = false;
        const sizeName =
          ["top", "bottom"].indexOf(this.rootTabs.tabPosition) !== -1
            ? "width"
            : "height";
        const sizeDir = sizeName === "width" ? "x" : "y";
        const firstUpperCase = str => {
          return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
        };
        this.tabs.every((tab, index) => {
          let $el = arrayFind(
            this.$parent.$refs.tabs || [],
            t => t.id.replace("tab-", "") === tab.paneName
          );
          if (!$el) {
            return false;
          }
          if (!tab.active) {
            offset += $el[`client${firstUpperCase(sizeName)}`];
            return true;
          } else {
            if (index === 0) isActiveTheFistTab = true;
            if (sizeName === "width") offset = $el.offsetLeft; // 由于增加了导航条flex的样式，element之前的取值方法失效，此时active-bar的translate距离应该正好是active的那个tab-item的offset left
            tabSize = $el[`client${firstUpperCase(sizeName)}`];
            if (sizeName === "width" && this.tabs.length > 1) {
              tabSize -=
                index === 0 || index === this.tabs.length - 1
                  ? this.tabGap
                  : this.tabGap * 2;
            }
            return false;
          }
        });

        if (sizeName === "width" && !isActiveTheFistTab) {
          offset += this.tabGap;
        }
        const transform = `translate${firstUpperCase(sizeDir)}(${offset}px)`;
        style[sizeName] = tabSize + "px";
        style.transform = transform;
        style.msTransform = transform;
        style.webkitTransform = transform;

        return style;
      }
    }
  }
};
</script>
