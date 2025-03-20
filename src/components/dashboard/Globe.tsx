
import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface LocationPoint {
  lat: number;
  lon: number;
  size: number;
  intensity: number;
  color?: string;
}

interface FlowLine {
  from: LocationPoint;
  to: LocationPoint;
  value: number;
  color?: string;
}

interface GlobeProps {
  size?: number;
  color?: string;
  wireframe?: boolean;
  className?: string;
  locations?: LocationPoint[];
  flows?: FlowLine[];
}

const AnimatedPoint = ({ point, radius }: { point: LocationPoint, radius: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);
  
  // Convert lat/lon to 3D coordinates
  const phi = (90 - point.lat) * (Math.PI / 180);
  const theta = (point.lon + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      pulseRef.current = Math.sin(clock.getElapsedTime() * 2 + point.size * 10) * 0.2 + 0.8;
      meshRef.current.scale.setScalar(point.size * pulseRef.current);
      
      // Glow effect
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      if (material) {
        material.opacity = 0.6 + 0.4 * pulseRef.current;
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

const AnimatedFlow = ({ flow, radius }: { flow: FlowLine, radius: number }) => {
  const { from, to, value, color } = flow;
  const lineRef = useRef<THREE.Line>(null);
  const materialRef = useRef<THREE.LineDashedMaterial>(null);
  
  // Convert lat/lon to 3D coordinates for 'from' point
  const fromPhi = (90 - from.lat) * (Math.PI / 180);
  const fromTheta = (from.lon + 180) * (Math.PI / 180);
  
  const fromX = -(radius * Math.sin(fromPhi) * Math.cos(fromTheta));
  const fromZ = radius * Math.sin(fromPhi) * Math.sin(fromTheta);
  const fromY = radius * Math.cos(fromPhi);
  
  // Convert lat/lon to 3D coordinates for 'to' point
  const toPhi = (90 - to.lat) * (Math.PI / 180);
  const toTheta = (to.lon + 180) * (Math.PI / 180);
  
  const toX = -(radius * Math.sin(toPhi) * Math.cos(toTheta));
  const toZ = radius * Math.sin(toPhi) * Math.sin(toTheta);
  const toY = radius * Math.cos(toPhi);
  
  // Create a curved path between the two points
  const curve = useMemo(() => {
    const fromVec = new THREE.Vector3(fromX, fromY, fromZ);
    const toVec = new THREE.Vector3(toX, toY, toZ);
    
    // Calculate middle point with some elevation
    const midPoint = new THREE.Vector3().addVectors(fromVec, toVec).multiplyScalar(0.5);
    const midElevation = radius * 0.2 * value;
    midPoint.normalize().multiplyScalar(radius + midElevation);
    
    // Create a quadratic curve
    return new THREE.QuadraticBezierCurve3(fromVec, midPoint, toVec);
  }, [fromX, fromY, fromZ, toX, toY, toZ, radius, value]);
  
  // Create points along the curve for the line
  const points = useMemo(() => curve.getPoints(50), [curve]);
  
  useFrame(({ clock }) => {
    if (materialRef.current) {
      const time = clock.getElapsedTime();
      materialRef.current.opacity = (Math.sin(time * 2) * 0.2 + 0.8) * 0.7;
      materialRef.current.dashSize = 0.3;
      materialRef.current.gapSize = 0.1;
      materialRef.current.scale = 1;
      materialRef.current.needsUpdate = true;
    }
  });
  
  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          count={points.length}
          itemSize={3}
        />
      </bufferGeometry>
      <lineDashedMaterial
        ref={materialRef}
        color={color || "#00ffff"}
        dashSize={0.3}
        gapSize={0.1}
        opacity={0.7}
        transparent
        linewidth={1}
      />
    </line>
  );
};

const GlobeObject = ({ 
  size = 2, 
  color = '#00D4FF', 
  wireframe = true,
  locations = [],
  flows = []
}: GlobeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Use a textureLoader directly rather than useTexture to avoid the runtime error
  const textureMap = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load('/earthmap.jpg', undefined, undefined, (error) => {
      console.error('Error loading texture:', error);
    });
  }, []);
  
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
      
      {/* Add location points */}
      {locations.map((location, i) => (
        <AnimatedPoint key={`point-${i}`} point={location} radius={size} />
      ))}
      
      {/* Add flow lines */}
      {flows.map((flow, i) => (
        <AnimatedFlow key={`flow-${i}`} flow={flow} radius={size} />
      ))}
    </>
  );
};

const StarsBackground = () => {
  const starsRef = useRef<THREE.Points>(null);
  
  const [starPositions, setStarPositions] = useState<Float32Array | null>(null);
  
  useEffect(() => {
    // Generate random stars
    const starsCount = 2000;
    const positions = new Float32Array(starsCount * 3);
    
    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;
    }
    
    setStarPositions(positions);
  }, []);
  
  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.01;
    }
  });
  
  if (!starPositions) return null;
  
  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={starPositions}
          count={starPositions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#ffffff" sizeAttenuation transparent opacity={0.8} />
    </points>
  );
};

const Globe: React.FC<GlobeProps> = ({ 
  size = 2, 
  color = '#00D4FF', 
  wireframe = true, 
  className,
  locations = [],
  flows = []
}) => {
  // Generate mock data if none provided
  const [mockLocations, setMockLocations] = useState<LocationPoint[]>([]);
  const [mockFlows, setMockFlows] = useState<FlowLine[]>([]);
  
  useEffect(() => {
    if (locations.length === 0) {
      // Generate random transaction locations
      const randomLocations = Array.from({ length: 30 }, () => ({
        lat: (Math.random() * 180) - 90,
        lon: (Math.random() * 360) - 180,
        size: Math.random() * 0.1 + 0.02,
        intensity: Math.random(),
        color: Math.random() > 0.7 ? '#9b87f5' : '#00D4FF'
      }));
      
      setMockLocations(randomLocations);
      
      // Generate random flows between some locations
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
      <Canvas className="three-canvas" camera={{ position: [0, 0, 5], fov: 45 }}>
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
