<template>
  <div></div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject, Watch } from "vue-property-decorator";
import MapFactory from "../../sdk/factory";

@Component({
  name: "MapCluster"
})
export default class RzMapCluster extends Vue {
  clusterer!: any;

  @Prop() points!: any[];

  @Prop({ default: true }) visible!: boolean;

  @Prop() clusteredConfig!: any;

  @Prop() unclusteredConfig!: any;

  @Prop() clusterGenerationConfig!: any;

  @Inject() readonly getMap!: Function;

  mounted() {
    this.getMap(async (map: any, type: string) => {
      this.clusterer = await MapFactory.createCluster(type, map);
      this.clusterReload();
    });
  }

  @Watch("points")
  handleDataSourceChange() {
    this.clusterReload();
  }

  clusterReload() {
    this.clusterer &&
      // this.visible &&
      this.clusterer.load(
        this.points,
        {
          clustered: this.clusteredConfig,
          unclustered: this.unclusteredConfig
        },
        this.clusterGenerationConfig
      );
  }

  getCurrentCluster(point: [number, number]) {
    return this.clusterer.getCurrentCluster(point);
  }

  getClusters() {
    return this.clusterer.getClusters();
  }

  destroyCluster() {
    this.clusterer && this.clusterer.destroy();
  }

  beforeDestroy() {
    this.destroyCluster();
  }
}
</script>
