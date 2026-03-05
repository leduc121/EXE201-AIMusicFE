import React, { useEffect, useRef, useMemo } from 'react';
import { useGraph, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

interface RiggedHandProps {
    activeKeys: number[];
    side: 'left' | 'right';
    customRotation?: [number, number, number];
    customPosition?: [number, number, number];
}

// BONE MAPPING (Inferred from user logs)
// Thumb: 1, 2, 3
// Index: 5, 6, 7 (4 Meta)
// Middle: 10, 11, 12 (9 Meta)
// Ring: 15, 16, 17 (14 Meta)
// Pinky: 20, 21, 22 (19 Meta)
const TIMING_OFFSET = 0; // ms

export function RiggedHand({ activeKeys, side, customRotation, customPosition }: RiggedHandProps) {
    const { scene } = useGLTF('/models/hand.glb');
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);

    const group = useRef<THREE.Group>(null);

    // Map Bones to Fingers for easy access
    const fingerBones = useMemo(() => {
        // Helper to find bone by partial name if needed, or exact
        // Since names are messy (Bone001_02), we try to find by inclusion or exact map
        // We will use the "nodes" dictionary directly if keys match, or search.

        // Based on logs: "Bone001_02" is the key in nodes?
        // Let's assume the names provided are the keys or names.
        // We'll iterate nodes to find them.

        const map: Record<string, THREE.Bone[]> = {
            thumb: [],
            index: [],
            middle: [],
            ring: [],
            pinky: []
        };

        Object.values(nodes).forEach((node: any) => {
            if (!node.isBone) return;
            const name = node.name;

            // Thumb: 001, 002, 003
            if (name.includes('Bone001') || name.includes('Bone002') || name.includes('Bone003_')) map.thumb.push(node);

            // Index: 005, 006, 007
            if (name.includes('Bone005') || name.includes('Bone006') || name.includes('Bone007')) map.index.push(node);

            // Middle: 010, 011, 012
            if (name.includes('Bone010') || name.includes('Bone011') || name.includes('Bone012')) map.middle.push(node);

            // Ring: 015, 016, 017
            if (name.includes('Bone015') || name.includes('Bone016') || name.includes('Bone017')) map.ring.push(node);

            // Pinky: 020, 021, 022
            if (name.includes('Bone020') || name.includes('Bone021') || name.includes('Bone022')) map.pinky.push(node);
        });

        // Sort bits if needed? usually name order is fine for hierarchy top-down
        return map;
    }, [nodes]);


    // Filter keys for this hand
    const relevantKeys = useMemo(() => {
        return activeKeys.filter(k => side === 'left' ? k < 60 : k >= 60);
    }, [activeKeys, side]);

    // Calculate target position
    const targetX = useMemo(() => {
        if (relevantKeys.length === 0) {
            return side === 'left' ? -5 : 5;
        }
        const sum = relevantKeys.reduce((a, b) => a + (b - 60), 0);
        const avg = sum / relevantKeys.length;
        // Align scale with visual keys
        return avg * 0.55;
    }, [relevantKeys, side]);

    useFrame((state, delta) => {
        if (group.current) {
            // Position
            group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, delta * 8);

            // Hover
            const breath = Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
            group.current.position.y = 2 + breath; // Height of wrist

            // Apply Custom Position Offset (Debug)
            if (customPosition) {
                group.current.position.x += customPosition[0];
                group.current.position.y += customPosition[1];
                group.current.position.z += customPosition[2];
            }
        }

        // Animate Fingers
        // Check which finger "should" be pressing.
        // Simplifying: if ANY key is active, animate "Index" or "Middle" mostly, or all?
        // Better: Map keys to fingers? 
        // For now: Curl ALL active fingers if any key is pressed to simulate a chord or tap.

        // Curl Logic:
        // Default (Rest): Slight Curl
        // Active: Deep Curl
        const isPressing = relevantKeys.length > 0;

        // Rotate Local Z or X? Depends on bone orientation.
        // Usually X is curl axis.
        // Trial: X axis. 
        // Sign: Positive or Negative? Mannequin was Negative. 

        const curl = (bones: THREE.Bone[], active: boolean, offset: number) => {
            bones.forEach(bone => {
                const resting = -0.2;
                const pressing = -1.2;
                const target = active ? pressing : resting;
                // Smooth lerp
                bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, target, delta * 15);
                // Note: Trying Z axis for curl based on typical GLTF. If wrong, we switch to X or Y.
            });
        }

        curl(fingerBones.thumb, isPressing, 0);
        curl(fingerBones.index, isPressing, 0);
        curl(fingerBones.middle, isPressing, 0);
        curl(fingerBones.ring, isPressing, 0);
        curl(fingerBones.pinky, isPressing, 0);

    });

    return (
        <group ref={group} dispose={null}>
            <primitive
                object={clone}
                // Adjust Scale and Rotation
                // Right hand needs to be Standard. Left Hand Mirrored.
                // If the model is Right Hand by default:
                scale={[side === 'left' ? -3 : 3, 3, 3]}

                // Rotation to face Palm Down
                // Usually models are Palm Y+ or Z+.
                // Let's try Rotation X = -90 (Palm Down?)
                rotation={customRotation || [0, 0, 0]}
            />
        </group>
    );
}

useGLTF.preload('/models/hand.glb');
