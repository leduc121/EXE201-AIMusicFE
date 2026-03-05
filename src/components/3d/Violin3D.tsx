import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Violin3DProps {
    activeStrings: number[];
}

// MIDI to violin string mapping (Standard tuning: G3, D4, A4, E5)
// String 0 (G) = 55, String 1 (D) = 62, String 2 (A) = 69, String 3 (E) = 76
const STRING_BASE_NOTES = [55, 62, 69, 76];

export function Violin3D({ activeStrings }: Violin3DProps) {
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
        <group rotation={[0, 0, Math.PI / 4]}>
            {/* Violin Body - Classic violin shape (simplified as rounded box) */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
                <boxGeometry args={[5.5, 0.5, 8]} />
                <meshStandardMaterial color="#8B4513" roughness={0.4} />
            </mesh>

            {/* Upper bout (shoulders) */}
            <mesh position={[0, 0, -3]} rotation={[0, 0, 0]}>
                <boxGeometry args={[4, 0.5, 3]} />
                <meshStandardMaterial color="#8B4513" roughness={0.4} />
            </mesh>

            {/* Lower bout (bottom) */}
            <mesh position={[0, 0, 3]} rotation={[0, 0, 0]}>
                <boxGeometry args={[5, 0.5, 4]} />
                <meshStandardMaterial color="#8B4513" roughness={0.4} />
            </mesh>

            {/* Lower bout (bottom) */}
            <mesh position={[0, 0, 3]} rotation={[0, 0, 0]}>
                <boxGeometry args={[5, 0.5, 4]} />
                <meshStandardMaterial color="#8B4513" roughness={0.4} />
            </mesh>

            {/* F-holes (left) */}
            <mesh position={[-1.5, 0.26, 0]} rotation={[0, 0, 0]}>
                <capsuleGeometry args={[0.1, 2, 4, 8]} />
                <meshBasicMaterial color="#1a1a1a" />
            </mesh>

            {/* F-holes (right) */}
            <mesh position={[1.5, 0.26, 0]} rotation={[0, 0, 0]}>
                <capsuleGeometry args={[0.1, 2, 4, 8]} />
                <meshBasicMaterial color="#1a1a1a" />
            </mesh>

            {/* Fingerboard */}
            <mesh position={[0, 0.3, -4]} rotation={[0, 0, 0]}>
                <boxGeometry args={[1.2, 0.15, 10]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
            </mesh>

            {/* Neck */}
            <mesh position={[0, 0.25, -6]} rotation={[0, 0, 0]}>
                <boxGeometry args={[1, 0.3, 3]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>

            {/* Scroll (head) */}
            <mesh position={[0, 0.3, -8]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.6, 0.5, 1.5, 16]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>

            {/* Tuning Pegs */}
            {[...Array(4)].map((_, i) => (
                <mesh 
                    key={i} 
                    position={[i % 2 === 0 ? 0.8 : -0.8, 0.3, -7.2 - Math.floor(i / 2) * 0.6]}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <cylinderGeometry args={[0.12, 0.12, 0.6, 16]} />
                    <meshStandardMaterial color="#654321" />
                </mesh>
            ))}

            {/* Tailpiece */}
            <mesh position={[0, 0.26, 3.5]} rotation={[0, 0, 0]}>
                <boxGeometry args={[1.5, 0.05, 2]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>

            {/* Chin rest */}
            <mesh position={[0, 0.4, 4.2]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>

            {/* Bridge */}
            <mesh position={[0, 0.3, 1]} rotation={[0, 0, 0]}>
                <boxGeometry args={[2, 0.15, 0.1]} />
                <meshStandardMaterial color="#D4A574" />
            </mesh>

            {/* 4 Strings */}
            {STRING_BASE_NOTES.map((_, i) => (
                <ViolinString
                    key={i}
                    index={i}
                    position={[(i - 1.5) * 0.3, 0.4, -2]}
                    isActive={activeStringIndices.includes(i)}
                />
            ))}

            {/* Bow (simplified) */}
            <BowAnimation activeStrings={activeStringIndices} />
        </group>
    );
}

function ViolinString({ 
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

    // String thickness (G is thickest, E is thinnest)
    const thickness = 0.01 + (3 - index) * 0.005;

    useFrame((state, delta) => {
        if (stringRef.current) {
            // Vibration effect when active
            if (vibrationIntensity > 0) {
                const vibration = Math.sin(state.clock.elapsedTime * 80) * vibrationIntensity * 0.03;
                stringRef.current.position.x = position[0] + vibration;
                setVibrationIntensity(prev => Math.max(0, prev - delta * 1.5));
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
            <cylinderGeometry args={[thickness, thickness, 14, 8]} />
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

function BowAnimation({ activeStrings }: { activeStrings: number[] }) {
    const bowRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (bowRef.current) {
            // Bow moves when strings are active
            if (activeStrings.length > 0) {
                const bowMovement = Math.sin(state.clock.elapsedTime * 4) * 2;
                bowRef.current.position.z = bowMovement;
                bowRef.current.visible = true;
            } else {
                bowRef.current.visible = false;
            }
        }
    });

    return (
        <group ref={bowRef} position={[2, 0.8, 0]} visible={false}>
            {/* Bow stick */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.08, 0.08, 12, 16]} />
                <meshStandardMaterial color="#654321" />
            </mesh>
            {/* Bow hair */}
            <mesh position={[0, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.02, 0.02, 11.5, 8]} />
                <meshStandardMaterial color="#F5F5DC" />
            </mesh>
        </group>
    );
}
