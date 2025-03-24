
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { selectNode, clearSelectedNode } from '@/store/slices/transactionSlice';
import { NodeData, EdgeData } from './types';
import SpiderNode from './SpiderNode';
import SpiderEdge from './SpiderEdge';

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

export default SpiderScene;
