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

        if (card.id === 4 || card.name.includes("Narayanastra")) {
            addLog("!! NARAYANASTRA: Respect the surrender or face destruction !!");
        }
    };

    const aiTurn = () => {
        addLog("Opponent's Turn...");
        
        // Simulating AI thinking
        setTimeout(() => {
            const newEnemyField = [...enemyField];
            const newEnemyHand = [...enemyHand];
            
            // Try to play up to 2 cards
            let cardsPlayed = 0;
            for (let i = 0; i < newEnemyHand.length && cardsPlayed < 2; i++) {
                const card = newEnemyHand[i];
                // Find empty slot
                const emptySlot = newEnemyField.findIndex(s => s === null);
                if (emptySlot !== -1 && mantra >= card.mantraCost) {
                    newEnemyField[emptySlot] = card;
                    newEnemyHand.splice(i, 1);
                    cardsPlayed++;
                    addLog(`Opponent invoked ${card.name}!`);
                }
            }
            
            setEnemyField(newEnemyField);
            setEnemyHand(newEnemyHand);
            
            // Proceed to Battle
            setTimeout(resolveBattle, 1000);
        }, 1000);
    };

    const endTurn = () => {
        if (phase !== 'main') return;
        setPhase('battle');
        aiTurn();
    };

    const resolveBattle = () => {
        addLog("Battle Commencing!");
        
        // Sequential resolution for drama
        let currentSlot = 0;
        const interval = setInterval(() => {
            if (currentSlot >= 5) {
                clearInterval(interval);
                finalizeTurn();
                return;
            }

            const pCard = playerField[currentSlot];
            const eCard = enemyField[currentSlot];

            if (pCard || eCard) {
                if (pCard && eCard) {
                    const result = calculateCombatResult(pCard, eCard);
                    result.log.forEach(l => addLog(l));
                    
                    if (result.winner === 'attacker') {
                        setEnemyField(prev => {
                            const n = [...prev]; n[currentSlot] = null; return n;
                        });
                        setEnemyLife(l => Math.max(0, l - result.damageDealt));
                    } else {
                        setPlayerField(prev => {
                            const n = [...prev]; n[currentSlot] = null; return n;
                        });
                        setPlayerLife(l => Math.max(0, l - result.damageDealt));
                    }
                } else if (pCard) {
                    addLog(`${pCard.name} strikes the opponent directly!`);
                    setEnemyLife(l => Math.max(0, l - pCard.power));
                } else if (eCard) {
                    addLog(`Opponent's ${eCard.name} strikes you directly!`);
                    setPlayerLife(l => Math.max(0, l - eCard.power));
                }
            }
            currentSlot++;
        }, 800);
    };

    const finalizeTurn = () => {
        setMantra(m => Math.min(m + 2, 10));
        setTurn(t => t + 1);
        
        // Draw 1 card each
        if (playerDeck.length > playerHand.length + 5) {
            setPlayerHand(prev => [...prev, playerDeck[Math.floor(Math.random() * playerDeck.length)]]);
        }
        
        setPhase('main');
        addLog(`--- Turn ${turn + 1} ---`);
    };

    return (
        <div className="h-screen bg-slate-950 flex flex-col overflow-hidden relative text-white font-sans">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-red-900/10 pointer-events-none" />

            {/* Game Over Overlay */}
            {(playerLife <= 0 || enemyLife <= 0) && (
                <div className="absolute inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center backdrop-blur-xl">
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                    >
                        <h1 className={twMerge(
                            "text-8xl font-black italic tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]",
                            playerLife <= 0 ? "text-red-500" : "text-yellow-500"
                        )}>
                            {playerLife <= 0 ? "BATTLE LOST" : "BATTLE WON"}
                        </h1>
                        <p className="text-gray-400 uppercase tracking-[1em] mb-12">The wheel of Karma turns...</p>
                        <button 
                            onClick={onExit}
                            className="bg-white text-black px-12 py-4 rounded-full font-black hover:scale-110 transition-transform active:scale-95"
                        >
                            RETURN TO HUB
                        </button>
                    </motion.div>
                </div>
            )}

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
                    Surrender Duel
                </button>
            </div>
        </div>
    );
};
