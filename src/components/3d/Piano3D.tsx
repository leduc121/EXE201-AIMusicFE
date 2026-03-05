import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Piano3DProps {
    activeKeys: number[];
}

// Convert MIDI number to note name (e.g., 60 -> C4)
function midiToNoteName(midi: number): string {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midi / 12) - 1;   
    const noteName = noteNames[midi % 12];
    return `${noteName}${octave}`;
}

export function Piano3D({ activeKeys }: Piano3DProps) {
    const keys = useMemo(() => {
        const keyData = [];
        const whiteKeyWidth = 0.9;
        const whiteKeyHeight = 4;
        const blackKeyWidth = 0.5;
        const blackKeyHeight = 2.5;

        let x = -((52 * whiteKeyWidth) / 2); // Center the piano

        for (let i = 0; i < 88; i++) {
            // Simple mapping: 0=A0, etc.
            // Need to determine if black or white key based on standard piano layout
            // A0, A#0, B0, C1, C#1...
            // 0  1    2   3   4
            // Starting from A0 (MIDI 21)
            const midi = i + 21;
            const noteInOctave = (midi - 21 + 9) % 12; // Adjusted so 0=C
            // C=0, C#=1, D=2, D#=3, E=4, F=5, F#=6, G=7, G#=8, A=9, A#=10, B=11

            const isBlack = [1, 3, 6, 8, 10].includes(noteInOctave);

            if (isBlack) {
                // Position relative to the PREVIOUS white key
                keyData.push({
                    isBlack: true,
                    position: [x - (blackKeyWidth / 2), 0.5, -1],
                    args: [blackKeyWidth, 0.5, blackKeyHeight],
                    midi: midi,
                    color: '#1a1a1a'
                });
            } else {
                keyData.push({
                    isBlack: false,
                    position: [x, 0, 0],
                    args: [whiteKeyWidth, 0.5, whiteKeyHeight],
                    midi: midi,
                    color: '#ffffff'
                });
                x += whiteKeyWidth + 0.05; // Spacing
            }
        }
        return keyData;
    }, []);

    return (
        <group>
            {/* Keybed */}
            <mesh position={[0, -0.5, -0.5]} receiveShadow>
                <boxGeometry args={[55, 1, 6]} />
                <meshStandardMaterial color="#3E2723" />
            </mesh>

            {keys.map((key) => (
                <Key
                    key={key.midi}
                    data={key}
                    isActive={activeKeys.includes(key.midi)}
                />
            ))}
        </group>
    );
}




function Key({ data, isActive }: { data: any; isActive: boolean }) {
    const mesh = useRef<THREE.Mesh>(null);
    const targetRot = isActive ? 0.1 : 0;
    const targetY = isActive ? (data.position[1] - 0.2) : data.position[1];

    // Floating Notes System
    const [notes, setNotes] = React.useState<number[]>([]);
    const prevActive = useRef(false);

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, targetRot, delta * 15);
            mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, targetY, delta * 15);
        }
    });

    // Detect key press (rising edge) to spawn note
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
            <mesh
                ref={mesh}
                position={data.position as any}
                castShadow
                receiveShadow
            >
                <boxGeometry args={data.args as any} />
                <meshStandardMaterial color={isActive ? '#D4A574' : data.color} />
            </mesh>

            {/* Render Floating Notes */}
            {notes.map(id => (
                <FloatingNote
                    key={id}
                    id={id}
                    midi={data.midi}
                    // Move effect to the "tip" of the key where fingers usually press
                    position={[
                        data.position[0],
                        2.0, // Start higher for more visible upward flight
                        data.position[2] + (data.isBlack ? 0.5 : 1.5)
                    ]}
                    color={isActive ? '#ffa500' : '#D4A574'}
                    onComplete={removeNote}
                />
            ))}
        </group>
    );
}


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
    const noteName = midiToNoteName(midi);

    // Create canvas texture for note name
    const texture = React.useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d')!;

        // Clear canvas
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
            ref.current.position.y += delta * 8; // Fly up dramatically
            const scale = 1 + (1 - opacity) * 0.3;
            ref.current.scale.set(scale, scale, scale);
            if (ref.current.material instanceof THREE.SpriteMaterial) {
                ref.current.material.opacity = opacity;
            }
            setOpacity(prev => Math.max(0, prev - delta * 1.0)); // Fade out slightly slower

            if (opacity <= 0) {
                onComplete(id);
            }
        }
    });

    // Debug log
    React.useEffect(() => {
        console.log(`FloatingNote spawned: ${noteName} at position`, position);
    }, []);

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
