
export interface NodeData {
  id: string;
  type: string;
  value: string;
  label: string;
  riskScore: number;
  position?: {
    x: number;
    y: number;
    z: number;
  };
}

export interface EdgeData {
  id: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  color?: string;
}
