import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Guitar3DProps {
    activeStrings: number[];
}

// MIDI to guitar string mapping (Standard tuning: E2, A2, D3, G3, B3, E4)
// String 0 (Low E) = 40, String 1 (A) = 45, String 2 (D) = 50
// String 3 (G) = 55, String 4 (B) = 59, String 5 (High E) = 64
const STRING_BASE_NOTES = [40, 45, 50, 55, 59, 64];

export function Guitar3D({ activeStrings }: Guitar3DProps) {
    // Convert MIDI notes to string indices
    const activeStringIndices = useMemo(() => {
        return activeStrings.map(midi => {
            for (let i = 0; i < STRING_BASE_NOTES.length; i++) {
                if (midi >= STRING_BASE_NOTES[i] && midi < STRING_BASE_NOTES[i] + 12) {
                    return i;
                }
            }
            return -1;
        }).filter(i => i !== -1);
    }, [activeStrings]);

    return (
        <group>
            {/* Guitar Body - Classic acoustic guitar shape */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
                <boxGeometry args={[5, 0.4, 7]} />
                <meshStandardMaterial color="#8B4513" roughness={0.6} />
            </mesh>

            {/* Soundhole */}
            <mesh position={[0, 0.21, 1]} rotation={[0, 0, 0]}>
                <circleGeometry args={[1.2, 32]} />
                <meshBasicMaterial color="#1a1a1a" />
            </mesh>

            {/* Soundhole ring */}
            <mesh position={[0, 0.22, 1]} rotation={[0, 0, 0]}>
                <ringGeometry args={[1.2, 1.4, 32]} />
                <meshStandardMaterial color="#D4A574" />
            </mesh>

            {/* Guitar Neck */}
            <mesh position={[0, 0.3, -5]} rotation={[0, 0, 0]}>
                <boxGeometry args={[1.5, 0.3, 8]} />
                <meshStandardMaterial color="#654321" roughness={0.5} />
            </mesh>

            {/* Fretboard */}
            <mesh position={[0, 0.46, -5]} rotation={[0, 0, 0]}>
                <boxGeometry args={[1.6, 0.05, 8]} />
                <meshStandardMaterial color="#3E2723" roughness={0.3} />
            </mesh>

            {/* Frets */}
            {[...Array(12)].map((_, i) => (
                <mesh key={i} position={[0, 0.49, -1.5 - i * 0.6]}>
                    <boxGeometry args={[1.6, 0.02, 0.02]} />
                    <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
                </mesh>
            ))}

            {/* Guitar Headstock */}
            <mesh position={[0, 0.4, -9.5]} rotation={[0, 0, 0]}>
                <boxGeometry args={[2, 0.4, 2.5]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>

            {/* Tuning Pegs */}
            {[...Array(6)].map((_, i) => (
                <mesh 
                    key={i} 
                    position={[i % 2 === 0 ? 1.2 : -1.2, 0.4, -8.5 - Math.floor(i / 2) * 0.8]}
                    rotation={[0, 0, Math.PI / 2]}
                >
                    <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
                    <meshStandardMaterial color="#C0C0C0" metalness={0.9} />
                </mesh>
            ))}

            {/* 6 Strings */}
            {STRING_BASE_NOTES.map((_, i) => (
                <GuitarString
                    key={i}
                    index={i}
                    position={[(i - 2.5) * 0.25, 0.5, -1]}
                    isActive={activeStringIndices.includes(i)}
                />
            ))}

            {/* Bridge */}
            <mesh position={[0, 0.25, 2.8]}>
                <boxGeometry args={[3, 0.15, 0.3]} />
                <meshStandardMaterial color="#654321" />
            </mesh>
        </group>
    );
}

function GuitarString({ 
    index, 
    position, 
    isActive 
}: { 
    index: number; 
    position: [number, number, number]; 
    isActive: boolean;
}) {
    const stringRef = useRef<THREE.Mesh>(null);
    const prevActive = useRef(false);
    const [vibrationIntensity, setVibrationIntensity] = useState(0);

    // String thickness varies (thicker for lower strings)
    const thickness = 0.008 + (5 - index) * 0.003;

    useFrame((state, delta) => {
        if (stringRef.current) {
            // Vibration effect when active
            if (vibrationIntensity > 0) {
                const vibration = Math.sin(state.clock.elapsedTime * 60) * vibrationIntensity * 0.02;
                stringRef.current.position.x = position[0] + vibration;
                setVibrationIntensity(prev => Math.max(0, prev - delta * 2));
            } else {
                stringRef.current.position.x = position[0];
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
    useEffect(() => {
        if (isActive && !prevActive.current) {
            setVibrationIntensity(1);
        }
        prevActive.current = isActive;
    }, [isActive]);

    return (
        <mesh ref={stringRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[thickness, thickness, 16, 8]} />
            <meshStandardMaterial
                color={isActive ? '#FFD700' : '#C0C0C0'}
                emissive={isActive ? '#FFD700' : '#000000'}
                emissiveIntensity={isActive ? 0.5 : 0}
                metalness={0.9}
                roughness={0.2}
            />
        </mesh>
    );
}
