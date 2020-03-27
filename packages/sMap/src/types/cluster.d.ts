import { Feature, Point } from "geojson";
import { AnyProps } from "supercluster";
import { Offset } from "./marker";

export type ClusterRawPoints = Feature<Point, AnyProps>[];

export interface ClusterOpt {
  clustered: ClusterMarkersOpt,
  unclustered: ClusterMarkersOpt
}

export interface ClusterMarkersOpt {
  offset: Offset,
  markerElement: CustomClusterMarker,
  listeners?: Record<string, Function | Function[]>,
}
export interface ClusterGenerationOpt {
  radius?: number,
  minZoom: number,
  maxZoom: number,
  log?: boolean,
  map?: Function,
  reduce?: Function
}

export interface CustomClusterMarker {
  width: number,
  height: number,
  icon?: string,
  backgroundColor?: string,
  borderRadius?: string,
  opacity?: number,
  textStyle: any,
  createElement?: Function
}