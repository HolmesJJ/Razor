export default abstract class RazorMapInfoWindow {
  map: any;

  infoWindow!: any;

  infoWindowConfig!: any;

  constructor(map: any, infoWindowConfig: any) {
    this.map = map;
    this.infoWindowConfig = infoWindowConfig;
  }

  // 创造一个弹窗，并返回infoWindow实例
  abstract addInfoWindow(): any;
}