<template>
  <span class="rz-breadcrumb-item" :class="{'is-active': active}">
    <rz-icon :name="icon" v-if="icon"></rz-icon>
    <span>{{label}}</span>
    <span class="rz-breadcrumb__seperator" v-if="showSeperator">{{seperator}}</span>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  name: "BreadcrumbItem"
})
export default class BreadcrumbItem extends Vue {
  @Prop() route: any;

  @Prop(String) label: string;

  @Prop(String) icon: string;

  @Prop(String) seperator: string;

  @Prop({ type: Boolean, default: true }) showSeperator: boolean;

  @Prop({ type: Boolean, default: false }) active: boolean;
}
</script>