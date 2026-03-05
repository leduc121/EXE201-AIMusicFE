import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface ProceduralHandProps {
    activeKeys: number[];
    side: 'left' | 'right';
}

export function ProceduralHand({ activeKeys, side }: ProceduralHandProps) {
    // Filter keys for this hand
    const relevantKeys = useMemo(() => {
        return activeKeys.filter(k => side === 'left' ? k < 60 : k >= 60);
    }, [activeKeys, side]);

    const group = useRef<THREE.Group>(null);

    // Calculate target position
    const targetX = useMemo(() => {
        if (relevantKeys.length === 0) {
            return side === 'left' ? -5 : 5;
        }
        const sum = relevantKeys.reduce((a, b) => a + (b - 60), 0);
        const avg = sum / relevantKeys.length;
        return avg * 0.55;
    }, [relevantKeys, side]);

    useFrame((state, delta) => {
        if (group.current) {
            // Smooth movement
            group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, delta * 8);

            // Breathing
            const breath = Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
            group.current.position.y = 2 + breath;
        }
    });

    const skinColor = "#eac086";
    const palmMaterial = <meshStandardMaterial color={skinColor} roughness={0.6} />;

    // Hand dimensions
    const palmWidth = 3.5;
    const palmLen = 3.6;

    return (
        <group ref={group} rotation={[0, 0, 0]}>

            {/* === PALM CONSTRUCTION (Composite) === */}

            {/* 1. Main Metacarpal Block (The back of the hand) */}
            <mesh position={[0, -0.2, 2.0]} rotation={[-0.1, 0, 0]} castShadow>
                <RoundedBox args={[palmWidth, 0.6, palmLen]} radius={0.4} smoothness={4}>
                    {palmMaterial}
                </RoundedBox>
            </mesh>

            {/* 2. Thenar Eminence (Thumb Muscle Base) */}
            <mesh position={[side === 'left' ? 1.2 : -1.2, -0.4, 3.2]} rotation={[0, 0, side === 'left' ? -0.4 : 0.4]} castShadow>
                {/* Flattened sphere */}
                <sphereGeometry args={[1.1]} />
                <meshStandardMaterial color={skinColor} roughness={0.6} />
            </mesh>

            {/* 3. Hypothenar Eminence (Pinky Muscle Side) */}
            <mesh position={[side === 'left' ? -1.4 : 1.4, -0.3, 3.2]} castShadow>
                <sphereGeometry args={[0.9]} />
                <meshStandardMaterial color={skinColor} roughness={0.6} />
            </mesh>

            {/* 4. Knuckles Bridge (Hides finger roots) */}
            <mesh position={[0, 0.1, 0.5]} rotation={[0, 0, 0]} castShadow>
                <RoundedBox args={[palmWidth + 0.2, 0.7, 1.2]} radius={0.5} smoothness={4}>
                    {palmMaterial}
                </RoundedBox>
            </mesh>


            {/* WRIST */}
            <mesh position={[0, -0.1, 4.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <capsuleGeometry args={[1.2, 1.8, 8, 16]} />
                {palmMaterial}
            </mesh>

            {/* === FINGERS === */}
            {/* Fanned out slightly (rotY) for realism */}

            {/* Pinky */}
            <Finger index={0} x={-1.6} z={0.1} length={2.5}
                rotY={side === 'left' ? -0.15 : 0.15}
                active={activeKeys.includes(side === 'left' ? 48 : 72) || relevantKeys.length > 0} // Simplification for visuals
                color={skinColor} side={side} />

            {/* Ring */}
            <Finger index={1} x={-0.6} z={-0.2} length={3.0}
                rotY={side === 'left' ? -0.05 : 0.05}
                active={relevantKeys.length > 0}
                color={skinColor} side={side} />

            {/* Middle */}
            <Finger index={2} x={0.5} z={-0.3} length={3.3}
                rotY={side === 'left' ? 0.02 : -0.02}
                active={relevantKeys.length > 0}
                color={skinColor} side={side} />

            {/* Index */}
            <Finger index={3} x={1.6} z={-0.1} length={2.9}
                rotY={side === 'left' ? 0.1 : -0.1}
                active={relevantKeys.length > 0}
                color={skinColor} side={side} />


            {/* === THUMB === */}
            {/* Moved to originate deeper in the palm/wrist */}
            <Thumb x={side === 'left' ? 2.5 : -2.5} z={2.5} active={relevantKeys.length > 0} color={skinColor} side={side} />
        </group>
    );
}

function Finger({ index, length, active, color, side, x, z, rotY }: any) {
    const ref = useRef<THREE.Group>(null);
    const finalX = side === 'left' ? -x : x;
    const finalRotY = rotY || 0;

    useFrame((state, delta) => {
        if (ref.current) {
            const restingCurl = -0.3 - (index * 0.05); // Natural arch
            const activeCurl = -1.2; // Strike deep

            // Random micro-movement for liveliness
            const idle = Math.sin(state.clock.getElapsedTime() * 2 + index) * 0.05;

            const targetRot = active ? activeCurl : restingCurl + idle;
            ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRot, delta * 12);
        }
    });

    const segmentLen = length / 3;
    const radius = 0.35;

    return (
        <group ref={ref} position={[finalX, 0, z]} rotation={[0, finalRotY, 0]}>

            {/* Metacarpal (Hidden Root) - Connects deep into knuckle bridge */}
            <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <capsuleGeometry args={[radius, 1.5, 4, 8]} />
                <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>

            {/* Proximal Segment */}
            {/* Pivot Point */}
            <group position={[0, 0, 0]}>
                <mesh position={[0, 0, -segmentLen / 2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <capsuleGeometry args={[radius, segmentLen, 8, 16]} />
                    <meshStandardMaterial color={color} roughness={0.6} />
                </mesh>

                {/* Middle Segment */}
                <group position={[0, 0, -segmentLen]}>
                    {/* Joint bump */}
                    <mesh position={[0, 0.05, 0]}>
                        <sphereGeometry args={[radius * 1.05]} />
                        <meshStandardMaterial color={color} roughness={0.65} />
                    </mesh>

                    <mesh position={[0, 0, -segmentLen / 2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                        <capsuleGeometry args={[radius * 0.9, segmentLen, 8, 16]} />
                        <meshStandardMaterial color={color} roughness={0.6} />
                    </mesh>

                    {/* Distal Segment */}
                    <group position={[0, 0, -segmentLen]}>
                        {/* Joint bump */}
                        <mesh position={[0, 0.05, 0]}>
                            <sphereGeometry args={[radius * 0.95]} />
                            <meshStandardMaterial color={color} roughness={0.65} />
                        </mesh>

                        <mesh position={[0, 0, -segmentLen / 2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                            <capsuleGeometry args={[radius * 0.8, segmentLen, 8, 16]} />
                            <meshStandardMaterial color={color} roughness={0.6} />
                        </mesh>

                        {/* Fingernail overlay */}
                        <mesh position={[0, 0.12, -segmentLen + 0.3]} rotation={[-0.2, 0, 0]}>
                            <planeGeometry args={[0.3, 0.35]} />
                            <meshStandardMaterial color="#fff5ee" roughness={0.3} />
                        </mesh>
                    </group>
                </group>
            </group>
        </group>
    );
}

function Thumb({ x, z, active, color, side }: any) {
    const ref = useRef<THREE.Group>(null);
    const finalRotY = side === 'left' ? -0.8 : 0.8; // More aggressive angle

    useFrame((_state, delta) => {
        if (ref.current) {
            const restingCurl = -0.2;
            const targetRot = active ? -0.6 : restingCurl;
            ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRot, delta * 15);
        }
    });

    return (
        <group ref={ref} position={[x, -0.5, z]} rotation={[0, finalRotY, 0.2]}> {/* Lower position */}

            {/* Metacarpal (Thumb Base) - Buried in Thenar */}
            <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <capsuleGeometry args={[0.5, 2.0, 8, 16]} />
                <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>

            {/* Proximal */}
            <group position={[0, 0, -0.5]}>
                <mesh position={[0, 0, -0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <capsuleGeometry args={[0.45, 1.6, 8, 16]} />
                    <meshStandardMaterial color={color} roughness={0.6} />
                </mesh>

                {/* Distal */}
                <group position={[0, 0, -1.6]}>
                    <mesh position={[0, 0.05, 0]}>
                        <sphereGeometry args={[0.48]} />
                        <meshStandardMaterial color={color} roughness={0.65} />
                    </mesh>

                    <mesh position={[0, 0, -0.7]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                        <capsuleGeometry args={[0.4, 1.4, 8, 16]} />
                        <meshStandardMaterial color={color} roughness={0.6} />
                    </mesh>

                    {/* Nail */}
                    <mesh position={[0, 0.15, -1.2]} rotation={[-0.1, 0, 0]}>
                        <planeGeometry args={[0.38, 0.42]} />
                        <meshStandardMaterial color="#fff5ee" roughness={0.3} />
                    </mesh>
                </group>
            </group>
        </group>
    );
}
