import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { selectNode, clearSelectedNode } from '@/store/slices/transactionSlice';

interface Node {
  id: string;
  type: string;
  riskScore: number;
  value: string;
  position?: THREE.Vector3;
}

interface Edge {
  from: string;
  to: string;
  value: string;
  timestamp: string;
}

const NodeObject = ({ 
  node, 
  position, 
  isSelected, 
  onClick 
}: { 
  node: Node; 
  position: THREE.Vector3; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const getColor = (score: number) => {
    if (score < 30) return new THREE.Color('#4CFF4C'); // green
    if (score < 70) return new THREE.Color('#FFD700'); // amber
    return new THREE.Color('#FF0044'); // red
  };
  
  useFrame(() => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.scale.x = 1 + Math.sin(Date.now() * 0.005) * 0.1;
        meshRef.current.scale.y = 1 + Math.sin(Date.now() * 0.005) * 0.1;
        meshRef.current.scale.z = 1 + Math.sin(Date.now() * 0.005) * 0.1;
      } else {
        meshRef.current.scale.set(1, 1, 1);
      }
    }
  });
  
  return (
    <group position={position}>
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color={getColor(node.riskScore)} 
          emissive={getColor(node.riskScore)} 
          emissiveIntensity={isSelected ? 0.8 : 0.3} 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {isSelected && (
        <Html distanceFactor={8} position={[0, 0.5, 0]}>
          <div className="bg-dark-lighter p-2 rounded-md text-center text-white text-xs whitespace-nowrap">
            {node.id.substring(0, 6)}...{node.id.substring(node.id.length - 4)}
          </div>
        </Html>
      )}
    </group>
  );
};

const EdgeObject = ({ 
  start, 
  end, 
  value 
}: { 
  start: THREE.Vector3; 
  end: THREE.Vector3; 
  value: string; 
}) => {
  const ref = useRef<THREE.Line>(null);
  
  useFrame(({ clock }) => {
    if (ref.current && ref.current.material instanceof THREE.LineBasicMaterial) {
      const opacity = 0.4 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
      ref.current.material.opacity = opacity;
    }
  });
  
  const points = [start, end];
  
  return (
    <line ref={ref}>
      <bufferGeometry attach="geometry" setFromPoints={points} />
      <lineBasicMaterial
        attach="material"
        color="#00D4FF"
        transparent
        opacity={0.6}
        linewidth={parseFloat(value) > 20 ? 2 : (parseFloat(value) > 5 ? 1.5 : 1)}
      />
    </line>
  );
};

const GraphScene = ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
  const dispatch = useDispatch();
  const selectedNodeId = useSelector((state: RootState) => state.transaction.selectedNode);
  const [nodePositions, setNodePositions] = useState<Map<string, THREE.Vector3>>(new Map());
  
  useEffect(() => {
    if (nodes.length === 0) return;
    
    const newPositions = new Map<string, THREE.Vector3>();
    nodes.forEach(node => {
      if (!nodePositions.has(node.id)) {
        const randomPosition = new THREE.Vector3(
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5
        );
        newPositions.set(node.id, randomPosition);
      } else {
        newPositions.set(node.id, nodePositions.get(node.id)!);
      }
    });
    
    const iterations = 50;
    for (let i = 0; i < iterations; i++) {
      for (let a = 0; a < nodes.length; a++) {
        for (let b = a + 1; b < nodes.length; b++) {
          const nodeA = nodes[a];
          const nodeB = nodes[b];
          const posA = newPositions.get(nodeA.id)!;
          const posB = newPositions.get(nodeB.id)!;
          
          const direction = new THREE.Vector3().subVectors(posA, posB);
          const distance = direction.length();
          
          if (distance < 2) {
            direction.normalize().multiplyScalar(0.05 / (distance * distance));
            newPositions.set(nodeA.id, posA.clone().add(direction));
            newPositions.set(nodeB.id, posB.clone().sub(direction));
          }
        }
      }
      
      edges.forEach(edge => {
        const sourcePos = newPositions.get(edge.from);
        const targetPos = newPositions.get(edge.to);
        
        if (sourcePos && targetPos) {
          const direction = new THREE.Vector3().subVectors(targetPos, sourcePos);
          const distance = direction.length();
          
          if (distance > 2) {
            direction.normalize().multiplyScalar(0.01 * distance);
            newPositions.set(edge.from, sourcePos.clone().add(direction));
            newPositions.set(edge.to, targetPos.clone().sub(direction));
          }
        }
      });
    }
    
    setNodePositions(newPositions);
  }, [nodes, edges]);
  
  if (nodes.length === 0) return null;
  
  return (
    <>
      {edges.map(edge => {
        const startPos = nodePositions.get(edge.from);
        const endPos = nodePositions.get(edge.to);
        
        if (!startPos || !endPos) return null;
        
        return (
          <EdgeObject 
            key={`${edge.from}-${edge.to}`} 
            start={startPos} 
            end={endPos} 
            value={edge.value} 
          />
        );
      })}
      
      {nodes.map(node => {
        const position = nodePositions.get(node.id);
        
        if (!position) return null;
        
        return (
          <NodeObject 
            key={node.id} 
            node={node} 
            position={position} 
            isSelected={selectedNodeId === node.id}
            onClick={() => {
              if (selectedNodeId === node.id) {
                dispatch(clearSelectedNode());
              } else {
                dispatch(selectNode(node.id));
              }
            }} 
          />
        );
      })}
    </>
  );
};

interface TransactionGraphProps {
  className?: string;
}

const TransactionGraph: React.FC<TransactionGraphProps> = ({ className }) => {
  const { nodes, edges, isLoading } = useSelector((state: RootState) => state.transaction);
  
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-neon-blue border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2 text-sm text-gray-400">Loading transaction graph...</p>
        </div>
      </div>
    );
  }
  
  if (nodes.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <p className="text-lg text-gray-400">No transaction data available</p>
          <p className="mt-2 text-sm text-gray-500">Search for a transaction or wallet to view graph</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <GraphScene nodes={nodes} edges={edges} />
        
        <OrbitControls 
          makeDefault 
          enableDamping 
          dampingFactor={0.1} 
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default TransactionGraph;
