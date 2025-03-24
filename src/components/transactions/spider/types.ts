
import * as THREE from 'three';

export interface NodeData {
  id: string;
  type: string;
  label: string;
  value: string;
  riskScore: number;
  position?: THREE.Vector3;
}

export interface EdgeData {
  id: string;
  fromId: string;
  toId: string;
  value: string;
  timestamp: string;
}
