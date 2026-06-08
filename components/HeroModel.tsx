"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

function Model({ url }: { url: string }) {
  const outerRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);

  // Normalize the model so its largest dimension is a fixed world size,
  // regardless of the units the GLB was exported in.
  const { clone, normScale } = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    // Scale so longest side → 5 world-units, filling the canvas as a background
    const normScale = 5.0 / maxDim;
    return { clone, normScale };
  }, [scene]);

  // Gentle continuous spin — the model is pinned (sticky) in the layout
  useFrame((_, delta) => {
    if (outerRef.current) outerRef.current.rotation.y += delta * 0.25;
  });

  return (
    <group ref={outerRef}>
      <Center>
        <group scale={normScale}>
          <primitive object={clone} />
        </group>
      </Center>
    </group>
  );
}

function Placeholder() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
      ref.current.rotation.x += delta * 0.15;
    }
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.3, 1]} />
      <meshStandardMaterial color="#C9A96E" wireframe transparent opacity={0.35} />
    </mesh>
  );
}

export default function HeroModel({
  modelUrl,
  active = true,
}: {
  modelUrl?: string | null;
  active?: boolean;
}) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <Canvas
        // Render continuously only while in view; stop completely otherwise.
        frameloop={active ? "always" : "never"}
        // Cap pixel ratio so it never renders at retina 2x/3x (huge GPU saving).
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%", display: "block", background: "transparent" }}
      >
        {/* Explicit lighting — no CDN environment dependency */}
        <ambientLight intensity={1.1} />
        <hemisphereLight args={["#ffffff", "#d8c8a8", 0.8]} />
        <directionalLight position={[5, 8, 5]} intensity={2} color="#fff8f0" />
        <directionalLight position={[-5, 2, -3]} intensity={0.8} color="#C9A96E" />
        <directionalLight position={[0, -4, 4]} intensity={0.5} color="#ffffff" />
        <pointLight position={[0, 3, 4]} intensity={0.8} color="#E8D5B0" />

        <Suspense fallback={<Placeholder />}>
          {modelUrl ? <Model url={modelUrl} /> : <Placeholder />}
        </Suspense>
      </Canvas>
    </div>
  );
}
