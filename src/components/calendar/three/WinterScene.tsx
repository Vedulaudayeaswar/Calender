import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

export function WinterScene() {
  const pointsRef = useRef<THREE.Points>(null);
  const frontSnowRef = useRef<THREE.Points>(null);
  const snowCount = 12000;
  const frontSnowCount = 8000;

  const positions = useMemo(() => {
    const pos = new Float32Array(snowCount * 3);
    for (let i = 0; i < snowCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 20 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const frontPositions = useMemo(() => {
    const pos = new Float32Array(frontSnowCount * 3);
    for (let i = 0; i < frontSnowCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 16 - 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < snowCount; i++) {
        positions[i * 3 + 1] -= 0.35; // Fast falling like rain
        positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.08; // More wind drift
        if (positions[i * 3 + 1] < -5) {
          positions[i * 3 + 1] = 15;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (frontSnowRef.current) {
      const positions = frontSnowRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < frontSnowCount; i++) {
        positions[i * 3 + 1] -= 0.4; // Falls like rain drops
        positions[i * 3] += Math.sin(state.clock.elapsedTime * 1.2 + i) * 0.12; // More dramatic drift
        if (positions[i * 3 + 1] < -4) {
          positions[i * 3 + 1] = 12;
        }
      }
      frontSnowRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 10, 5]} intensity={2.5} color="#00ffff" />
      <pointLight position={[-5, 5, -5]} intensity={1.5} color="#ffffff" />
      <fog attach="fog" args={["#001122", 1, 50]} />

      {/* Snow Particles */}
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={snowCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          color="#ffffff"
          size={1.2}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.95}
        />
      </Points>

      <Points ref={frontSnowRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={frontSnowCount}
            array={frontPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          color="#ffffff"
          size={1.5}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={1}
        />
      </Points>
    </group>
  );
}
