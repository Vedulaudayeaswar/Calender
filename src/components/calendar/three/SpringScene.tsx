import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function SakuraTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.2, 0.4, 4, 8]} />
        <meshStandardMaterial color="#4d2926" />
      </mesh>
      {/* Leaves/Flowers */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 4.5, 0]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshStandardMaterial color="#ffb6c1" transparent opacity={0.9} />
        </mesh>
      </Float>
    </group>
  );
}

export function SpringScene() {
  const pointsRef = useRef<THREE.Points>(null);
  const petalCount = 1200;

  const positions = useMemo(() => {
    const pos = new Float32Array(petalCount * 3);
    for (let i = 0; i < petalCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = Math.random() * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < petalCount; i++) {
        positions[i * 3 + 1] -= 0.02;
        positions[i * 3] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.01;
        if (positions[i * 3 + 1] < -5) {
          positions[i * 3 + 1] = 15;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 15, 5]} intensity={2} color="#ff69b4" />
      <fog attach="fog" args={['#220022', 5, 30]} />

      {/* Petal Particles */}
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={petalCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          color="#ffc0cb"
          size={0.12}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.9}
        />
      </Points>

      {/* Sakura Trees */}
      <SakuraTree position={[-6, -2, -8]} />
      <SakuraTree position={[6, -2, -10]} />
      <SakuraTree position={[0, -2, -15]} />

      {/* Grass Plane */}
      <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a331a" roughness={0.9} />
      </mesh>
    </group>
  );
}
