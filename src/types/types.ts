import Vue from "vue"

declare module 'vue/types/vue' {
  interface Vue {
    // 全局配置项目,会在vue.use(Razor,opts) opts 中注入
    $RAZOR: any
  }
}