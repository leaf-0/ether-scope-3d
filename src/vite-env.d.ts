
/// <reference types="vite/client" />

import '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Extend intrinsic elements to support React Three Fiber's custom elements
      primitive: any;
    }
  }
}
