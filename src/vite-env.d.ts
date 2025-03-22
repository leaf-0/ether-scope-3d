
/// <reference types="vite/client" />

import { Line } from 'three';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// This augments the namespace to avoid TypeScript errors with Three.js line references
declare module 'three' {
  interface Line {
    __threeJSLine: true;
  }
}

// Type definition for the ref in React Three Fiber components
declare module '@react-three/fiber' {
  interface ThreeLine extends Line {
    __threeJSLine: true;
  }
}
