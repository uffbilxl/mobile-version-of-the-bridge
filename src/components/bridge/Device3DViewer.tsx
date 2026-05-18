import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Center, Bounds } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { X, MousePointer2 } from "lucide-react";
import type { Group } from "three";
import type { Device } from "@/lib/mockData";

const MODEL_URLS: Partial<Record<Device["category"], string>> = {
  Laptop: "/models/laptop.glb",
  Tablet: "/models/tablet.glb",
  Mobile: "/models/mobile.glb",
};

function GltfModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function Router3D() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.8, 0.5, 1.2]} />
        <meshStandardMaterial color="#2a2a3a" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[-0.6, 0.4, 0]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
        <meshStandardMaterial color="#1a1f35" />
      </mesh>
      <mesh position={[0.6, 0.4, 0]} rotation={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
        <meshStandardMaterial color="#1a1f35" />
      </mesh>
      <mesh position={[-0.6, -0.2, 0.61]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#00E5A0" emissive="#00E5A0" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

function SpinningModel({ category }: { category: Device["category"] }) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.4;
  });
  const url = MODEL_URLS[category];
  return (
    <group ref={ref}>
      {url ? (
        <Bounds fit clip observe margin={1.2}>
          <Center>
            <GltfModel url={url} />
          </Center>
        </Bounds>
      ) : (
        <Router3D />
      )}
    </group>
  );
}

// Preload models for snappier opens
Object.values(MODEL_URLS).forEach((u) => u && useGLTF.preload(u));

const BADGE_STYLES: Record<string, string> = {
  "Free to keep": "bg-mint text-mint-foreground",
  "3-month loan": "bg-amber text-background",
  "Collect today": "bg-blue text-white",
  "Notify me": "bg-surface-2 text-muted-foreground",
};

export default function Device3DViewer({
  device,
  onClose,
  onRequest,
}: {
  device: Device;
  onClose: () => void;
  onRequest: () => void;
}) {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("bridge-3d-hint-seen");
    if (!seen) {
      setShowHint(true);
      localStorage.setItem("bridge-3d-hint-seen", "1");
      const t = setTimeout(() => setShowHint(false), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ type: "spring", damping: 24, stiffness: 240 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-card-border bg-[#030712] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative h-[320px] w-full bg-[#030712] sm:h-[420px]">
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-12 w-12 animate-ping rounded-full border-2 border-[#7B5EA7]" />
                </div>
              }
            >
              <Canvas camera={{ position: [0, 1.2, 4], fov: 45 }}>
                <ambientLight intensity={0.4} />
                <pointLight position={[5, 5, 5]} intensity={1.2} color="#7B5EA7" />
                <pointLight position={[-5, -3, -5]} intensity={0.8} color="#4A90D9" />
                <SpinningModel category={device.category} />
                <Environment preset="city" />
                <OrbitControls
                  enableZoom
                  enablePan={false}
                  autoRotate={false}
                  minDistance={2}
                  maxDistance={8}
                />
              </Canvas>
            </Suspense>

            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-xs text-white/80 backdrop-blur"
                >
                  <MousePointer2 className="mr-1 inline h-3 w-3" />
                  Drag to rotate · Scroll to zoom
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-bold">{device.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{device.specs}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${BADGE_STYLES[device.availability_type]}`}
              >
                {device.availability_type}
              </span>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => {
                  onClose();
                  onRequest();
                }}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-grad-primary text-sm font-semibold text-white"
              >
                Request this device
              </button>
              <button
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center rounded-md border border-card-border px-5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Close preview
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}