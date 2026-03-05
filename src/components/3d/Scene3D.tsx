import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Piano3D } from './Piano3D';
import { Flute3D } from './Flute3D';
import { DanTranh3D } from './DanTranh3D';
import { DanBau3D } from './DanBau3D';
import { Guitar3D } from './Guitar3D';
import { Violin3D } from './Violin3D';

interface Scene3DProps {
    activeKeys: number[];
    instrument?: 'piano' | 'flute' | 'dan-tranh' | 'dan-bau' | 'guitar' | 'violin';
    pitch?: number; // For dan-bau
}

export function Scene3D({ activeKeys, instrument = 'piano', pitch }: Scene3DProps) {
    // Determine camera position based on instrument
    const getCameraPosition = () => {
        switch (instrument) {
            case 'flute':
                return [0, 2, 8];
            case 'dan-tranh':
                return [0, 8, 12];
            case 'dan-bau':
                return [0, 3, 10];
            case 'guitar':
                return [0, 5, 12];
            case 'violin':
                return [0, 4, 10];
            case 'piano':
            default:
                return [0, 20, 0.1];
        }
    };

    // Render the appropriate instrument
    const renderInstrument = () => {
        switch (instrument) {
            case 'piano':
                return (
                    <group position={[0, -2, 0]}>
                        <Piano3D activeKeys={activeKeys} />
                    </group>
                );
            case 'flute':
                return (
                    <group position={[0, 0, 0]}>
                        <Flute3D activeHoles={activeKeys} />
                    </group>
                );
            case 'dan-tranh':
                return (
                    <group position={[0, -1, 0]}>
                        <DanTranh3D activeStrings={activeKeys} />
                    </group>
                );
            case 'dan-bau':
                return (
                    <group position={[0, -1, 0]}>
                        <DanBau3D 
                            pitch={pitch || 60} 
                            isPlaying={activeKeys.length > 0}
                        />
                    </group>
                );
            case 'guitar':
                return (
                    <group position={[0, -1, 0]}>
                        <Guitar3D activeStrings={activeKeys} />
                    </group>
                );
            case 'violin':
                return (
                    <group position={[0, -1, 0]}>
                        <Violin3D activeStrings={activeKeys} />
                    </group>
                );
            default:
                return (
                    <group position={[0, -2, 0]}>
                        <Piano3D activeKeys={activeKeys} />
                    </group>
                );
        }
    };

    return (
        <div className="w-full h-[500px] bg-[#1a100c] relative">
            <Canvas
                shadows
                camera={{ position: getCameraPosition() as [number, number, number], fov: 40 }}
                className="w-full h-full"
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <spotLight
                        position={[10, 10, 10]}
                        angle={0.15}
                        penumbra={1}
                        shadow-mapSize={2048}
                        castShadow
                    />
                    <pointLight position={[-10, 10, -10]} intensity={0.5} />

                    {/* Instrument */}
                    {renderInstrument()}

                    {/* Environment and Controls */}
                    <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={20} blur={1.5} far={0.8} />
                    <Environment preset="city" />
                    <OrbitControls
                        enableRotate={true}
                        enableZoom={true}
                        enablePan={false}
                    />
                </Suspense>
            </Canvas>
            <div className="absolute bottom-4 right-4 text-white/50 text-xs font-mono pointer-events-none">
                Rotate/Zoom to inspect
            </div>
        </div>
    );
}
