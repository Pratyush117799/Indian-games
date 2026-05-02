import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBoard } from '../components/GameBoard';
import { ClashArena } from '../components/ClashArena';
import { ZeroGArena } from '../components/ZeroGArena';
import { ArrowLeft } from 'lucide-react';
import weaponsData from '../data/weapons.json';
import { Weapon } from '../types';

export const PlayHub: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [mode, setMode] = useState<'hub' | 'duel' | 'clash' | 'zerog'>('hub');

    // Props for sub-components
    const handleExit = () => setMode('hub');
    const deck = (weaponsData as Weapon[]).slice(0, 30);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            <AnimatePresence mode="wait">
                {mode === 'hub' ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="container mx-auto px-6 py-12"
                    >
                        <header className="flex items-center gap-4 mb-16">
                            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full"><ArrowLeft /></button>
                            <h1 className="text-4xl font-bold">Game Modes</h1>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <GameModeCard
                                title="Standard Duel"
                                desc="Classic 1v1 card battles. Build your deck and counter your opponent's elements."
                                image="https://images.unsplash.com/photo-1534068590799-09895a701e3e?q=80&w=2600"
                                onClick={() => setMode('duel')}
                                color="from-blue-600 to-cyan-600"
                            />
                            <GameModeCard
                                title="Clash Arena"
                                desc="Real-time strategy. Deploy units, destroy towers, and manage your Mantra supply."
                                image="https://images.unsplash.com/photo-1542259682-628d695c07e2?q=80&w=2670"
                                onClick={() => setMode('clash')}
                                color="from-purple-600 to-pink-600"
                            />
                            <GameModeCard
                                title="Zero-G Kshetra"
                                desc="Physics-based space combat. Account for recoil and drift in zero gravity."
                                image="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2622"
                                onClick={() => setMode('zerog')}
                                color="from-emerald-600 to-teal-600"
                            />
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-screen w-full relative">
                        {mode === 'duel' && <GameBoard playerDeck={deck} onExit={handleExit} />}
                        {mode === 'clash' && <ClashArena onExit={handleExit} />}
                        {mode === 'zerog' && <ZeroGArena onExit={handleExit} />}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const GameModeCard = ({ title, desc, image, onClick, color }: any) => (
    <motion.div
        whileHover={{ y: -10, scale: 1.02 }}
        onClick={onClick}
        className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer shadow-2xl"
    >
        <div className={`absolute inset-0 bg-gradient-to-b ${color} opacity-0 group-hover:opacity-60 transition-opacity z-10`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        <img src={image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={title} />

        <div className="absolute bottom-0 left-0 p-8 z-20">
            <h3 className="text-3xl font-black mb-2 uppercase italic">{title}</h3>
            <p className="text-gray-300 text-sm mb-4">{desc}</p>
            <div className="flex items-center text-white font-bold text-sm tracking-widest">
                PLAY NOW <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
            </div>
        </div>
    </motion.div>
);
