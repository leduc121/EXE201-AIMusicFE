import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Flute3DProps {
    activeHoles: number[];
}

// MIDI to hole mapping for 6-hole bamboo flute
// Hole 1 (bottom) = D4 (62), Hole 2 = E4 (64), Hole 3 = G4 (67)
// Hole 4 = A4 (69), Hole 5 = B4 (71), Hole 6 (top) = D5 (74)
const MIDI_TO_HOLE: Record<number, number> = {
    62: 0, // D4 -> Hole 1
    64: 1, // E4 -> Hole 2
    67: 2, // G4 -> Hole 3
    69: 3, // A4 -> Hole 4
    71: 4, // B4 -> Hole 5
    74: 5, // D5 -> Hole 6
};

export function Flute3D({ activeHoles }: Flute3DProps) {
    // Convert MIDI notes to hole indices
    const activeHoleIndices = useMemo(() => {
        return activeHoles.map(midi => MIDI_TO_HOLE[midi]).filter(h => h !== undefined);
    }, [activeHoles]);

    return (
        <group>
            {/* Flute Body - Bamboo cylinder */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.15, 0.15, 12, 32]} />
                <meshStandardMaterial
                    color="#8B7355"
                    roughness={0.8}
                    metalness={0.1}
                />
            </mesh>

            {/* Bamboo segments (decorative rings) */}
            {[...Array(7)].map((_, i) => (
                <mesh key={i} position={[i * 1.8 - 5.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.17, 0.17, 0.1, 32]} />
                    <meshStandardMaterial color="#6B5A44" />
                </mesh>
            ))}

            {/* 6 Finger Holes */}
            {[...Array(6)].map((_, i) => (
                <FluteHole
                    key={i}
                    index={i}
                    position={[i * 1.5 - 3.75, 0, 0]}
                    isActive={activeHoleIndices.includes(i)}
                    midi={Object.keys(MIDI_TO_HOLE).find(k => MIDI_TO_HOLE[parseInt(k)] === i) ? parseInt(Object.keys(MIDI_TO_HOLE).find(k => MIDI_TO_HOLE[parseInt(k)] === i)!) : 62}
                />
            ))}
        </group>
    );
}

function FluteHole({
    index,
    position,
    isActive,
    midi
}: {
    index: number;
    position: [number, number, number];
    isActive: boolean;
    midi: number;
}) {
    const holeRef = useRef<THREE.Mesh>(null);
    const [notes, setNotes] = React.useState<number[]>([]);
    const prevActive = useRef(false);

    useFrame((state, delta) => {
        if (holeRef.current) {
            // Glow effect when active
            const targetEmissive = isActive ? 1.5 : 0;
            if (holeRef.current.material instanceof THREE.MeshStandardMaterial) {
                holeRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
                    holeRef.current.material.emissiveIntensity,
                    targetEmissive,
                    delta * 10
                );
            }
        }
    });

    // Detect hole activation to spawn note
    React.useEffect(() => {
        if (isActive && !prevActive.current) {
            setNotes(prev => [...prev, Date.now()]);
        }
        prevActive.current = isActive;
    }, [isActive]);

    const removeNote = (id: number) => {
        setNotes(prev => prev.filter(n => n !== id));
    };

    return (
        <group>
            {/* Hole */}
            <mesh ref={holeRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.12, 32]} />
                <meshStandardMaterial
                    color={isActive ? '#FFD700' : '#2a1810'}
                    emissive={isActive ? '#FFD700' : '#000000'}
                    emissiveIntensity={isActive ? 1.5 : 0}
                />
            </mesh>

            {/* Floating Notes - Reuse from Piano3D */}
            {notes.map(id => (
                <FloatingNote
                    key={id}
                    id={id}
                    midi={midi}
                    position={[position[0], 1.5, position[2]]}
                    color="#FFD700"
                    onComplete={removeNote}
                />
            ))}
        </group>
    );
}

// Reuse FloatingNote from Piano3D (copied here for now)
function FloatingNote({
    id,
    midi,
    position,
    color,
    onComplete
}: {
    id: number;
    midi: number;
    position: [number, number, number];
    color: string;
    onComplete: (id: number) => void;
}) {
    const ref = useRef<THREE.Sprite>(null);
    const [opacity, setOpacity] = React.useState(1);

    // MIDI to note name
    const midiToNoteName = (midi: number): string => {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const octave = Math.floor(midi / 12) - 1;
        const noteName = noteNames[midi % 12];
        return `${noteName}${octave}`;
    };

    const noteName = midiToNoteName(midi);

    // Create canvas texture for note name
    const texture = React.useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d')!;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background circle
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(128, 64, 50, 0, Math.PI * 2);
        ctx.fill();

        // Draw text
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText(noteName, 128, 64);
        ctx.fillText(noteName, 128, 64);

        const tex = new THREE.CanvasTexture(canvas);
        tex.needsUpdate = true;
        return tex;
    }, [noteName, color]);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.position.y += delta * 8;
            const scale = 1 + (1 - opacity) * 0.3;
            ref.current.scale.set(scale, scale, scale);
            if (ref.current.material instanceof THREE.SpriteMaterial) {
                ref.current.material.opacity = opacity;
            }
            setOpacity(prev => Math.max(0, prev - delta * 1.0));

            if (opacity <= 0) {
                onComplete(id);
            }
        }
    });

    return (
        <sprite ref={ref} position={position} scale={[1.5, 1.5, 1]}>
            <spriteMaterial
                map={texture}
                transparent
                opacity={opacity}
                depthTest={false}
                depthWrite={false}
            />
        </sprite>
    );
}
