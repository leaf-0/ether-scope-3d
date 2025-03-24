
import * as THREE from 'three';

export interface NodeData {
  id: string;
  type: string;
  value: string;
  label: string;
  riskScore: number;
  position?: THREE.Vector3;
}

export interface EdgeData {
  id: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  color?: string;
}
