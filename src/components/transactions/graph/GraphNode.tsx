
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Badge } from '@/components/ui/badge';
import { NodeData } from './types';

interface GraphNodeProps {
  node: NodeData;
  position: THREE.Vector3;
  isSelected: boolean;
  onClick: () => void;
}

const GraphNode = ({ node, position, isSelected, onClick }: GraphNodeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Scale nodes based on type
  const scale = node.type === 'transaction' ? 1.2 : 
                node.type === 'contract' ? 1 : 0.8;
  
  // Different geometries for different node types
  const geometry = node.type === 'transaction' ? 
                   <octahedronGeometry args={[1, 0]} /> : 
                   node.type === 'contract' ? 
                   <boxGeometry args={[1, 1, 1]} /> : 
                   <sphereGeometry args={[1, 16, 16]} />;
  
  // Risk-based color
  const getColor = (score: number) => {
    if (score < 30) return new THREE.Color('#4CFF4C');
    if (score < 70) return new THREE.Color('#FFD700');
    return new THREE.Color('#FF0044');
  };
  
  const nodeColor = getColor(node.riskScore);
  
  // Node animation on selection
  useFrame(({ clock }) => {
    if (meshRef.current) {
      if (isSelected) {
        // Pulse effect when selected
        const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.1 + 1;
        meshRef.current.scale.set(
          scale * pulse, 
          scale * pulse, 
          scale * pulse
        );
      } else {
        meshRef.current.scale.set(scale, scale, scale);
      }
      
      // Gentle rotation
      meshRef.current.rotation.y += 0.005;
    }
  });
  
  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        onClick={onClick}
        castShadow
      >
        {geometry}
        <meshStandardMaterial 
          color={nodeColor} 
          emissive={nodeColor}
          emissiveIntensity={isSelected ? 0.6 : 0.2}
          roughness={0.5}
          metalness={0.8}
        />
      </mesh>
      
      {isSelected && (
        <Html distanceFactor={10} position={[0, 1.5, 0]}>
          <div className="px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md text-center text-white text-xs whitespace-nowrap">
            <div className="font-bold">{node.label}</div>
            <div className="flex gap-1 items-center mt-1 justify-center">
              <Badge 
                variant={node.riskScore < 30 ? "success" : node.riskScore < 70 ? "warning" : "destructive"} 
                className="text-[10px] px-1 py-0">
                Risk: {node.riskScore}
              </Badge>
              <span className="text-[10px]">{node.value} ETH</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

export default GraphNode;
