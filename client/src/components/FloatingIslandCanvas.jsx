import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';

function HexTile({ radius, height, x, z, color }) {
  return (
    <group position={[x, 0, z]}>
      {/* Top Grass Cylinder */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius, radius, height, 6]} />
        <meshLambertMaterial attach="material-0" color="#fcfaf8" /> {/* Sides */}
        <meshLambertMaterial attach="material-1" color={color} />    {/* Top Cap */}
        <meshLambertMaterial attach="material-2" color="#fcfaf8" /> {/* Bottom Cap */}
      </mesh>
      
      {/* Bottom Rocky Cone */}
      <mesh position={[0, -(radius * 1.4) / 2, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[radius, radius * 1.4, 6]} />
        <meshLambertMaterial color="#eae6e1" />
      </mesh>
    </group>
  );
}

function LayeredTree({ tileX, tileZ, tileH, color, scale = 1 }) {
  return (
    <group position={[tileX, tileH, tileZ]} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 1.1, 5]} />
        <meshLambertMaterial color="#a2785c" />
      </mesh>
      {/* Tier 1 */}
      <mesh position={[0, 0.8, 0]}>
        <coneGeometry args={[0.55, 0.5, 6]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Tier 2 */}
      <mesh position={[0, 1.1, 0]}>
        <coneGeometry args={[0.45, 0.42, 6]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Tier 3 */}
      <mesh position={[0, 1.38, 0]}>
        <coneGeometry args={[0.32, 0.35, 6]} />
        <meshLambertMaterial color={color} />
      </mesh>
    </group>
  );
}

function CloudTree({ tileX, tileZ, tileH, color, scale = 1 }) {
  return (
    <group position={[tileX, tileH, tileZ]} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.8, 5]} />
        <meshLambertMaterial color="#a2785c" />
      </mesh>
      {/* Center Leaves */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Sub Leaves 1 */}
      <mesh position={[0.18, 0.75, -0.15]}>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Sub Leaves 2 */}
      <mesh position={[-0.2, 0.7, 0.15]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Sub Leaves 3 */}
      <mesh position={[0.05, 1.05, 0.05]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshLambertMaterial color={color} />
      </mesh>
    </group>
  );
}

function Bench({ x, y, z, rotationY }) {
  return (
    <group position={[x, y, z]} rotation={[0, rotationY, 0]}>
      {/* Seat */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.6, 0.05, 0.2]} />
        <meshLambertMaterial color="#cca070" />
      </mesh>
      {/* Leg 1 */}
      <mesh position={[-0.25, -0.075, 0.08]}>
        <boxGeometry args={[0.04, 0.15, 0.04]} />
        <meshLambertMaterial color="#a2785c" />
      </mesh>
      {/* Leg 2 */}
      <mesh position={[0.25, -0.075, 0.08]}>
        <boxGeometry args={[0.04, 0.15, 0.04]} />
        <meshLambertMaterial color="#a2785c" />
      </mesh>
      {/* Leg 3 */}
      <mesh position={[-0.25, -0.075, -0.08]}>
        <boxGeometry args={[0.04, 0.15, 0.04]} />
        <meshLambertMaterial color="#a2785c" />
      </mesh>
      {/* Leg 4 */}
      <mesh position={[0.25, -0.075, -0.08]}>
        <boxGeometry args={[0.04, 0.15, 0.04]} />
        <meshLambertMaterial color="#a2785c" />
      </mesh>
    </group>
  );
}

function OrbitingParticle({ angle: initialAngle, radius, baseY, speed, yAmplitude, yPhase }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const elapsedTime = state.clock.getElapsedTime();
    const currentAngle = initialAngle + elapsedTime * (speed * 150);
    const x = Math.cos(currentAngle) * radius;
    const z = Math.sin(currentAngle) * radius;
    const y = baseY + Math.sin(elapsedTime * 1.8 + yPhase) * yAmplitude;
    meshRef.current.position.set(x, y, z);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color="#eb6b56" />
    </mesh>
  );
}

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(0, 0.5, 0);
  }, [camera]);
  return null;
}

function Island({ scale }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const elapsedTime = state.clock.getElapsedTime();

    // Floating motion
    groupRef.current.position.y = Math.sin(elapsedTime * 1.2) * 0.35;
    groupRef.current.rotation.y = elapsedTime * 0.25;

    // Mouse tilt interaction (state.pointer coordinates are normalized between -1 and 1)
    const targetX = state.pointer.x * 0.15;
    const targetY = state.pointer.y * 0.1;
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetY, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -targetX, 0.05);
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* Hexagonal grass tiles & rocky bases */}
      <HexTile radius={1.6} height={0.8} x={0} z={0} color="#98d0a8" />
      <HexTile radius={1.1} height={0.6} x={-1.8} z={0.5} color="#b5dec2" />
      <HexTile radius={1.3} height={0.9} x={1.7} z={-0.6} color="#cfe9d8" />
      <HexTile radius={1.2} height={0.7} x={0.8} z={1.8} color="#98d0a8" />
      <HexTile radius={1.0} height={0.5} x={-0.8} z={-1.7} color="#b5dec2" />

      {/* Pine Trees */}
      <LayeredTree tileX={0} tileZ={-0.2} tileH={0.8} color="#76b882" scale={1.35} />
      <LayeredTree tileX={0.8} tileZ={1.8} tileH={0.7} color="#76b882" scale={0.8} />

      {/* Cloud Trees */}
      <CloudTree tileX={-1.8} tileZ={0.5} tileH={0.6} color="#e08a68" scale={0.9} />
      <CloudTree tileX={1.7} tileZ={-0.6} tileH={0.9} color="#eb6b56" scale={1.15} />
      <CloudTree tileX={-0.8} tileZ={-1.6} tileH={0.5} color="#e08a68" scale={0.75} />

      {/* Wooden Bench */}
      <Bench x={0.3} y={0.85} z={0.4} rotationY={-Math.PI / 6} />
    </group>
  );
}

export default function FloatingIslandCanvas() {
  const [webglSupported, setWebglSupported] = useState(true);
  const [viewMode, setViewMode] = useState('3d');
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch (e) {
        return false;
      }
    };
    if (!checkWebGL()) {
      setWebglSupported(false);
      setViewMode('2d');
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setScale(0.65);
      } else if (w < 1024) {
        setScale(0.85);
      } else {
        setScale(1.1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const particlesData = useMemo(() => {
    const data = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 3.2 + Math.random() * 0.8;
      const heightOffset = (Math.random() - 0.5) * 1.5;
      data.push({
        angle,
        radius,
        baseY: heightOffset,
        speed: 0.005 + Math.random() * 0.004,
        yAmplitude: 0.2 + Math.random() * 0.3,
        yPhase: Math.random() * Math.PI
      });
    }
    return data;
  }, []);

  // Framer Motion Animated SVG Fallback
  if (viewMode === '2d') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 relative select-none">
        {/* Soft background glow */}
        <div className="absolute w-72 h-72 rounded-full bg-[#E4F2EE] opacity-50 blur-3xl -z-10" />

        {/* Floating container utilizing Framer Motion for 100% reliable HTML-layer animation */}
        <motion.div 
          animate={{
            y: [0, -18, 0],
            rotate: [0, 1.2, 0]
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-full max-w-[400px] flex items-center justify-center relative"
        >
          <svg 
            viewBox="0 0 500 500" 
            className="w-full h-auto drop-shadow-2xl cursor-pointer relative"
          >
            {/* Underside off-white base */}
            <polygon points="120,290 250,420 380,290 250,300" fill="#eae6e1" />
            <polygon points="180,295 250,420 280,300" fill="#dedad5" />

            {/* Hexagonal tiles grass top */}
            <polygon points="120,280 200,240 280,245 230,290" fill="#fcfaf8" />
            <polygon points="120,280 200,240 280,245 230,290" fill="#b5dec2" opacity="0.9" />
            
            <polygon points="220,240 300,230 380,270 300,285" fill="#fcfaf8" />
            <polygon points="220,240 300,230 380,270 300,285" fill="#cfe9d8" opacity="0.95" />

            <polygon points="140,300 250,240 360,300 250,330" fill="#fcfaf8" />
            <polygon points="140,290 250,230 360,290 250,320" fill="#98d0a8" />

            {/* Detailed Tapered / Tiered Pine Trees */}
            <rect x="247" y="170" width="6" height="75" fill="#a2785c" />
            <polygon points="220,195 250,150 280,195" fill="#76b882" />
            <polygon points="225,165 250,120 275,165" fill="#76b882" />
            <polygon points="232,135 250,95 268,135" fill="#76b882" />

            {/* Coral Cloud Tree */}
            <rect x="317" y="210" width="6" height="60" fill="#a2785c" />
            <circle cx="320" cy="190" r="24" fill="#eb6b56" />
            <circle cx="334" cy="195" r="16" fill="#eb6b56" />
            <circle cx="310" cy="185" r="15" fill="#eb6b56" />

            {/* Orange Cloud Tree */}
            <rect x="177" y="200" width="6" height="65" fill="#a2785c" />
            <circle cx="180" cy="180" r="22" fill="#e08a68" />
            <circle cx="166" cy="185" r="14" fill="#e08a68" />
            <circle cx="192" cy="178" r="14" fill="#e08a68" />

            {/* Bench */}
            <polygon points="225,295 275,280 275,285 225,300" fill="#cca070" />
            <line x1="228" y1="298" x2="228" y2="308" stroke="#a2785c" strokeWidth="3" />
            <line x1="272" y1="285" x2="272" y2="295" stroke="#a2785c" strokeWidth="3" />

            {/* Orbiting particles animated with Framer Motion paths */}
            <motion.circle 
              cx={100} cy={220} r={6} fill="#eb6b56" 
              animate={{ cx: [100, 240, 380, 240, 100], cy: [220, 180, 220, 260, 220] }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle 
              cx={400} cy={310} r={8} fill="#eb6b56" 
              animate={{ cx: [400, 260, 120, 260, 400], cy: [310, 360, 310, 260, 310] }}
              transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </motion.div>

        {/* Small Toggle Back Option */}
        {webglSupported && (
          <button 
            onClick={() => setViewMode('3d')}
            className="absolute bottom-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#E2E8F0] shadow-sm text-[10px] font-bold text-slate-500 hover:text-[#4A9B68] transition-colors cursor-pointer"
          >
            Switch to 3D Mode
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[350px] lg:min-h-[480px] relative select-none">
      <Canvas
        camera={{ position: [0, 4.5, 12], fov: 35 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <CameraSetup />
        
        {/* Soft, warm lights */}
        <ambientLight intensity={1.4} />
        <directionalLight position={[6, 12, 8]} intensity={1.8} />
        <pointLight position={[-6, 2, -6]} intensity={0.9} />

        <Island scale={scale} />

        {/* Orbiting particles */}
        {particlesData.map((p, idx) => (
          <OrbitingParticle key={idx} {...p} />
        ))}
      </Canvas>
      
      {/* Toggle View Mode Button for testing/performance */}
      <button 
        onClick={() => setViewMode('2d')}
        className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white/90 border border-slate-100 shadow-sm text-[10px] font-bold text-slate-500 hover:text-[#4A9B68] transition-colors cursor-pointer z-20"
      >
        Toggle 2D Fallback
      </button>
    </div>
  );
}
