export interface IVertex {
  x: number;
  y: number;
}

export interface DrawLineOption {
  color: string;
  weight: number;
  opacity: number;
  fillColor?: string;
  hasArrow?: boolean;
  strokeStyle?: any;
  noStrokeStyle?: boolean;
}

export interface DrawCircleOption {
  lineColor: string;
  weight: number;
  opacity: number;
  radius: number;
  fillColor?: string;
  dashed?: boolean;
  dashedConfig?: any[];
}

export interface DrawPolygonOption {
  lineColor: string;
  fillColor: string;
  weight: number;
  opacity: number;
}

export interface DrawRectOption {
  lineColor: string;
  fillColor: string;
  weight: number;
  opacity: number;
  dashed?: boolean;
  dashedConfig?: number[];
}

export interface Polygon {
  vertexes: IVertex[];
  options: any;
}
export interface Ellipse {
  vertex: IVertex;
  radius: {
    minorAxis: number;
    macroAxis: number;
  };
}
export interface DrawEllipseOption {
  fillColor: string;
  opacity: number;
  linearFlag?: boolean;
  linearStartPoint?: { x: number; y: number };
  linearEndPoint?: { x: number; y: number };
  colorItems: { position: number; color: string }[];
  startRadius: number;
  endRadius: number;
}

export interface ContainerStyle {
  width: number;
  height: number;
}

export interface MouseType {
  up: string;
  down: string;
  move: string;
}

export interface ScreenShot {
  vertexes: [IVertex?, IVertex?];
}

export interface LinearGradientOptionStep {
  distance: number;
  color: string;
}

export interface LinearGradientOption {
  scope: [IVertex, IVertex];
  colorSteps: LinearGradientOptionStep[];
}

export interface DrawRoundRectConfig {
  start: IVertex,
  width: number,
  height: number,
  radius: number,
}
