import { Point } from "../../types";
import { MarkerConfig } from "../../types/marker";

abstract class RazorMapMarker {
  map: any;

  marker!: any;

  constructor(map: any) {
    this.map = map;
  }

  getMarker() {
    return this.marker;
  }

  abstract addMarker(
    markerConfig: MarkerConfig,
    listeners: Record<string, Function | Function[]>
  ): void;

  abstract removeMarker(): void;

  abstract setPosition(position: Point): void;

  abstract setDraggable(draggable: boolean): void;

  abstract setOffset(offset: { x: number; y: number }): void;

  abstract hideMarker(): void;

  abstract showMarker(): void;
}

export default RazorMapMarker;
