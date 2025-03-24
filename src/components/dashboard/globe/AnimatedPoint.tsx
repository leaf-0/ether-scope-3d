
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LocationPoint } from './types';

interface AnimatedPointProps {
  point: LocationPoint;
  radius: number;
}

const AnimatedPoint = ({ point, radius }: AnimatedPointProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);
  
  const phi = (90 - point.lat) * (Math.PI / 180);
  const theta = (point.lon + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      pulseRef.current = Math.sin(clock.getElapsedTime() * 2 + point.size * 10) * 0.2 + 0.8;
      meshRef.current.scale.setScalar(point.size * pulseRef.current);
      
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      if (material) {
        material.opacity = 0.6 + 0.4 * pulseRef.current;
        material.needsUpdate = true;
      }
    }
  });
  
  return (
    <mesh ref={meshRef} position={[x, y, z]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial 
        color={point.color || "#9b87f5"} 
        transparent 
        opacity={0.8} 
      />
    </mesh>
  );
};

export default AnimatedPoint;
