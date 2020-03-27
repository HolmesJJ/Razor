import { POS_EVENTS, ZOOM_EVENTS } from "../../shared/constants/mapEvents";
import { Coordinate, PositionEvent, BaseEvent, ZoomEvent } from "../../types";

// mine map的事件target会直接返回地图实例，因为没有minemap的.d.ts文件所以暂时类型标为any
interface MineMapBaseEvent {
  type: string;
  target: any;
}

interface MineMapMouseEvent {
  type: string;
  target: any;
  lngLat: Coordinate;
  point: {
    x: number;
    y: number;
  };
  originalEvent: Event;
}

interface KVObject {
  [key: string]: any;
}

function _eventTypeConverter(originalType: string): string {
  return Object.keys(eventsDiffTypeMap).includes(originalType)
    ? eventsDiffTypeMap[originalType]
    : originalType;
}

/**
 * 调用mine map sdk方法 拿到地图容器的html element
 * https://docs.mapbox.com/mapbox-gl-js/api/#map#getcontainer
 * @param map MineMap的sdk实例
 */
function _getTargetContainer(map: any): HTMLElement {
  return map.getContainer();
}

// Mine Map的事件名称和标准events 有差异时的对照表
const eventsDiffTypeMap: KVObject = {
  dragging: "drag",
};

function positionEventParser(e: MineMapMouseEvent): PositionEvent {
  const { type, point, lngLat, originalEvent } = e;
  //
  const target = _getTargetContainer(e.target);
  return {
    type,
    target,
    point: lngLat,
    pixel: point,
    originalEvent,
  };
}

function zoomEventParser(e: MineMapMouseEvent): ZoomEvent {
  const { type, target } = e;
  const zoom = target.getZoom();
  const targetContainer = _getTargetContainer(target);
  return {
    type,
    target: targetContainer,
    zoom,
  };
}

function baseEventParser(e: MineMapBaseEvent): BaseEvent {
  const { type } = e;
  const target = _getTargetContainer(e.target);
  return {
    type,
    target,
  };
}

const bindEvent = (map: any, name: string, handler: Function) => {
  if (POS_EVENTS.includes(name)) {
    // 对于事件名称进行转换
    name = _eventTypeConverter(name);
    // 调用mine map方法绑定事件
    map.on(name, (e: MineMapMouseEvent) => {
      handler(positionEventParser(e));
    });
  } else if (ZOOM_EVENTS.includes(name)) {
    map.on(name, (e: MineMapMouseEvent) => {
      handler(zoomEventParser(e));
    });
  } else {
    map.on(name, (e: MineMapBaseEvent) => {
      handler(baseEventParser(e));
    });
  }
};

export default bindEvent;
