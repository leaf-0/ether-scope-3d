
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface GlobeProps {
  size?: number;
  color?: string;
  wireframe?: boolean;
  className?: string;
}

const GlobeObject = ({ 
  size = 2, 
  color = '#00D4FF', 
  wireframe = true
}: GlobeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });
  
  return (
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
  );
};

const Globe: React.FC<GlobeProps> = ({ 
  size = 2, 
  color = '#00D4FF', 
  wireframe = true, 
  className 
}) => {
  // Generate random dots on the globe
  const [locations, setLocations] = useState<{ lat: number; lon: number; size: number }[]>([]);
  
  useEffect(() => {
    // Generate random transaction locations
    const randomLocations = Array.from({ length: 30 }, () => ({
      lat: (Math.random() * 180) - 90,
      lon: (Math.random() * 360) - 180,
      size: Math.random() * 0.1 + 0.02
    }));
    
    setLocations(randomLocations);
  }, []);
  
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas className="three-canvas" camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <GlobeObject size={size} color={color} wireframe={wireframe} />
        
        {/* Transaction locations */}
        {locations.map((loc, i) => {
          // Convert lat/lon to 3D coordinates
          const phi = (90 - loc.lat) * (Math.PI / 180);
          const theta = (loc.lon + 180) * (Math.PI / 180);
          
          const x = -(size * Math.sin(phi) * Math.cos(theta));
          const z = size * Math.sin(phi) * Math.sin(theta);
          const y = size * Math.cos(phi);
          
          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[loc.size, 16, 16]} />
              <meshBasicMaterial 
                color={new THREE.Color(color).offsetHSL(0, 0, 0.2)} 
                transparent 
                opacity={0.8} 
              />
            </mesh>
          );
        })}
        
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
