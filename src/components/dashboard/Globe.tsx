
import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import GlobeObject from './globe/GlobeObject';
import StarsBackground from './globe/StarsBackground';
import { LocationPoint, FlowLine } from './globe/types';

interface GlobeProps {
  size?: number;
  color?: string;
  wireframe?: boolean;
  className?: string;
  locations?: LocationPoint[];
  flows?: FlowLine[];
}

const Globe: React.FC<GlobeProps> = ({ 
  size = 2, 
  color = '#00D4FF', 
  wireframe = true, 
  className,
  locations = [],
  flows = []
}) => {
  const [mockLocations, setMockLocations] = useState<LocationPoint[]>([]);
  const [mockFlows, setMockFlows] = useState<FlowLine[]>([]);
  
  useEffect(() => {
    if (locations.length === 0) {
      const randomLocations = Array.from({ length: 30 }, () => ({
        lat: (Math.random() * 180) - 90,
        lon: (Math.random() * 360) - 180,
        size: Math.random() * 0.1 + 0.02,
        intensity: Math.random(),
        color: Math.random() > 0.7 ? '#9b87f5' : '#00D4FF'
      }));
      
      setMockLocations(randomLocations);
      
      const randomFlows = Array.from({ length: 15 }, () => {
        const fromIndex = Math.floor(Math.random() * randomLocations.length);
        let toIndex = Math.floor(Math.random() * randomLocations.length);
        while (toIndex === fromIndex) {
          toIndex = Math.floor(Math.random() * randomLocations.length);
        }
        
        return {
          from: randomLocations[fromIndex],
          to: randomLocations[toIndex],
          value: Math.random() * 0.8 + 0.2,
          color: Math.random() > 0.5 ? '#00ffff' : '#ff00ff'
        };
      });
      
      setMockFlows(randomFlows);
    }
  }, [locations]);
  
  const displayLocations = locations.length > 0 ? locations : mockLocations;
  const displayFlows = flows.length > 0 ? flows : mockFlows;
  
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <StarsBackground />
        
        <GlobeObject 
          size={size} 
          color={color} 
          wireframe={wireframe} 
          locations={displayLocations}
          flows={displayFlows}
        />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default Globe;
