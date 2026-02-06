import React, { useRef } from 'react';
import { Weapon } from '../types';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Flame, Droplet, Zap, Shield, Swords, Wind, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps {
    data: Weapon;
    isActive?: boolean;
}

const getElementIcon = (element: string) => {
    if (element.includes('Fire')) return <Flame className="w-4 h-4 text-orange-400" />;
    if (element.includes('Water')) return <Droplet className="w-4 h-4 text-blue-400" />;
    if (element.includes('Thunder')) return <Zap className="w-4 h-4 text-yellow-400" />;
    if (element.includes('Wind')) return <Wind className="w-4 h-4 text-cyan-200" />;
    if (element.includes('Divine')) return <Sparkles className="w-4 h-4 text-yellow-200" />;
    return <Shield className="w-4 h-4 text-gray-400" />;
};

const getRarityGradient = (rarity: string) => {
    switch (rarity) {
        case 'Mythic': return 'bg-gradient-to-br from-purple-900 via-indigo-900 to-black border-purple-500';
        case 'Legendary': return 'bg-gradient-to-br from-yellow-700 via-orange-900 to-black border-yellow-500';
        case 'Epic': return 'bg-gradient-to-br from-blue-900 via-blue-950 to-black border-blue-400';
        default: return 'bg-gradient-to-br from-gray-800 to-black border-gray-600';
    }
};

export const Card: React.FC<CardProps> = ({ data, isActive = false }) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            whileHover={{ scale: 1.05 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={twMerge(
                "relative w-[300px] h-[450px] rounded-xl border-2 p-1 shadow-2xl cursor-pointer transition-all duration-300",
                getRarityGradient(data.rarity),
                isActive ? "ring-4 ring-yellow-400/50" : ""
            )}
        >
            <div
                className="relative w-full h-full bg-black/40 rounded-lg p-4 flex flex-col justify-between overflow-hidden"
                style={{ transform: "translateZ(20px)" }} // Depth effect
            >
                {/* Header */}
                <div className="flex justify-between items-start z-10">
                    <div>
                        <h3 className="font-bold text-lg text-white font-display tracking-wider drop-shadow-md">{data.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-300">
                            {getElementIcon(data.element)}
                            <span>{data.element}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-yellow-500 drop-shadow-glow">
                            {data.mantraCost}⚡
                        </span>
                    </div>
                </div>

                {/* Artwork Placeholder */}
                <div className="absolute inset-0 top-16 bottom-32 opacity-30 flex items-center justify-center">
                    <Swords size={120} className="text-white/20" />
                </div>

                {/* Description Box */}
                <div className="bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-white/10 z-10">
                    <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-1">
                        <span className="text-xs font-semibold text-gray-400">{data.tier} Tier</span>
                        <span className="text-lg font-bold text-red-400 tracking-wider">PWR {data.power}</span>
                    </div>

                    <p className="text-xs text-gray-300 italic mb-2 min-h-[40px]">
                        "{data.description}"
                    </p>

                    {data.ability && (
                        <div className="bg-white/5 p-2 rounded text-xs border-l-2 border-yellow-500">
                            <span className="font-bold text-yellow-200">{data.ability.name}: </span>
                            <span className="text-gray-300">{data.ability.effect}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center z-10 mt-2">
                    <span className={clsx(
                        "text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold",
                        data.rarity === 'Mythic' ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-300"
                    )}>
                        {data.rarity}
                    </span>
                    <div className="flex gap-1">
                        {/* Small counters indicators could go here */}
                    </div>
                </div>
            </div>

            {/* Gloss/Shine Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 rounded-xl pointer-events-none" />
        </motion.div>
    );
};
