
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FlowLine } from './types';

interface AnimatedFlowProps {
  flow: FlowLine;
  radius: number;
}

const AnimatedFlow = ({ flow, radius }: AnimatedFlowProps) => {
  const lineRef = useRef<THREE.Object3D>(null);
  
  const { from, to } = flow;
  
  const fromPhi = (90 - from.lat) * (Math.PI / 180);
  const fromTheta = (from.lon + 180) * (Math.PI / 180);
  
  const fromX = -(radius * Math.sin(fromPhi) * Math.cos(fromTheta));
  const fromZ = radius * Math.sin(fromPhi) * Math.sin(fromTheta);
  const fromY = radius * Math.cos(fromPhi);
  
  const toPhi = (90 - to.lat) * (Math.PI / 180);
  const toTheta = (to.lon + 180) * (Math.PI / 180);
  
  const toX = -(radius * Math.sin(toPhi) * Math.cos(toTheta));
  const toZ = radius * Math.sin(toPhi) * Math.sin(toTheta);
  const toY = radius * Math.cos(toPhi);
  
  const curve = useMemo(() => {
    const fromVec = new THREE.Vector3(fromX, fromY, fromZ);
    const toVec = new THREE.Vector3(toX, toY, toZ);
    
    const midPoint = new THREE.Vector3().addVectors(fromVec, toVec).multiplyScalar(0.5);
    const midElevation = radius * 0.2 * flow.value;
    midPoint.normalize().multiplyScalar(radius + midElevation);
    
    return new THREE.QuadraticBezierCurve3(fromVec, midPoint, toVec);
  }, [fromX, fromY, fromZ, toX, toY, toZ, radius, flow.value]);
  
  const points = useMemo(() => curve.getPoints(50), [curve]);
  
  useFrame(({ clock }) => {
    if (lineRef.current) {
      const material = lineRef.current.children[0].material as THREE.LineDashedMaterial;
      if (material) {
        const time = clock.getElapsedTime();
        material.opacity = (Math.sin(time * 2) * 0.2 + 0.8) * 0.7;
        material.dashSize = 0.3;
        material.gapSize = 0.1;
        material.needsUpdate = true;
      }
    }
  });
  
  return (
    <group ref={lineRef}>
      <primitive object={new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineDashedMaterial({
          color: flow.color || "#00ffff",
          dashSize: 0.3,
          gapSize: 0.1,
          opacity: 0.7,
          transparent: true
        })
      )} />
    </group>
  );
};

export default AnimatedFlow;
