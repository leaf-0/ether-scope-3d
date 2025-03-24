
import { useState, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { selectNode, clearSelectedNode } from '@/store/slices/transactionSlice';
import { NodeData, EdgeData } from './types';
import GraphNode from './GraphNode';
import GraphEdge from './GraphEdge';

const GraphScene = () => {
  const dispatch = useDispatch();
  const { nodes, edges, selectedNode } = useSelector((state: RootState) => state.transaction);
  const { viewport } = useThree();
  const [nodePositions, setNodePositions] = useState<Map<string, THREE.Vector3>>(new Map());
  
  // Convert Redux state to node and edge data
  const graphNodes: NodeData[] = nodes.map(node => ({
    id: node.id,
    type: node.type,
    value: node.value,
    label: node.id.substring(0, 6), // Use a substring of id as label if not available
    riskScore: node.riskScore
  }));
  
  const graphEdges: EdgeData[] = edges.map((edge, index) => ({
    id: `edge-${index}`,
    from: edge.from,
    to: edge.to,
    value: edge.value,
    timestamp: edge.timestamp
  }));
  
  // Initialize node positions using force-directed layout
  useEffect(() => {
    if (graphNodes.length === 0) return;
    
    const positions = new Map<string, THREE.Vector3>();
    const centerNode = graphNodes.find(node => node.type === 'transaction') || graphNodes[0];
    
    // Place central node at origin
    positions.set(centerNode.id, new THREE.Vector3(0, 0, 0));
    
    // Place other nodes in a circle around the center
    const otherNodes = graphNodes.filter(node => node.id !== centerNode.id);
    const radius = 5;
    
    otherNodes.forEach((node, index) => {
      const angle = (index / otherNodes.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 2; // Small random y offset
      
      positions.set(node.id, new THREE.Vector3(x, y, z));
    });
    
    setNodePositions(positions);
  }, [graphNodes]);
  
  // Handle node selection
  const handleNodeClick = (nodeId: string) => {
    if (selectedNode === nodeId) {
      dispatch(clearSelectedNode());
    } else {
      dispatch(selectNode(nodeId));
    }
  };
  
  return (
    <group>
      {graphEdges.map(edge => {
        const fromPos = nodePositions.get(edge.from);
        const toPos = nodePositions.get(edge.to);
        
        if (!fromPos || !toPos) return null;
        
        const isHighlighted = 
          selectedNode === edge.from || 
          selectedNode === edge.to;
        
        return (
          <GraphEdge 
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
        
        return (
          <GraphNode
            key={node.id}
            node={node}
            position={position}
            isSelected={isSelected}
            onClick={() => handleNodeClick(node.id)}
          />
        );
      })}
    </group>
  );
};

export default GraphScene;
