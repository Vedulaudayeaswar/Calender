import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function SummerScene() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffaa00" />
      <fog attach="fog" args={['#ff8c00', 5, 25]} />
      
      {/* Animated Sun */}
      <Sphere args={[2, 32, 32]} position={[10, 8, -10]}>
        <meshBasicMaterial color="#ffff00" />
      </Sphere>

      {/* Ocean with Distort Material for better waves */}
      <Plane
        ref={meshRef}
        args={[30, 30, 64, 64]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2, 0]}
      >
        <MeshDistortMaterial
          color="#0044ff"
          speed={2}
          distort={0.4}
          radius={1}
          metalness={0.5}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </Plane>

      {/* Sky Gradient */}
      <mesh scale={[30, 30, 30]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ff7700" side={THREE.BackSide} />
      </mesh>
    </group>
  );
}
