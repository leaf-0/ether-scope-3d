
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface StarFieldProps {
  count?: number;
  depth?: number;
  size?: number;
  color?: string;
  className?: string;
}

const StarField: React.FC<StarFieldProps> = ({
  count = 1000,
  depth = 500,
  size = 0.5,
  color = '#FFFFFF',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ 
      canvas,
      antialias: true,
      alpha: true,
    });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 10;
    
    // Create stars
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(count * 3);
    const starSizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      starPositions[i3] = (Math.random() - 0.5) * depth;
      starPositions[i3 + 1] = (Math.random() - 0.5) * depth;
      starPositions[i3 + 2] = (Math.random() - 0.5) * depth;
      
      starSizes[i] = Math.random() * size;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    
    // Create shader material for stars
    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(color) },
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        varying float vAlpha;
        
        void main() {
          vAlpha = 0.5 + 0.5 * sin(time + position.x * 0.05);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;
        
        void main() {
          if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.5) discard;
          gl_FragColor = vec4(color, vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // Animation loop
    let frameId: number;
    const clock = new THREE.Clock();
    
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      const time = clock.getElapsedTime();
      (starMaterial.uniforms.time as { value: number }).value = time;
      
      // Make the stars gently rotate
      stars.rotation.x = time * 0.03;
      stars.rotation.y = time * 0.02;
      
      renderer.render(scene, camera);
    };
    
    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      
      // Clean up resources
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, [count, depth, size, color]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full -z-10 ${className}`} 
    />
  );
};

export default StarField;
