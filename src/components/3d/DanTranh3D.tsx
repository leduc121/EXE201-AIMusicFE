import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DanTranh3DProps {
  activeStrings: number[]; // Index of strings being played (0-15)
  vietnameseScale?: 'bac' | 'nam' | 'oi' | 'xuong' | 'ngu' | 'ly' | 'tuong';
}

// Đàn Tranh tuning for 16 strings in pentatonic scales
const DAN_TRANH_TUNING: Record<string, number[]> = {
  bac: [55, 57, 59, 62, 64, 67, 69, 71, 74, 76, 79, 81, 83, 86, 88, 91], // G3 - G6
};

export function DanTranh3D({ activeStrings = [], vietnameseScale = 'bac' }: DanTranh3DProps) {
  const tuning = DAN_TRANH_TUNING[vietnameseScale] || DAN_TRANH_TUNING.bac;
  
  return (
    <group>
      {/* Main Body - Curved wooden board */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[12, 0.3, 3]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.6} 
          metalness={0.1}
        />
      </mesh>

      {/* Decorative ends */}
      <mesh position={[-6.2, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 3.2, 32]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[6.2, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 3.2, 32]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* 16 Strings */}
      {tuning.map((midi, index) => (
        <String3D
          key={index}
          index={index}
          midi={midi}
          isActive={activeStrings.includes(index)}
          position={[(index - 7.5) * 0.7, 0.2, 0]}
        />
      ))}

      {/* String supports (bridges) */}
      <mesh position={[-4, 0.25, 0]}>
        <boxGeometry args={[0.2, 0.2, 2.8]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      <mesh position={[4, 0.25, 0]}>
        <boxGeometry args={[0.2, 0.2, 2.8]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>

      {/* Decorative patterns on body */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[(-4 + i * 2), 0.16, 0]}>
          <boxGeometry args={[0.1, 0.02, 2]} />
          <meshStandardMaterial color="#D4A574" />
        </mesh>
      ))}
    </group>
  );
}

function String3D({
  index,
  midi,
  isActive,
  position,
}: {
  index: number;
  midi: number;
  isActive: boolean;
  position: [number, number, number];
}) {
  const stringRef = useRef<THREE.Mesh>(null);
  const prevActive = React.useRef(false);
  const [vibrationIntensity, setVibrationIntensity] = React.useState(0);

  // Create vibration effect when string is activated
  useFrame((state, delta) => {
    if (stringRef.current) {
      // Vibration effect
      if (vibrationIntensity > 0) {
        const vibration = Math.sin(state.clock.elapsedTime * 50) * vibrationIntensity * 0.02;
        stringRef.current.position.z = position[2] + vibration;
        setVibrationIntensity(prev => Math.max(0, prev - delta * 2));
      } else {
        stringRef.current.position.z = position[2];
      }

      // Glow effect
      if (stringRef.current.material instanceof THREE.MeshStandardMaterial) {
        const targetEmissive = isActive ? 0.5 : 0;
        stringRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
          stringRef.current.material.emissiveIntensity,
          targetEmissive,
          delta * 10
        );
      }
    }
  });

  // Detect activation
  React.useEffect(() => {
    if (isActive && !prevActive.current) {
      setVibrationIntensity(1);
    }
    prevActive.current = isActive;
  }, [isActive]);

  // String thickness varies (thicker for lower notes)
  const thickness = 0.008 + (15 - index) * 0.001;

  return (
    <group position={position}>
      {/* Main string */}
      <mesh ref={stringRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[thickness, thickness, 2.8, 8]} />
        <meshStandardMaterial
          color={isActive ? '#FFD700' : '#C0C0C0'}
          emissive={isActive ? '#FFD700' : '#000000'}
          emissiveIntensity={isActive ? 0.5 : 0}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* String number indicator */}
      <mesh position={[0, -0.3, 0.3]}>
        <circleGeometry args={[0.15, 32]} />
        <meshBasicMaterial color="#3E2723" />
      </mesh>
      
      {/* Note name label */}
      <StringLabel note={midiToNoteName(midi)} isActive={isActive} />
    </group>
  );
}

function StringLabel({ note, isActive }: { note: string; isActive: boolean }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = isActive ? '#FFD700' : '#3E2723';
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fill();

    // Text
    ctx.fillStyle = isActive ? '#000000' : '#FFFFFF';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(note, 32, 32);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [note, isActive]);

  return (
    <sprite position={[0, -0.3, 0.35]} scale={[0.4, 0.2, 1]}>
      <spriteMaterial map={texture} transparent opacity={0.9} />
    </sprite>
  );
}

function midiToNoteName(midi: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  const noteName = noteNames[midi % 12];
  return `${noteName}${octave}`;
}
