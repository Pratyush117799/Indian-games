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

    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [20, -20]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-20, 20]), { stiffness: 150, damping: 20 });
    
    // Holographic shine effect
    const shineX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
    const shineY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / rect.width - 0.5;
        const yPct = mouseY / rect.height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const rarityColor = data.rarity === 'Mythic' ? 'text-purple-400' : data.rarity === 'Legendary' ? 'text-yellow-400' : 'text-blue-400';

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
                "relative w-[300px] h-[450px] rounded-2xl border-2 p-1.5 shadow-2xl cursor-pointer transition-all duration-300 group",
                getRarityGradient(data.rarity),
                isActive ? "ring-8 ring-yellow-400/30 scale-105" : ""
            )}
        >
            {/* Holographic Layer */}
            <motion.div 
                className="absolute inset-0 z-0 opacity-0 group-hover:opacity-20 pointer-events-none rounded-2xl bg-gradient-to-tr from-transparent via-white to-transparent"
                style={{ 
                    backgroundSize: '200% 200%',
                    backgroundPositionX: shineX,
                    backgroundPositionY: shineY,
                }}
            />

            <div
                className="relative w-full h-full bg-black/40 backdrop-blur-md rounded-xl p-5 flex flex-col justify-between overflow-hidden border border-white/5"
                style={{ transform: "translateZ(30px)" }} 
            >
                {/* Header */}
                <div className="flex justify-between items-start z-10">
                    <div>
                        <h3 className={twMerge("font-black text-xl font-display tracking-tighter drop-shadow-lg leading-tight", rarityColor)}>
                            {data.name.toUpperCase()}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                            {getElementIcon(data.element)}
                            <span>{data.element}</span>
                        </div>
                    </div>
                    <div className="bg-black/60 rounded-full w-12 h-12 flex items-center justify-center border border-yellow-500/50 shadow-inner">
                        <span className="text-xl font-black text-yellow-500">
                            {data.mantraCost}
                        </span>
                    </div>
                </div>

                {/* Artwork Area */}
                <div className="absolute inset-0 top-16 bottom-32 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                    <motion.div 
                        animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0, -2, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="opacity-40"
                    >
                        <Swords size={160} className="text-white/20" />
                    </motion.div>
                    
                    {/* Element-specific particles (simplified) */}
                    {data.element.includes('Fire') && <div className="absolute inset-0 bg-orange-500/5 animate-pulse" />}
                    {data.element.includes('Thunder') && <div className="absolute inset-0 bg-yellow-400/5 animate-pulse" />}
                </div>

                {/* Description & Ability Box */}
                <div className="bg-black/80 backdrop-blur-xl p-4 rounded-xl border border-white/10 z-10 shadow-2xl">
                    <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{data.tier} TIER</span>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] text-gray-400">POWER</span>
                            <span className="text-xl font-black text-red-500 tracking-tighter">{data.power}</span>
                        </div>
                    </div>

                    <p className="text-[11px] text-gray-400 italic mb-3 leading-relaxed">
                        "{data.description}"
                    </p>

                    {data.ability && (
                        <div className="bg-yellow-500/10 p-2.5 rounded-lg border-l-4 border-yellow-500/80">
                            <div className="text-[10px] font-black text-yellow-500 uppercase mb-0.5">{data.ability.name}</div>
                            <div className="text-[10px] text-gray-300 leading-snug">{data.ability.effect}</div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center z-10 mt-2">
                    <div className={twMerge(
                        "text-[9px] px-3 py-1 rounded-full uppercase tracking-widest font-black",
                        data.rarity === 'Mythic' ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]" : 
                        data.rarity === 'Legendary' ? "bg-yellow-600 text-black" : "bg-gray-700 text-gray-300"
                    )}>
                        {data.rarity}
                    </div>
                    <div className="text-[8px] text-gray-500 font-mono">ASTRA-#{data.id.toString().padStart(3, '0')}</div>
                </div>
            </div>

            {/* Glass Glare Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    );
};
