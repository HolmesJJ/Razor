<template>
  <div style="width: 100%; height: 100%">
    <div ref="container" style="with: 100%; height: 100%;"></div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Provide } from "vue-property-decorator";

// import RazorMap from "../../sdk/_abstract/map";
import MapFactory from "./sdk/factory";
import { Point } from "./types/index";

@Component({
  name: "SMap"
})
export default class RzSMap extends Vue {
  // 用来标记根组件
  _rzmapRoot: boolean = true;

  // RazorMap 地图实例
  razorMap?: any;

  // 地图是否可用
  available: boolean = false;

  // 地图配置文件
  @Prop() config!: any;

  // settings
  @Prop({ type: [Array, Object], required: true }) center!:
    | [number, number]
    | { lng: number; lat: number };

  @Prop({ required: true }) zoom!: number;

  @Prop() minZoom!: number;

  @Prop() maxZoom!: number;

  @Prop({ default: true }) enableScrollWheelZoom!: boolean;

  @Prop({ default: true }) draggable!: boolean;

  get mapType(): string {
    return this.config.type;
  }

  get mapSetting() {
    return {
      center: this.center,
      zoom: this.zoom,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom > 18 ? 18 : this.maxZoom,
      enableScrollWheelZoom: this.enableScrollWheelZoom,
      draggable: this.draggable
    };
  }

  @Provide() getMap(founded: Function) {
    const vm = this;
    function checkForMap() {
      if (vm.razorMap && vm.razorMap.getOriginalMap()) {
        founded(vm.razorMap.getOriginalMap(), vm.config.type);
      } else {
        setTimeout(checkForMap, 20);
      }
    }

    checkForMap();
  }

  @Watch("config", { deep: true })
  async handleConfigChange() {
    this.removeListener();
    this.razorMap = undefined;

    this.razorMap = await MapFactory.createMap(this.config);
    this.init().then(event => {
      this.available = true;
      this.$emit("ready", event);
    });
  }

  // handle center change
  @Watch("center")
  handleCenterChange(newCenter: [number, number]) {
    this.razorMap && this.razorMap.setCenter(newCenter);
  }

  // handle zoom change
  @Watch("zoom")
  handleZoomChange(newZoom: number) {
    this.razorMap && this.razorMap.setZoom(newZoom);
  }

  // handle draggable change
  @Watch("draggable")
  handleDraggableChange(draggable: boolean) {
    this.razorMap && this.razorMap.setDraggable(draggable);
  }

  @Watch("enableScrollWheelZoom")
  handleScrollWheelZoomChange(disabled: boolean) {
    this.razorMap && this.razorMap.setScrollWheelZoom(disabled);
  }

  // 移除所有地图事件
  removeListener() {
    this.razorMap && this.razorMap.removeListener(this.$listeners);
  }

  clearOverlays() {
    this.razorMap && this.razorMap.clearOverlays();
  }

  // 根据所给的点设置视域的范围
  setViewport(points: Point[], viewportOptions: any) {
    return this.razorMap.setViewport(points, viewportOptions);
  }

  /**
   * 根据提供的地理区域或坐标获得最佳的地图视野，返回的对象中包含center和zoom属性，分别表示地图的中心点和级别。
   * 此方法仅返回视野信息，不会将新的中心点和级别做用到当前地图上
   */
  getViewport(points: Point[], viewportOptions: any) {
    return this.razorMap.getViewport(points, viewportOptions);
  }

  // initialize map
  async init() {
    try {
      if (this.razorMap) {
        return await this.razorMap.init(
          this.$refs.container as HTMLElement,
          this.mapSetting,
          this.$listeners
        );
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async mounted() {
    this.razorMap = await MapFactory.createMap(this.config);
    this.init().then(event => {
      this.available = true;
      if (this.config.content && this.config.content.mapBgColor && (this.$refs.container as HTMLElement).style['background-color']) {
        (this.$refs.container as HTMLElement).style['background-color'] = this.config.content.mapBgColor;
      }
      this.$emit("ready", event);
    });
  }

  getZoom() {
    return this.razorMap.getZoom();
  }

  getBounds() {
    return this.razorMap.getBounds();
  }

  getCenter() {
    return this.razorMap.getCenter();
  }

  setZoom(zoom) {
    this.razorMap && this.razorMap.setZoom(zoom);
  }
  setCenterAndZoom(center, zoom) {
    this.razorMap && this.razorMap.setCenterAndZoom(center, zoom);
  }

  // 暂时只添加百度地图的换算
  pixelToPoint(pixel) {
    return this.razorMap.pixelToPoint(pixel);
  }

  pointToPixel(point) {
    return this.razorMap.pointToPixel(point);
  }

  containsPoint(point){
    return this.razorMap.containsPoint(point);
  }

  beforeDestroy() {
    this.removeListener();
    this.clearOverlays();
    this.razorMap = undefined;
  }
}
</script>
