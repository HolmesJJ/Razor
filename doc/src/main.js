import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import "highlight.js/styles/darcula.css";
import "normalize.css";
const isDevlop =
  process && process.env && process.env.NODE_ENV === "development";
if (isDevlop) {
  // if you want change style ,change next line.
  require("pkg/theme/dark/index.scss");
}
import DemoBlock from "doc/component/DemoBlock";
Vue.component("demo-block", DemoBlock);
import { localize } from "./locale";

const lang = "zh-CN";
// const lang = "zh-TW";
// const lang = "en";
localize(lang);

// 开发时，将所有的组件导入
import Razor from "pkg";

import "./assets/iconfont/iconfont.js";
import "./assets/iconfont/iconfont.css";

const razorConfig = {
  map: {
    // -----运维重写部分-----
    type: "baidu",
    // -----End-----
    lang: {
      firstAppear: "首次出现点",
      mostAppear: "常现点",
      lastAppear: "最后出现点",
      nightTheme: "夜间模式",
      standardTheme: "白天模式",
      y: "年",
      m: "月",
      d: "日",
      w: "周",
      h: "时",
      minute: "分",
      s: "秒"
    },

    initialLocation: {
      x: 102.688661,
      y: 24.986613
    },
    initialInvalidLocation: {
      x: 0,
      y: 0
    },
    initialZoom: 15,
    maxZoom: 18,
    minZoom: 5,
    heatRadius: 40,
    defaultTheme: "normal",

    // -----运维重写部分-----
    net: "online",
    // -----End-----
    // eslint-disable-next-line
    baidu_online:
      "http://api.map.baidu.com/getscript?v=2.0&ak=slcEipuAs0barmp2cNcIrXMcCC2WGtaG&services=&t=20171031174121",
    // eslint-disable-next-line
    baidu_offline: "/static/offlineMap/map_load.js",
    // eslint-disable-next-line
    baidu_offline_loadUrl: "./static/offlineMap/darkTiles",
    // eslint-disable-next-line
    baidu_offline_home: "./static/offlineMap/",
    // eslint-disable-next-line
    minemap_online: {
      host: "minedata.cn",
      jsLink: "//minedata.cn/minemapapi/v1.3/minemap.js",
      cssLink: "//minedata.cn/minemapapi/v1.3/minemap.css",
      themes: {
        normal: {
          accessToken: "25cc55a69ea7422182d00d6b7c0ffa93",
          solution: 2365
        },
        midnight: {
          accessToken: "97e3761dcf944c6c9449aaaf191887f3",
          solution: 5398
        }
      }
    },
    // eslint-disable-next-line
    minemap_offline: {
      host: "10.166.190.228",
      jsLink: "http://10.166.190.228/minemapapi/demo/js/minemap-wmts.js",
      cssLink: "http://10.166.190.228/minemapapi/v1.3/minemap.css",
      themes: {
        normal: {
          accessToken: "6ed83a09b32547bb975102422a453d6c",
          solution: 3589
        },
        midnight: {
          accessToken: "ff2b853eb6e1478b9474629bd35f9843",
          solution: 3596
        }
      }
    }
  }
};

Vue.use(Razor, razorConfig);
Vue.prototype.__devMode__ = process.env.NODE_ENV === "development";

Vue.config.productionTip = false;
/* eslint-disable */
new Vue({
  render: h => h(App),
  router,
  el: "#app"
});
