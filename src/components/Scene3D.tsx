import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Stars, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { signalAudio } from '../lib/audioSignal';

function SignalCore({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    let audioImpact = 0;

    if (signalAudio.analyser) {
      const dataArray = new Uint8Array(signalAudio.analyser.frequencyBinCount);
      signalAudio.analyser.getByteFrequencyData(dataArray);
      // Average amplitude for core reactivity
      audioImpact = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    }

    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.2 + scrollProgress * Math.PI;
      meshRef.current.rotation.y = t * 0.3 + scrollProgress * Math.PI * 2;
      meshRef.current.position.y = Math.sin(t) * 0.2;
      
      const scale = 1 + scrollProgress * 3 + audioImpact * 1.5;
      meshRef.current.scale.set(scale, scale, scale);
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.1;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.2;
      const ringScale = 1.5 + scrollProgress * 4 + audioImpact * 2.5;
      ringRef.current.scale.set(ringScale, ringScale, ringScale);
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1, 15]} />
          <MeshDistortMaterial 
            color="#d7ff00" 
            speed={2} 
            distort={0.4} 
            radius={1} 
            emissive="#d7ff00"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Float>

      <mesh ref={ringRef}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshStandardMaterial 
          color="#00f0ff" 
          emissive="#00f0ff"
          emissiveIntensity={2}
          transparent
          opacity={0.5}
        />
      </mesh>

      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.2, 0.01, 16, 100]} />
        <meshStandardMaterial 
          color="#7b2cff" 
          emissive="#7b2cff"
          emissiveIntensity={1}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

function Particles({ count = 2000 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 50;
      p[i * 3 + 1] = (Math.random() - 0.5) * 50;
      p[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0005;
      ref.current.rotation.x += 0.0002;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          args={[points, 3]} 
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

function FloatingObject({ position, color, speed, size }: { position: [number, number, number], color: string, speed: number, size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    let audioImpact = 0;

    if (signalAudio.analyser) {
      const dataArray = new Uint8Array(signalAudio.analyser.frequencyBinCount);
      signalAudio.analyser.getByteFrequencyData(dataArray);
      audioImpact = dataArray[10] / 255; // React to a specific frequency band
    }

    if (meshRef.current) {
      meshRef.current.rotation.x = t * speed * 0.5;
      meshRef.current.rotation.y = t * speed;
      meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.5;
      const s = 1 + audioImpact * 0.5;
      meshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <Float speed={speed * 2} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[size, 0]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.2} 
          transparent 
          opacity={0.4} 
          wireframe
        />
      </mesh>
    </Float>
  );
}

function CursorParticles({ mouse }: { mouse: React.MutableRefObject<{ x: number, y: number }> }) {
  const count = 100;
  const meshRef = useRef<THREE.Points>(null);
  const [positions, setPositions] = useState(() => new Float32Array(count * 3));
  const [velocities] = useState(() => new Float32Array(count * 3));
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    // Target position is the mouse in 3D space
    const targetX = mouse.current.x * 10;
    const targetY = mouse.current.y * 10;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update velocity towards target with some noise
      velocities[i3] += (targetX - pos[i3]) * 0.01 + (Math.random() - 0.5) * 0.05;
      velocities[i3 + 1] += (targetY - pos[i3 + 1]) * 0.01 + (Math.random() - 0.5) * 0.05;
      velocities[i3 + 2] += (0 - pos[i3 + 2]) * 0.01 + (Math.random() - 0.5) * 0.05;

      // Apply friction
      velocities[i3] *= 0.95;
      velocities[i3 + 1] *= 0.95;
      velocities[i3 + 2] *= 0.95;

      // Update positions
      pos[i3] += velocities[i3];
      pos[i3 + 1] += velocities[i3 + 1];
      pos[i3 + 2] += velocities[i3 + 2];
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          args={[positions, 3]} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.1} 
        color="#d7ff00" 
        transparent 
        opacity={0.6} 
        blending={THREE.AdditiveBlending} 
        sizeAttenuation 
      />
    </points>
  );
}

function DynamicLight({ progress }: { progress: number }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const colors = ["#00f0ff", "#d7ff00", "#7b2cff", "#ff22c8"];
  
  useFrame(() => {
    if (!lightRef.current) return;
    const colorIdx = Math.floor(progress * (colors.length - 1));
    const nextIdx = Math.min(colorIdx + 1, colors.length - 1);
    const lerpFactor = (progress * (colors.length - 1)) % 1;
    
    const color = new THREE.Color(colors[colorIdx]);
    const nextColor = new THREE.Color(colors[nextIdx]);
    color.lerp(nextColor, lerpFactor);
    
    lightRef.current.color.copy(color);
  });

  return <pointLight ref={lightRef} position={[0, 0, 5]} intensity={3} distance={20} />;
}

export default function Scene3D({ scrollProgress }: { scrollProgress: number }) {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
        <color attach="background" args={['#050607']} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#d7ff00" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#7b2cff" />
        
        <DynamicLight progress={scrollProgress} />

        <group rotation={[scrollProgress * 0.2, scrollProgress * 0.5, 0]}>
          <SignalCore scrollProgress={scrollProgress} />
        </group>

        <CursorParticles mouse={mouse} />

        {/* Floating Interactive Background Geometry */}
        <FloatingObject position={[-5, 3, -2]} color="#00f0ff" speed={0.4} size={0.5} />
        <FloatingObject position={[6, -2, -3]} color="#7b2cff" speed={0.3} size={0.7} />
        <FloatingObject position={[-3, -4, -1]} color="#d7ff00" speed={0.5} size={0.4} />
        <FloatingObject position={[4, 5, -4]} color="#ffffff" speed={0.2} size={0.6} />

        <Particles />
        <Stars radius={100} depth={50} count={7000} factor={6} saturation={0} fade speed={1.5} />
        
        <Environment preset="night" />
        
        {/* Subtle camera movement based on mouse */}
        <Rig mouse={mouse} />
      </Canvas>
    </div>
  );
}

function Rig({ mouse }: { mouse: React.MutableRefObject<{ x: number, y: number }> }) {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouse.current.x * 2, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouse.current.y * 2, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

