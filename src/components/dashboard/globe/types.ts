
export interface LocationPoint {
  lat: number;
  lon: number;
  size: number;
  intensity: number;
  color?: string;
}

export interface FlowLine {
  from: LocationPoint;
  to: LocationPoint;
  value: number;
  color?: string;
}
