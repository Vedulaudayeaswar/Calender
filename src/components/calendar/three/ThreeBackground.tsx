import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Plane, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { SummerScene } from "./SummerScene";
import { WinterScene } from "./WinterScene";
import { RainyScene } from "./RainyScene";
import { SpringScene } from "./SpringScene";
import { VortexShader } from "./VortexShader";
import { SEASONAL_MONTH_IMAGES } from "@/lib/calendar-utils";

function AnimatedImage({ url }: { url: string }) {
  const texture = useTexture(url);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.scale.setScalar(1 + Math.sin(t * 0.2) * 0.05);
      meshRef.current.position.x = Math.cos(t * 0.1) * 0.2;
      meshRef.current.position.y = Math.sin(t * 0.15) * 0.2;
    }
  });

  return (
    <Plane ref={meshRef} args={[30, 18]} position={[0, 0, -5]}>
      <meshBasicMaterial map={texture} transparent opacity={0.42} />
    </Plane>
  );
}

interface ThreeBackgroundProps {
  month: number;
  transitionProgress?: number;
}

export function ThreeBackground({
  month,
  transitionProgress = 0,
}: ThreeBackgroundProps) {
  const imageUrl = SEASONAL_MONTH_IMAGES[month];

  const seasonalScene = useMemo(() => {
    if (month >= 2 && month <= 5) return <SummerScene />;
    if (month >= 10 || month <= 1) return <WinterScene />;
    if (month >= 6 && month <= 8) return <RainyScene />;
    return <SpringScene />;
  }, [month]);

  if (!imageUrl) return null;

  return (
    <div className="absolute inset-0 z-0 bg-slate-950">
      <Canvas>
        <color attach="background" args={["#020617"]} />
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <ambientLight intensity={0.5} />
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color="#020617" />
            </mesh>
          }
        >
          <AnimatedImage url={imageUrl} />
          {seasonalScene}
          {transitionProgress > 0 && (
            <VortexShader intensity={transitionProgress} />
          )}
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]" />
    </div>
  );
}
