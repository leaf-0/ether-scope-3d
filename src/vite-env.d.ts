
/// <reference types="vite/client" />

import '@react-three/fiber';
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Extend intrinsic elements to support React Three Fiber's custom elements
      primitive: any;
      group: any;
    }
  }
}

// Extend THREE.Object3D to include children property for type safety
declare module 'three' {
  interface Object3D {
    material?: THREE.Material;
    children: THREE.Object3D[];
  }
}
