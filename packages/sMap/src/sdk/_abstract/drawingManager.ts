abstract class RazorMapDrawingManager {
  map!: any;

  manager!: any;

  drawingMode!: string;

  constructor(map: any, defaultMode: string) {
    this.map = map;
    this.drawingMode = defaultMode;
  }
  // 需要在init的时候绑定complete事件，用event抛出画成的图形的顶点信息
  abstract init(styleOptions: any, listeners?: any);

  abstract draw(drawingMode: string);

  abstract clearAll(): void;
}

export default RazorMapDrawingManager;