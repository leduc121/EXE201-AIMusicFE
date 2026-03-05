import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DanBau3DProps {
  pitch: number; // MIDI note 48-84
  isPlaying: boolean;
  pitchBend?: number; // -1 to 1, for pitch bending effect
}

export function DanBau3D({ pitch = 60, isPlaying = false, pitchBend = 0 }: DanBau3DProps) {
  const gourdRef = useRef<THREE.Mesh>(null);
  const stringRef = useRef<THREE.Mesh>(null);
  const handRef = useRef<THREE.Group>(null);
  const prevPlaying = React.useRef(false);
  const [stringVibration, setStringVibration] = React.useState(0);

  // Calculate hand position based on pitch
  const handPosition = useMemo(() => {
    const minPitch = 48;
    const maxPitch = 84;
    const normalized = (pitch - minPitch) / (maxPitch - minPitch);
    // Hand moves along the string from right to left
    return -3 + normalized * 5;
  }, [pitch]);

  // Animation
  useFrame((state, delta) => {
    // String vibration
    if (stringRef.current) {
      if (stringVibration > 0) {
        const vibration = Math.sin(state.clock.elapsedTime * 60) * stringVibration * 0.05;
        stringRef.current.position.y = 1.5 + vibration;
        setStringVibration(prev => Math.max(0, prev - delta * 1.5));
      } else {
        stringRef.current.position.y = 1.5;
      }
    }

    // Hand movement with pitch bend
    if (handRef.current) {
      const bendOffset = pitchBend * 0.5;
      const targetX = handPosition + bendOffset;
      handRef.current.position.x = THREE.MathUtils.lerp(
        handRef.current.position.x,
        targetX,
        delta * 8
      );

      // Hand presses down when playing
      const targetY = isPlaying ? 1.45 : 1.6;
      handRef.current.position.y = THREE.MathUtils.lerp(
        handRef.current.position.y,
        targetY,
        delta * 10
      );
    }

    // Gourd glow effect
    if (gourdRef.current && gourdRef.current.material instanceof THREE.MeshStandardMaterial) {
      const targetEmissive = isPlaying ? 0.3 : 0;
      gourdRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        gourdRef.current.material.emissiveIntensity,
        targetEmissive,
        delta * 5
      );
    }
  });

  // Trigger vibration when playing starts
  React.useEffect(() => {
    if (isPlaying && !prevPlaying.current) {
      setStringVibration(1);
    }
    prevPlaying.current = isPlaying;
  }, [isPlaying]);

  return (
    <group>
      {/* Resonator Gourd (Bầu) */}
      <mesh ref={gourdRef} position={[-4, 0.8, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#D2691E"
          emissive="#FF6B00"
          emissiveIntensity={0}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Gourd opening */}
      <mesh position={[-4, 0.8, 0.9]}>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial color="#3E2723" />
      </mesh>

      {/* Wooden neck (Thanh đàn) */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[10, 0.15, 0.3]} />
        <meshStandardMaterial color="#8B4513" roughness={0.6} />
      </mesh>

      {/* String (Dây đàn) */}
      <mesh ref={stringRef} position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 10, 8]} />
        <meshStandardMaterial
          color={isPlaying ? '#FFD700' : '#C0C0C0'}
          emissive={isPlaying ? '#FFD700' : '#000000'}
          emissiveIntensity={isPlaying ? 0.3 : 0}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Hand/Finger pressing the string */}
      <group ref={handRef} position={[handPosition, 1.6, 0]}>
        {/* Finger */}
        <mesh position={[0, 0, 0.1]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#F5DEB3" />
        </mesh>
        {/* Finger indicator ring */}
        <mesh position={[0, 0, 0.05]}>
          <torusGeometry args={[0.18, 0.03, 8, 32]} />
          <meshBasicMaterial color={isPlaying ? '#00FF00' : '#FFD700'} />
        </mesh>
      </group>

      {/* Tuning peg (Khóa đàn) */}
      <mesh position={[4.8, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 16]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* String holder at bottom */}
      <mesh position={[-4.5, 1.5, 0]}>
        <boxGeometry args={[0.3, 0.4, 0.2]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Decorative inlay on neck */}
      {[...Array(7)].map((_, i) => (
        <mesh key={i} position={[-3 + i, 1.58, 0]}>
          <boxGeometry args={[0.08, 0.02, 0.32]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} />
        </mesh>
      ))}

      {/* Pitch indicator */}
      <PitchIndicator pitch={pitch} />
      
      {/* Sound waves when playing */}
      {isPlaying && <SoundWaves position={[handPosition, 1.5, 0]} />}
    </group>
  );
}

function PitchIndicator({ pitch }: { pitch: number }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#3E2723';
    ctx.roundRect(10, 10, 236, 108, 10);
    ctx.fill();

    // Border
    ctx.strokeStyle = '#D4A574';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Pitch text
    const noteName = midiToNoteName(pitch);
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(noteName, 128, 64);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [pitch]);

  return (
    <sprite position={[0, 3, 1]} scale={[2, 1, 1]}>
      <spriteMaterial map={texture} transparent />
    </sprite>
  );
}

function SoundWaves({ position }: { position: [number, number, number] }) {
  const wavesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (wavesRef.current) {
      wavesRef.current.children.forEach((child, i) => {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.3;
        child.scale.set(scale, scale, scale);
      });
    }
  });

  return (
    <group ref={wavesRef} position={position}>
      {[...Array(3)].map((_, i) => (
        <mesh key={i} position={[0, 0, 0]}>
          <ringGeometry args={[0.3 + i * 0.2, 0.35 + i * 0.2, 32]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.5 - i * 0.15} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function midiToNoteName(midi: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  const noteName = noteNames[midi % 12];
  return `${noteName}${octave}`;
}
