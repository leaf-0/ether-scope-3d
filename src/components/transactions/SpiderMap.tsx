
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import SpiderScene from './spider/SpiderScene';

interface SpiderMapProps {
  className?: string;
}

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
      <Canvas camera={{ position: [0, 4, 10], fov: 50 }}>
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
