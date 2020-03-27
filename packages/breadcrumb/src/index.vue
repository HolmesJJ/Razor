<template>
  <!-- 编写 breadcrumb 组件 -->
  <div class="rz-breadcrumb" role="navigation">
    <rz-breadcrumb-item
      v-if="showBackward"
      icon="arrow-left"
      class="rz-breadcrumb__backward"
      :label="backwardText"
      @click.native="goBack"
      seperator="|"
    ></rz-breadcrumb-item>

    <rz-breadcrumb-item
      v-for="(item, index) in showItems"
      :key="item.label"
      :icon="item.icon"
      :label="item.label"
      :route="item.route"
      :seperator="seperator"
      :showSeperator="index !== showItems.length - 1"
      :active="index === showItems.length - 1"
    ></rz-breadcrumb-item>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator";

// components
import RzBreadcrumbItem from "./BreadcrumbItem.vue";
import RzIcon from "../../icon/src/index.vue";
import { t } from "rz/locale";

@Component({
  name: "Breadcrumb",
  components: {
    RzBreadcrumbItem,
    RzIcon
  },
})
export default class Breadcrumb extends Vue {
  readonly $router!: any;
  readonly $route!: any;

  @Prop({ type: String, default: "/" }) seperator: string;

  @Prop({ type: Boolean, default: false }) backward: boolean;

  @Prop({ type: String, default: t('el.Breadcrumb.backwardText') }) backwardText: string;

  @Prop({ type: Array }) items!: any;

  get showItems(): any[] {
    const index = this.items.findIndex(item => {
      const route = item.route;
      if (route.name) {
        return route.name === this.$route.name;
      } else {
        return route.path === this.$route.path;
      }
    });
    if (index === -1) {
      return [];
    }
    return this.items.slice(0, index + 1);
  }

  get showBackward(): boolean {
    return this.backward && this.showItems.length > 1;
  }

  /* handler */
  goBack() {
    // window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    this.$emit("go-back", this.showItems[this.showItems.length - 1]);
  }
}
</script>
