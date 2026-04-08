import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function Ripple({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      const s = 1 + (state.clock.elapsedTime % 2) * 2;
      meshRef.current.scale.set(s, s, s);
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity = Math.max(0, 1 - (state.clock.elapsedTime % 2) / 2);
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.1, 0.12, 32]} />
      <meshStandardMaterial color="#add8e6" transparent opacity={0.5} />
    </mesh>
  );
}

function Leaf({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <mesh position={position}>
        <boxGeometry args={[0.2, 0.01, 0.3]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
    </Float>
  );
}

function RainDrop({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y -= 0.5;
      if (meshRef.current.position.y < -5) {
        meshRef.current.position.y = 10;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <capsuleGeometry args={[0.02, 0.1, 4, 8]} />
      <meshStandardMaterial color="#add8e6" transparent opacity={0.8} />
    </mesh>
  );
}

export function RainyScene() {
  const pointsRef = useRef<THREE.Points>(null);
  const rainCount = 1500;
  const dropCount = 50;

  const positions = useMemo(() => {
    const pos = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const drops = useMemo(() => {
    return Array.from({ length: dropCount }, () => [
      (Math.random() - 0.5) * 15,
      Math.random() * 15,
      (Math.random() - 0.5) * 15,
    ] as [number, number, number]);
  }, []);

  const ripples = useMemo(() => {
    return Array.from({ length: 10 }, () => [
      (Math.random() - 0.5) * 15,
      -1.95,
      (Math.random() - 0.5) * 15,
    ] as [number, number, number]);
  }, []);

  const leaves = useMemo(() => {
    return Array.from({ length: 15 }, () => [
      (Math.random() - 0.5) * 15,
      Math.random() * 5,
      (Math.random() - 0.5) * 15,
    ] as [number, number, number]);
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= 0.4; // Faster rain
        if (positions[i * 3 + 1] < -5) {
          positions[i * 3 + 1] = 15;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 10, 5]} intensity={0.5} color="#4682b4" />
      <fog attach="fog" args={['#0a192f', 2, 25]} />

      {/* Rain Particles */}
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={rainCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          color="#add8e6"
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>

      {/* Large Rain Drops (3D) */}
      {drops.map((pos, i) => (
        <RainDrop key={i} position={pos} />
      ))}

      {/* Ripples on "water" surface */}
      {ripples.map((pos, i) => (
        <Ripple key={i} position={pos} />
      ))}

      {/* Floating Leaves */}
      {leaves.map((pos, i) => (
        <Leaf key={i} position={pos} />
      ))}

      {/* Background (Dark Wet Surface) */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#020617" roughness={0.05} metalness={0.8} />
      </mesh>
    </group>
  );
}
