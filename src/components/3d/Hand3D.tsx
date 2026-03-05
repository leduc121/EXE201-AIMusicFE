import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Hand3DProps {
    activeKeys: number[];
    customRotation?: [number, number, number];
    customPosition?: [number, number, number];
}

export function Hand3D({ activeKeys, customRotation, customPosition }: Hand3DProps) {
    // Load model from public folder
    const { scene, nodes, animations } = useGLTF('/models/hand.glb');
    const group = useRef<THREE.Group>(null);
    const mixer = useRef<THREE.AnimationMixer>();

    // DEBUG: Inspect the model structure to find bone names
    useEffect(() => {
        if (scene) {
            console.log("=== HAND MODEL STRUCTURE ===");
            scene.traverse((obj) => {
                if (obj.type === 'Bone') {
                    console.log(`Bone Found: ${obj.name}`);
                }
            });
            console.log("Nodes:", nodes);
            console.log("============================");
        }
    }, [scene, nodes]);

    // Calculate Average Position (Simple Logic)
    // Mapping MIDI C4 (60) to x=0 approximately
    const getHandX = () => {
        if (activeKeys.length === 0) return 0; // Center C4

        // 12 notes ~ 7 white keys ~ 7 * 0.95 width ~ 6.6 units
        // scale factor approx 6.6 / 12 = 0.55 per semitone
        const sum = activeKeys.reduce((a, b) => a + (b - 60), 0);
        const avgOffset = sum / activeKeys.length;

        return avgOffset * 0.55;
    };

    const targetX = getHandX();

    useFrame((state, delta) => {
        if (group.current) {
            // If customPosition is present, use it as BASE for Y and Z
            const basePath = customPosition || [0, 2, 0];

            // X: Follow keys + custom offset X
            const currentX = THREE.MathUtils.lerp(group.current.position.x, targetX, delta * 5);
            group.current.position.x = currentX + basePath[0];

            // Y & Z: Use custom position directly (disable hover for easier debugging)
            group.current.position.y = basePath[1];
            group.current.position.z = basePath[2];
        }

        // Here we will add bone rotation logic once we know the bone names
        // e.g. nodes.IndexFinger1.rotation.x = ...
    });

    return (
        <group ref={group} dispose={null}>
            {/* 
        Adjust rotation/scale here if the model comes in weird.
        Often models are huge or flipped.
      */}
            <primitive
                object={scene}
                scale={3}
                rotation={customRotation || [0, 0, 0]}
            />
        </group>
    );
}

useGLTF.preload('/models/hand.glb');
