
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpiderEdgeProps {
  fromPos: THREE.Vector3;
  toPos: THREE.Vector3;
  value: string;
  isHighlighted: boolean;
}

const SpiderEdge = ({ 
  fromPos, 
  toPos, 
  value, 
  isHighlighted 
}: SpiderEdgeProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const line = groupRef.current.children[0] as THREE.Line;
      if (line && line.material) {
        const material = line.material as THREE.LineBasicMaterial;
        
        if (isHighlighted) {
          const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.3 + 0.7;
          material.opacity = pulse;
        } else {
          material.opacity = 0.4;
        }
        
        material.needsUpdate = true;
      }
    }
  });
  
  const valueNum = parseFloat(value || '0');
  const thickness = valueNum > 100 ? 3 : valueNum > 10 ? 2 : 1;
  
  const points = useMemo(() => {
    const middlePoint = new THREE.Vector3().addVectors(fromPos, toPos).multiplyScalar(0.5);
    const direction = new THREE.Vector3().subVectors(fromPos, toPos).cross(new THREE.Vector3(0, 1, 0)).normalize();
    middlePoint.add(direction.multiplyScalar(0.3));
    
    const curve = new THREE.QuadraticBezierCurve3(fromPos, middlePoint, toPos);
    return curve.getPoints(20);
  }, [fromPos, toPos]);
  
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
          opacity={isHighlighted ? 0.8 : 0.3}
          linewidth={thickness}
        />
      </line>
    </group>
  );
};

export default SpiderEdge;
