
/// <reference types="vite/client" />

import { Line } from 'three';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Type definition for THREE.Line references in our components
declare module 'three' {
  interface Line {
    __lineType: true;
  }
}

// Extend the ref types for React Three Fiber
declare module '@react-three/fiber' {
  interface ThreeElements {
    line: LineProps;
  }
  
  interface LineProps extends Object3DProps {
    geometry?: BufferGeometry;
    material?: Material | Material[];
  }
}
