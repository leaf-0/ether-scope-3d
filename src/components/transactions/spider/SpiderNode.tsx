
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Badge } from '@/components/ui/badge';
import { NodeData } from './types';

interface SpiderNodeProps {
  node: NodeData;
  position: THREE.Vector3;
  size?: number;
  isSelected: boolean;
  onClick: () => void;
}

const SpiderNode = ({ 
  node, 
  position, 
  size = 1, 
  isSelected, 
  onClick 
}: SpiderNodeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const radiusScale = node.type === 'wallet' ? 1.2 : (node.type === 'contract' ? 1 : 0.8);
  
  const getColor = (score: number) => {
    if (score < 30) return new THREE.Color('#4CFF4C');
    if (score < 70) return new THREE.Color('#FFD700');
    return new THREE.Color('#FF0044');
  };
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      if (isSelected) {
        const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.1 + 1;
        meshRef.current.scale.set(pulse, pulse, pulse);
      } else {
        meshRef.current.scale.set(1, 1, 1);
      }
    }
  });
  
  return (
    <group position={position}>
      <mesh ref={meshRef} onClick={onClick}>
        {node.type === 'wallet' ? (
          <boxGeometry args={[size * radiusScale, size * radiusScale, size * radiusScale]} />
        ) : node.type === 'contract' ? (
          <cylinderGeometry args={[size * radiusScale * 0.8, size * radiusScale * 0.8, size * radiusScale, 8]} />
        ) : (
          <sphereGeometry args={[size * radiusScale, 16, 16]} />
        )}
        <meshStandardMaterial 
          color={getColor(node.riskScore)} 
          emissive={getColor(node.riskScore)}
          emissiveIntensity={isSelected ? 0.8 : 0.2}
          roughness={0.5}
          metalness={0.8}
        />
      </mesh>
      
      {(isSelected || size > 1.2) && (
        <Html distanceFactor={10} position={[0, size * 1.5, 0]}>
          <div className="px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md text-center text-white text-xs whitespace-nowrap">
            <div className="font-bold">{node.label || node.id.substring(0, 6) + '...'}</div>
            {isSelected && (
              <div className="flex gap-1 items-center mt-1">
                <Badge variant={node.riskScore < 30 ? "success" : node.riskScore < 70 ? "warning" : "destructive"} className="text-[10px] px-1 py-0">
                  Risk: {node.riskScore}
                </Badge>
                <span className="text-[10px]">{node.value} ETH</span>
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

export default SpiderNode;
