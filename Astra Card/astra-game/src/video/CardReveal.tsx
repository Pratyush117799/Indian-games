import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Weapon } from '../types';
import { Card } from '../components/Card';
import React from 'react';

// Wrapper for Remotion to use the HTML Card component
// Note: In real Remotion, we might need to recreate the visual styles if we want 
// perfect SVG export, but for MP4/Web, using HTML/CSS is fine.
export const CardReveal: React.FC<{ weapon: Weapon }> = ({ weapon }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Spring animation for entrance
    const scale = spring({
        frame,
        fps,
        from: 0,
        to: 1,
        stiffness: 100,
        damping: 15,
    });

    const rotate = spring({
        frame: frame - 15, // Delay rotation slightly
        fps,
        from: -90,
        to: 0,
        config: { stiffness: 80, damping: 15 },
    });

    const opacity = interpolate(frame, [0, 20], [0, 1]);

    return (
        <AbsoluteFill className="bg-black flex items-center justify-center">
            {/* Background Burst */}
            <div
                style={{
                    opacity: opacity,
                    transform: `scale(${scale * 1.5})`
                }}
                className="absolute w-[600px] h-[600px] bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-full blur-[100px]"
            />

            {/* The 3D Card */}
            <div style={{
                transform: `scale(${scale}) rotateY(${rotate}deg)`,
                opacity
            }}>
                <Card data={weapon} isActive={true} />
            </div>

            {/* Text Overlay */}
            <div
                style={{ opacity: interpolate(frame, [30, 50], [0, 1]) }}
                className="absolute bottom-10 font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-600 drop-shadow-2xl"
            >
                LEGENDARY DROP
            </div>
        </AbsoluteFill>
    );
};
