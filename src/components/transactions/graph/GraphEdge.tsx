
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
  const groupRef = useRef<THREE.Group>(null);
  
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
    if (groupRef.current) {
      const line = groupRef.current.children[0] as THREE.Line;
      if (line && line.material) {
        const material = line.material as THREE.LineBasicMaterial;
        
        if (isHighlighted) {
          // Pulse effect when highlighted
          const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.3 + 0.7;
          material.opacity = pulse;
        } else {
          material.opacity = 0.4;
        }
        
        material.needsUpdate = true;
      }
    }
  });
  
  return (
    <group ref={groupRef}>
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            count={points.length}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          attach="material"
          color={isHighlighted ? "#00ffff" : "#ffffff"}
          transparent
          opacity={isHighlighted ? 0.8 : 0.4}
          linewidth={thickness}
        />
      </line>
    </group>
  );
};

export default GraphEdge;
