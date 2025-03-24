import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { selectNode, clearSelectedNode } from '@/store/slices/transactionSlice';
import { Badge } from '@/components/ui/badge';

interface SpiderMapProps {
  className?: string;
}

interface NodeData {
  id: string;
  type: string;
  label: string;
  value: string;
  riskScore: number;
  position?: THREE.Vector3;
}

interface EdgeData {
  id: string;
  fromId: string;
  toId: string;
  value: string;
  timestamp: string;
}

const SpiderNode = ({ 
  node, 
  position, 
  size = 1, 
  isSelected, 
  onClick 
}: { 
  node: NodeData; 
  position: THREE.Vector3; 
  size?: number; 
  isSelected: boolean;
  onClick: () => void;
}) => {
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

const SpiderEdge = ({ 
  fromPos, 
  toPos, 
  value, 
  isHighlighted 
}: { 
  fromPos: THREE.Vector3; 
  toPos: THREE.Vector3; 
  value: string; 
  isHighlighted: boolean;
}) => {
  const ref = useRef<THREE.Line>(null);
  
  useFrame(({ clock }) => {
    if (ref.current && ref.current.material instanceof THREE.LineBasicMaterial) {
      if (isHighlighted) {
        const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.3 + 0.7;
        ref.current.material.opacity = pulse;
      } else {
        ref.current.material.opacity = 0.4;
      }
    }
  });
  
  const valueNum = parseFloat(value || '0');
  const thickness = valueNum > 100 ? 3 : valueNum > 10 ? 2 : 1;
  
  const middlePoint = new THREE.Vector3().addVectors(fromPos, toPos).multiplyScalar(0.5);
  const direction = new THREE.Vector3().subVectors(fromPos, toPos).cross(new THREE.Vector3(0, 1, 0)).normalize();
  middlePoint.add(direction.multiplyScalar(0.3));
  
  const curve = new THREE.QuadraticBezierCurve3(fromPos, middlePoint, toPos);
  const points = curve.getPoints(20);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <primitive 
      object={new THREE.Line(
        geometry, 
        new THREE.LineBasicMaterial({ 
          color: isHighlighted ? "#00ffff" : "#ffffff", 
          transparent: true, 
          opacity: isHighlighted ? 0.8 : 0.3, 
          linewidth: thickness 
        })
      )} 
      ref={ref}
    />
  );
};

const SpiderScene = () => {
  const dispatch = useDispatch();
  const { nodes, edges, selectedNode } = useSelector((state: RootState) => state.transaction);
  const [nodePositions, setNodePositions] = useState<Map<string, THREE.Vector3>>(new Map());
  const [centralNode, setCentralNode] = useState<string | null>(null);
  
  const graphNodes: NodeData[] = nodes.map(node => ({
    id: node.id,
    type: node.type,
    label: node.type === 'transaction' ? 'TX: ' + node.id.substring(0, 6) : node.id.substring(0, 8),
    value: node.value,
    riskScore: node.riskScore
  }));
  
  const graphEdges: EdgeData[] = edges.map((edge, index) => ({
    id: `edge-${index}`,
    fromId: edge.from,
    toId: edge.to,
    value: edge.value,
    timestamp: edge.timestamp
  }));
  
  useEffect(() => {
    if (graphNodes.length === 0) return;
    
    const centralId = selectedNode || graphNodes[0].id;
    setCentralNode(centralId);
    
    const newPositions = new Map<string, THREE.Vector3>();
    
    newPositions.set(centralId, new THREE.Vector3(0, 0, 0));
    
    const connectedNodes = new Set<string>();
    graphEdges.forEach(edge => {
      if (edge.fromId === centralId) connectedNodes.add(edge.toId);
      if (edge.toId === centralId) connectedNodes.add(edge.fromId);
    });
    
    const connectedCount = connectedNodes.size;
    let i = 0;
    connectedNodes.forEach(nodeId => {
      if (nodeId !== centralId) {
        const angle = (i / connectedCount) * Math.PI * 2;
        const x = Math.cos(angle) * 3;
        const z = Math.sin(angle) * 3;
        newPositions.set(nodeId, new THREE.Vector3(x, 0, z));
        i++;
      }
    });
    
    const remainingNodes = graphNodes.filter(node => 
      !newPositions.has(node.id)
    );
    
    remainingNodes.forEach((node, i) => {
      const angle = (i / remainingNodes.length) * Math.PI * 2;
      const x = Math.cos(angle) * 6;
      const z = Math.sin(angle) * 6;
      const y = (Math.random() - 0.5) * 2;
      newPositions.set(node.id, new THREE.Vector3(x, y, z));
    });
    
    setNodePositions(newPositions);
  }, [graphNodes, graphEdges, selectedNode]);
  
  const handleNodeClick = (nodeId: string) => {
    if (selectedNode === nodeId) {
      dispatch(clearSelectedNode());
    } else {
      dispatch(selectNode(nodeId));
    }
  };
  
  if (graphNodes.length === 0) return null;
  
  return (
    <>
      {graphEdges.map(edge => {
        const fromPos = nodePositions.get(edge.fromId);
        const toPos = nodePositions.get(edge.toId);
        
        if (!fromPos || !toPos) return null;
        
        const isHighlighted = 
          selectedNode === edge.fromId || 
          selectedNode === edge.toId;
        
        return (
          <SpiderEdge 
            key={edge.id}
            fromPos={fromPos}
            toPos={toPos}
            value={edge.value}
            isHighlighted={isHighlighted}
          />
        );
      })}
      
      {graphNodes.map(node => {
        const position = nodePositions.get(node.id);
        if (!position) return null;
        
        const isSelected = selectedNode === node.id;
        const isCentral = centralNode === node.id;
        
        return (
          <SpiderNode
            key={node.id}
            node={node}
            position={position}
            size={isCentral ? 1.5 : 1}
            isSelected={isSelected}
            onClick={() => handleNodeClick(node.id)}
          />
        );
      })}
      
      <ambientLight intensity={0.3} />
      
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, -5, -5]} intensity={0.4} />
    </>
  );
};

const SpiderMap: React.FC<SpiderMapProps> = ({ className }) => {
  const { nodes, edges, isLoading } = useSelector((state: RootState) => state.transaction);
  
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-gray-400">Loading transaction data...</p>
        </div>
      </div>
    );
  }
  
  if (nodes.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <p className="text-lg text-gray-400">No transaction data available</p>
          <p className="text-sm text-gray-500 mt-2">Search for a transaction to view connections</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`h-full w-full ${className}`}>
      <Canvas className="w-full h-full" camera={{ position: [0, 4, 10], fov: 50 }}>
        <SpiderScene />
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

export default SpiderMap;
