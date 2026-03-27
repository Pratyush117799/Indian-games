import React, { useState, useEffect } from 'react';
import { Weapon } from '../types';
import { calculateCombatResult } from '../engine/GameRules';
import { Card } from './Card';
import { Sparkles } from 'lucide-react';

interface GameBoardProps {
    playerDeck: Weapon[];
    onExit: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ playerDeck, onExit }) => {
    const [playerHand, setPlayerHand] = useState<Weapon[]>([]);
    const [enemyHand, setEnemyHand] = useState<Weapon[]>([]); // Simulation
    const [field, setField] = useState<{ player: Weapon | null, enemy: Weapon | null }>({ player: null, enemy: null });
    const [logs, setLogs] = useState<string[]>(["Battle Started!"]);
    const [mantra, setMantra] = useState(3);
    const [turn, setTurn] = useState(1);

    // Initial Draw
    useEffect(() => {
        // Shuffle and draw 5
        const shuffled = [...playerDeck].sort(() => Math.random() - 0.5);
        setPlayerHand(shuffled.slice(0, 5));
    }, [playerDeck]);

    const playCard = (card: Weapon) => {
        if (mantra < card.mantraCost) {
            addLog(`Not enough Mantra! Need ${card.mantraCost}`);
            return;
        }

        setMantra(m => m - card.mantraCost);
        setField(prev => ({ ...prev, player: card }));
        setPlayerHand(prev => prev.filter(c => c.id !== card.id));
        addLog(`You played ${card.name}!`);

        // Simulate AI response after 1s
        setTimeout(() => aiTurn(card), 1000);
    };

    const aiTurn = (playerCard: Weapon) => {
        // AI picks a random card from "hand" (just random form deck logic)
        const aiCard = playerDeck[Math.floor(Math.random() * playerDeck.length)]; // Mirror match for now
        setField(prev => ({ ...prev, enemy: aiCard }));
        addLog(`Enemy played ${aiCard.name}!`);

        setTimeout(() => resolveCombat(playerCard, aiCard), 1000);
    };

    const resolveCombat = (pCard: Weapon, eCard: Weapon) => {
        const result = calculateCombatResult(pCard, eCard);
        result.log.forEach(l => addLog(l));

        if (result.winner === 'attacker') {
            addLog(`VICTORY! ${pCard.name} defeated ${eCard.name}`);
        } else {
            addLog(`DEFEAT! ${eCard.name} withstood the attack.`);
        }

        // Reset turn
        setTimeout(() => {
            setField({ player: null, enemy: null });
            setMantra(prev => prev + 2); // Regain mantra
            setTurn(t => t + 1);
        }, 3000);
    };

    const addLog = (msg: string) => setLogs(prev => [msg, ...prev]);

    return (
        <div className="h-screen bg-slate-900 flex flex-col overflow-hidden relative">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#1a1c2e] to-black opacity-80" />

            {/* Top Bar (Enemy) */}
            <div className="relative h-32 bg-black/20 border-b border-white/5 flex justify-center items-center">
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-16 h-24 bg-red-900/50 rounded border border-red-500/30 transform rotate-180" />
                    ))}
                </div>
                <div className="absolute top-4 right-4 text-red-500 font-bold">ENEMY WARLORD</div>
            </div>

            {/* Battle Arena */}
            <div className="flex-1 relative flex items-center justify-center gap-20">
                {/* Player Slot */}
                <div className={`transition-all duration-500 ${field.player ? 'scale-110' : 'opacity-50'}`}>
                    {field.player ? (
                        <Card data={field.player} isActive={true} />
                    ) : (
                        <div className="w-[300px] h-[450px] border-4 border-dashed border-white/10 rounded-xl flex items-center justify-center text-white/20">
                            PLAY CARD HERE
                        </div>
                    )}
                </div>

                {/* VS */}
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-red-600 italic">
                    VS
                </div>

                {/* Enemy Slot */}
                <div className={`transition-all duration-500 ${field.enemy ? 'scale-110' : 'opacity-50'}`}>
                    {field.enemy ? (
                        <Card data={field.enemy} isActive={true} />
                    ) : (
                        <div className="w-[300px] h-[450px] border-4 border-dashed border-red-500/10 rounded-xl flex items-center justify-center text-red-500/20">
                            ENEMY
                        </div>
                    )}
                </div>
            </div>

            {/* Battle Log Overlay */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-64 h-64 bg-black/50 backdrop-blur rounded-lg p-4 overflow-y-auto pointer-events-none fade-mask">
                {logs.map((log, i) => (
                    <div key={i} className="text-xs text-green-400 mb-1 font-mono">{`> ${log}`}</div>
                ))}
            </div>

            {/* Player Hand Area */}
            <div className="relative h-64 bg-black/40 border-t border-white/5 flex flex-col justify-end p-4 z-20">
                <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-astra-gold text-black px-6 py-1 rounded-full font-bold shadow-glow">
                    MANTRA: {mantra} ⚡
                </div>

                <div className="flex justify-center items-end gap-[-50px] overflow-visible">
                    {playerHand.map((card, idx) => (
                        <div
                            key={idx}
                            onClick={() => playCard(card)}
                            className="hover:z-50 hover:-translate-y-10 transition-all duration-300 transform -ml-12 first:ml-0"
                        >
                            <div className="scale-75 origin-bottom cursor-pointer hover:shadow-2xl">
                                <Card data={card} />
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={onExit} className="absolute bottom-4 right-4 text-gray-500 hover:text-white text-xs uppercase tracking-widest">
                    Surrender
                </button>
            </div>
        </div>
    );
};
