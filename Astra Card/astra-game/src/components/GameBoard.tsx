import React, { useState, useEffect } from 'react';
import { Weapon } from '../types';
import { calculateCombatResult } from '../engine/GameRules';
import { Card } from './Card';
import { Sparkles, Shield, Swords, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface GameBoardProps {
    playerDeck: Weapon[];
    onExit: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ playerDeck, onExit }) => {
    // Game State
    const [playerHand, setPlayerHand] = useState<Weapon[]>([]);
    const [enemyHand, setEnemyHand] = useState<Weapon[]>([]);
    const [playerField, setPlayerField] = useState<(Weapon | null)[]>(new Array(5).fill(null));
    const [enemyField, setEnemyField] = useState<(Weapon | null)[]>(new Array(5).fill(null));
    const [playerLife, setPlayerLife] = useState(30);
    const [enemyLife, setEnemyLife] = useState(30);
    const [mantra, setMantra] = useState(3);
    const [turn, setTurn] = useState(1);
    const [phase, setPhase] = useState<'draw' | 'mantra' | 'main' | 'battle' | 'end'>('main');
    const [logs, setLogs] = useState<string[]>(["Battle Started! Draw your first cards."]);
    const [selectedHandIndex, setSelectedHandIndex] = useState<number | null>(null);

    // Initial Setup
    useEffect(() => {
        const shuffled = [...playerDeck].sort(() => Math.random() - 0.5);
        setPlayerHand(shuffled.slice(0, 5));
        setEnemyHand(shuffled.slice(5, 10)); // Simple AI hand simulation
    }, [playerDeck]);

    const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 50));

    const playCard = (handIdx: number, fieldIdx: number) => {
        const card = playerHand[handIdx];
        if (mantra < card.mantraCost) {
            addLog(`Not enough Mantra for ${card.name}!`);
            return;
        }
        if (playerField[fieldIdx]) {
            addLog("Slot already occupied!");
            return;
        }

        const newField = [...playerField];
        newField[fieldIdx] = card;
        setPlayerField(newField);
        setMantra(m => m - card.mantraCost);
        setPlayerHand(prev => prev.filter((_, i) => i !== handIdx));
        setSelectedHandIndex(null);
        addLog(`Invoked ${card.name} to Slot ${fieldIdx + 1}`);
    };

    const endTurn = () => {
        // Trigger Battle Phase for all fielded cards
        setPhase('battle');
        addLog("Battle Phase Initiated!");
        
        // Resolve combat for each slot
        playerField.forEach((pCard, idx) => {
            const eCard = enemyField[idx];
            if (pCard && eCard) {
                const result = calculateCombatResult(pCard, eCard);
                result.log.forEach(l => addLog(l));
                if (result.winner === 'attacker') {
                    // Enemy card destroyed (simulation)
                    const newEnemyField = [...enemyField];
                    newEnemyField[idx] = null;
                    setEnemyField(newEnemyField);
                    setEnemyLife(l => Math.max(0, l - result.damageDealt));
                } else {
                    const newPlayerField = [...playerField];
                    newPlayerField[idx] = null;
                    setPlayerField(newPlayerField);
                    setPlayerLife(l => Math.max(0, l - result.damageDealt));
                }
            } else if (pCard && !eCard) {
                addLog(`${pCard.name} attacks directly!`);
                setEnemyLife(l => Math.max(0, l - pCard.power));
            }
        });

        // AI Sim turn (simple)
        setTimeout(() => {
            setMantra(m => Math.min(m + 2, 10));
            setTurn(t => t + 1);
            setPhase('main');
            addLog(`Turn ${turn + 1} Started.`);
        }, 1500);
    };

    return (
        <div className="h-screen bg-slate-950 flex flex-col overflow-hidden relative text-white font-sans">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-red-900/10 pointer-events-none" />

            {/* Header: Life Points */}
            <div className="relative h-16 bg-black/60 backdrop-blur border-b border-white/10 flex justify-between items-center px-10 z-30">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-black shadow-[0_0_15px_rgba(220,38,38,0.5)]">AI</div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Opponent Life</span>
                        <div className="h-2 w-48 bg-gray-800 rounded-full overflow-hidden mt-1">
                            <motion.div animate={{ width: `${(enemyLife / 30) * 100}%` }} className="h-full bg-red-500" />
                        </div>
                    </div>
                    <span className="text-2xl font-black text-red-500 italic ml-2">{enemyLife}</span>
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-yellow-500 uppercase">Turn</span>
                        <span className="text-xl font-black">{turn}</span>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-blue-400 uppercase">Phase</span>
                        <span className="text-sm font-black uppercase tracking-widest text-blue-300 animate-pulse">{phase}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-green-500 italic mr-2">{playerLife}</span>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Your Life</span>
                        <div className="h-2 w-48 bg-gray-800 rounded-full overflow-hidden mt-1">
                            <motion.div animate={{ width: `${(playerLife / 30) * 100}%` }} className="h-full bg-green-500" />
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black shadow-[0_0_15px_rgba(37,99,235,0.5)]">YOU</div>
                </div>
            </div>

            {/* Battle Arena */}
            <div className="flex-1 relative flex flex-col justify-center items-center gap-4 py-8">
                {/* Enemy Field */}
                <div className="flex gap-4">
                    {enemyField.map((card, i) => (
                        <div key={i} className="w-[180px] h-[260px] border-2 border-red-500/10 rounded-xl bg-red-950/10 flex items-center justify-center relative overflow-hidden group">
                            {card ? (
                                <div className="scale-[0.55] transform origin-center"><Card data={card} /></div>
                            ) : (
                                <Shield className="text-red-900/20 group-hover:text-red-900/40 transition-colors" size={40} />
                            )}
                            <div className="absolute top-0 left-0 text-[8px] p-1 text-red-500/40 font-black">E-SLOT-{i+1}</div>
                        </div>
                    ))}
                </div>

                {/* VS Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent relative my-2">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-6 py-2 border border-white/5 rounded-full text-xs font-black italic tracking-[1em] text-white/30">KSHETRA</div>
                </div>

                {/* Player Field */}
                <div className="flex gap-4">
                    {playerField.map((card, i) => (
                        <div 
                            key={i} 
                            onClick={() => selectedHandIndex !== null && playCard(selectedHandIndex, i)}
                            className={twMerge(
                                "w-[180px] h-[260px] border-2 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center relative group",
                                card ? "border-blue-500/30 bg-blue-900/5" : "border-white/5 bg-white/5 hover:border-blue-500/20 hover:bg-blue-500/5",
                                selectedHandIndex !== null && !card ? "border-yellow-500/50 animate-pulse scale-105" : ""
                            )}
                        >
                            {card ? (
                                <div className="scale-[0.55] transform origin-center"><Card data={card} isActive={true} /></div>
                            ) : (
                                <div className="text-white/10 group-hover:text-white/30 transition-colors flex flex-col items-center gap-2">
                                    <Swords size={32} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Invoke</span>
                                </div>
                            )}
                            <div className="absolute top-0 left-0 text-[8px] p-1 text-blue-500/40 font-black">P-SLOT-{i+1}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Panel: Log & Hand */}
            <div className="h-64 bg-black/80 backdrop-blur-2xl border-t border-white/10 relative z-40 flex">
                {/* Battle Log */}
                <div className="w-80 border-r border-white/10 flex flex-col">
                    <div className="p-3 border-b border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400">Battle Log</div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-2 font-mono text-[10px]">
                        {logs.map((log, i) => (
                            <div key={i} className={twMerge(
                                "border-l-2 pl-2",
                                log.includes('VICTORY') ? "border-green-500 text-green-400" :
                                log.includes('DEFEAT') ? "border-red-500 text-red-400" : "border-blue-500 text-gray-400"
                            )}>
                                {`> ${log}`}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hand & Actions */}
                <div className="flex-1 relative flex flex-col">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                        <div className="bg-blue-600 text-white px-8 py-2 rounded-full font-black shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/50 flex items-center gap-3">
                            <Zap size={16} className="fill-current" />
                            MANTRA: {mantra}
                        </div>
                        <button 
                            onClick={endTurn}
                            className="bg-red-600 hover:bg-red-500 text-white px-8 py-2 rounded-full font-black shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-400/50 transition-all active:scale-95"
                        >
                            END TURN
                        </button>
                    </div>

                    <div className="flex-1 flex justify-center items-center p-6 gap-2">
                        {playerHand.map((card, idx) => (
                            <motion.div
                                key={idx}
                                layoutId={`card-${card.id}`}
                                whileHover={{ y: -40, scale: 1.1, zIndex: 100 }}
                                onClick={() => setSelectedHandIndex(selectedHandIndex === idx ? null : idx)}
                                className={twMerge(
                                    "relative transition-all duration-300 cursor-pointer",
                                    selectedHandIndex === idx ? "-translate-y-20 ring-4 ring-yellow-400 rounded-2xl" : ""
                                )}
                            >
                                <div className="scale-[0.45] transform origin-bottom hover:drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                                    <Card data={card} />
                                </div>
                                {selectedHandIndex === idx && (
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-yellow-500 text-black px-3 py-1 rounded text-[10px] font-black uppercase shadow-lg">
                                        Select a Slot
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Surrender */}
                <button onClick={onExit} className="absolute bottom-4 right-4 text-gray-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
      