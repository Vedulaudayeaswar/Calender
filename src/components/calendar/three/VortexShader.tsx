import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform float intensity;
  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5, 0.5);
    vec2 pos = vUv - center;
    float dist = length(pos);
    float angle = atan(pos.y, pos.x);
    
    // Spiral effect
    float spiral = sin(dist * 40.0 - time * 10.0 + angle * 5.0);
    float alpha = smoothstep(0.6, 0.0, dist) * intensity;
    
    // Core of the black hole
    float core = smoothstep(0.15, 0.0, dist);
    
    vec3 spiralColor = mix(vec3(0.0), vec3(0.2, 0.0, 0.5), spiral * 0.5 + 0.5);
    vec3 finalColor = mix(spiralColor, vec3(0.0), core);
    
    // Glowing edge
    float glow = exp(-dist * 5.0) * intensity;
    finalColor += vec3(0.1, 0.05, 0.2) * glow;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export function VortexShader({ intensity = 1.0 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    intensity: { value: intensity }
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.time.value = state.clock.getElapsedTime();
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.intensity.value = intensity;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 5]} scale={[10, 10, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
