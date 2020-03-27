
import { PolygonOptions } from "../../../types";

const WIN_ROOT = window as any;

enum DRAW_TOOL_MODE {
  CIRCLE = "circle", // 圆形
  POLYGON = "polygon", // 多边形
  RECTANGLE = "rectangle", // 矩形
}

export default class DrawTool {
  map: any;

  tool: any;

  autoClose: boolean = true;

  styleOptions: PolygonOptions;


  /**
   * 地图右键菜单
   * @param args 初始化参数
   */
  constructor(map, opts) {
    this.map = map;
    this.styleOptions = opts;
  }

  // 绘制矩形
  drawRec(isFn) {
    const { autoClose, styleOptions } = this;
    this.tool = new WIN_ROOT.IMAP.RectangleTool({
      autoClose,
      ...styleOptions
    });
    this.map.addTool(this.tool);
    this.tool.open();
    typeof isFn === "function" && this.tool.addEventListener(
      WIN_ROOT.IMAP.Constants.ADD_OVERLAY,
      isFn
    );
  }

  // 绘制圆形
  drawCircle(isFn) {
    const { autoClose, styleOptions } = this;
    this.tool = new WIN_ROOT.IMAP.CircleTool({
      autoClose,
      ...styleOptions
    });
    this.map.addTool(this.tool);
    this.tool.open();
    typeof isFn === "function" && this.tool.addEventListener(
      WIN_ROOT.IMAP.Constants.ADD_OVERLAY,
      isFn
    );
  }

  // 绘制多边形
  drawPolygon(isFn) {
    const { autoClose, styleOptions } = this;
    this.tool = new WIN_ROOT.IMAP.PolygonTool({
      autoClose,
      ...styleOptions
    });
    this.map.addTool(this.tool);
    this.tool.open();
    typeof isFn === "function" && this.tool.addEventListener(
      WIN_ROOT.IMAP.Constants.ADD_OVERLAY,
      isFn
    );
  }

  // 清除地图上的绘制物
  close() {
    const { tool } = this;
    tool && tool.close();
    tool && tool.clear();
    this.tool = null;
  }

  /**
   * 是否自动结束绘制
   * 这里主要是兼容连续绘制模式
   * @param flag boolean
   */
  setAutoClose(flag) {
    this.autoClose = flag;
  }

  /**
   * 获取当前绘制工具对象
   * @param mode 圆形/矩形/多边形
   * @param completeFn 画完后回调
   */
  getTool(mode, completeFn) {
    switch (mode) {
      case DRAW_TOOL_MODE.CIRCLE:
        this.drawCircle(completeFn);
        break;
      case DRAW_TOOL_MODE.POLYGON:
        this.drawPolygon(completeFn);
        break;
      case DRAW_TOOL_MODE.RECTANGLE:
        this.drawRec(completeFn);
        break;
      default:
        break;
    }
    return this.tool;
  }
}
