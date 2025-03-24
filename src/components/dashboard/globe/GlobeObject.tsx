
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { LocationPoint, FlowLine } from './types';
import AnimatedPoint from './AnimatedPoint';
import AnimatedFlow from './AnimatedFlow';

interface GlobeObjectProps {
  size?: number;
  color?: string;
  wireframe?: boolean;
  locations?: LocationPoint[];
  flows?: FlowLine[];
}

const GlobeObject = ({ 
  size = 2, 
  color = '#00D4FF', 
  wireframe = true,
  locations = [],
  flows = []
}: GlobeObjectProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });
  
  return (
    <>
      <Sphere args={[size, 64, 64]} ref={meshRef}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.15}
          speed={2}
          wireframe={wireframe}
          opacity={0.8}
          transparent
        />
      </Sphere>
      
      {locations.map((location, i) => (
        <AnimatedPoint key={`point-${i}`} point={location} radius={size} />
      ))}
      
      {flows.map((flow, i) => (
        <AnimatedFlow key={`flow-${i}`} flow={flow} radius={size} />
      ))}
    </>
  );
};

export default GlobeObject;
