
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GraphEdgeProps {
  fromPos: THREE.Vector3;
  toPos: THREE.Vector3;
  value: string;
  isHighlighted: boolean;
}

const GraphEdge = ({ fromPos, toPos, value, isHighlighted }: GraphEdgeProps) => {
  const lineRef = useRef<THREE.Object3D>(null);
  
  // Determine line thickness based on transaction value
  const valueNum = parseFloat(value || '0');
  const thickness = valueNum > 100 ? 3 : valueNum > 10 ? 2 : 1;
  
  // Create a curved line between points
  const points = useMemo(() => {
    const midPoint = new THREE.Vector3().addVectors(fromPos, toPos).multiplyScalar(0.5);
    
    // Add a slight curve to the line
    const direction = new THREE.Vector3().subVectors(toPos, fromPos);
    const perpendicular = new THREE.Vector3(direction.y, -direction.x, 0).normalize();
    midPoint.add(perpendicular.multiplyScalar(direction.length() * 0.2));
    
    const curve = new THREE.QuadraticBezierCurve3(
      fromPos,
      midPoint,
      toPos
    );
    
    return curve.getPoints(20);
  }, [fromPos, toPos]);
  
  // Animate the line
  useFrame(({ clock }) => {
    if (lineRef.current) {
      const material = lineRef.current.children[0].material as THREE.LineBasicMaterial;
      if (material) {
        if (isHighlighted) {
          // Pulse effect when highlighted
          const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.3 + 0.7;
          material.opacity = pulse;
        } else {
          material.opacity = 0.4;
        }
      }
    }
  });
  
  return (
    <group ref={lineRef}>
      <primitive object={new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({
          color: isHighlighted ? "#00ffff" : "#ffffff",
          transparent: true,
          opacity: isHighlighted ? 0.8 : 0.4,
          linewidth: thickness
        })
      )} />
    </group>
  );
};

export default GraphEdge;
