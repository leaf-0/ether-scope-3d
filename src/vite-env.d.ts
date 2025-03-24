
/// <reference types="vite/client" />

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Type definitions for THREE.Line references in our components
declare module '@react-three/fiber' {
  interface ThreeElements {
    line: React.PropsWithChildren<{
      geometry?: THREE.BufferGeometry;
      material?: THREE.Material | THREE.Material[];
    } & Omit<JSX.IntrinsicElements['mesh'], 'args' | 'material' | 'geometry'> & {
      args?: any[];
    }>;
  }
}
