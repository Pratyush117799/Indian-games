import React, { useState, useEffect, useRef } from 'react';
import { ClashEntity, Projectile, DeploymentCard } from '../types';
import { updateGameState } from '../engine/ClashEngine';
import weaponsData from '../data/weapons.json';
import { Weapon } from '../types';

// Import Assets (Vite will handle these path resolutions)
import warriorRun from '../assets/warrior_run.png';
import warriorAttack from '../assets/warrior_attack.png';
// import vajraVfx from '../assets/vajra_vfx.png'; // Used in projectiles if we add sprite logic there

// Convert Weapon Cards to Deployment Cards
const unitCards: DeploymentCard[] = (weaponsData as Weapon[]).slice(0, 4).map(w => ({
    id: `card-${w.id}`,
    weaponId: w.id,
    cost: Math.min(w.mantraCost, 10),
    cooldown: 0,
    type: 'unit'
}));

export const ClashArena: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    // Game State
    const [entities, setEntities] = useState<ClashEntity[]>([]);
    const [projectiles, setProjectiles] = useState<Projectile[]>([]);

    // Resources
    const [mantra, setMantra] = useState(5);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [gameTime, setGameTime] = useState(180);
    const [gameOver, setGameOver] = useState<'player' | 'enemy' | 'draw' | null>(null);
    const [particles, setParticles] = useState<{ id: number, x: number, y: number, color: string, type?: 'deploy' | 'hit' }[]>([]);

    const requestRef = useRef<number>();
    const previousTimeRef = useRef<number>();
    const startTimeRef = useRef<number>(0);

    // Initial Setup (Towers)
    useEffect(() => {
        const initialTowers: ClashEntity[] = [
            // Player Towers
            { id: 'p-king', team: 'player', type: 'tower', x: 50, y: 5, lane: 'left', health: 3000, maxHealth: 3000, damage: 50, range: 25, attackSpeed: 1000, movementSpeed: 0, lastAttackTime: 0, isMoving: false, name: 'King Tower', templateId: 'king' },
            { id: 'p-princes-l', team: 'player', type: 'tower', x: 20, y: 15, lane: 'left', health: 1500, maxHealth: 1500, damage: 30, range: 18, attackSpeed: 800, movementSpeed: 0, lastAttackTime: 0, isMoving: false, name: 'Sentry', templateId: 'sentry' },
            { id: 'p-princes-r', team: 'player', type: 'tower', x: 80, y: 15, lane: 'right', health: 1500, maxHealth: 1500, damage: 30, range: 18, attackSpeed: 800, movementSpeed: 0, lastAttackTime: 0, isMoving: false, name: 'Sentry', templateId: 'sentry' },

            // Enemy Towers
            { id: 'e-king', team: 'enemy', type: 'tower', x: 50, y: 95, lane: 'left', health: 3000, maxHealth: 3000, damage: 50, range: 25, attackSpeed: 1000, movementSpeed: 0, lastAttackTime: 0, isMoving: false, name: 'Asura King', templateId: 'king' },
            { id: 'e-princes-l', team: 'enemy', type: 'tower', x: 20, y: 85, lane: 'left', health: 1500, maxHealth: 1500, damage: 30, range: 18, attackSpeed: 800, movementSpeed: 0, lastAttackTime: 0, isMoving: false, name: 'Asura Tower', templateId: 'sentry' },
            { id: 'e-princes-r', team: 'enemy', type: 'tower', x: 80, y: 85, lane: 'right', health: 1500, maxHealth: 1500, damage: 30, range: 18, attackSpeed: 800, movementSpeed: 0, lastAttackTime: 0, isMoving: false, name: 'Asura Tower', templateId: 'sentry' },
        ];
        setEntities(initialTowers);
    }, []);

    // Game Loop
    const animate = (time: number) => {
        if (gameOver) return;

        if (previousTimeRef.current !== undefined) {
            // Timer
            if (!startTimeRef.current) startTimeRef.current = time;
            const elapsed = Math.floor((time - startTimeRef.current) / 1000);
            const remaining = 180 - elapsed;

            if (remaining <= 0) {
                setGameTime(0);
                if (!gameOver) setGameOver('draw');
            } else {
                setGameTime(remaining);
            }

            if (!gameOver) {
                // Mantra (1.2x Speed)
                const mantraInterval = 1666;
                if (Math.floor(time / mantraInterval) > Math.floor(previousTimeRef.current / mantraInterval)) {
                    setMantra(m => Math.min(m + 1, 10));
                }

                // Spawns
                if (Math.floor(time / 5000) > Math.floor(previousTimeRef.current / 5000)) {
                    if (Math.random() > 0.5) spawnEnemyUnit();
                }

                // Logic Update (Engine)
                const result = updateGameState(entities, projectiles, time);
                setEntities(result.entities);
                setProjectiles(result.projectiles);

                // Handle Combat Events (Explosions)
                // We limit effects to avoid particle spam
                if (result.combatEvents.length > 0) {
                    // Just spawn one particle per frame max to save perf
                    const evt = result.combatEvents[0];
                    spawnParticle(evt.x, evt.y, 'violet', 'hit');
                }

                // Win/Loss
                setEntities(current => {
                    const pKing = current.find(e => e.id === 'p-king');
                    const eKing = current.find(e => e.id === 'e-king');
                    if (!pKing && !gameOver) setGameOver('enemy');
                    if (!eKing && !gameOver) setGameOver('player');
                    return current;
                });
            }
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current!);
    }, [gameOver, entities, projectiles]);

    const spawnEnemyUnit = () => {
        const lane = Math.random() > 0.5 ? 'left' : 'right';
        const template = weaponsData[Math.floor(Math.random() * 4)] as Weapon;
        const newUnit: ClashEntity = {
            id: `enemy-${Date.now()}`,
            templateId: template.name,
            team: 'enemy',
            type: 'unit',
            x: lane === 'left' ? 25 : 75,
            y: 70,
            lane: lane,
            health: 800,
            maxHealth: 800,
            damage: template.power * 2,
            range: 15, // Ranged
            attackSpeed: 1500,
            movementSpeed: 6,
            lastAttackTime: 0,
            isMoving: true,
            name: `${template.name} Wielder`
        };
        setEntities(prev => [...prev, newUnit]);
    };

    const deployUnit = (xPct: number, yPct: number) => {
        if (!selectedCardId || mantra < 3 || gameOver) return;

        const card = unitCards.find(c => c.id === selectedCardId);
        if (!card) return;

        if (yPct > 45) {
            alert("Cannot deploy in enemy territory!");
            return;
        }

        const lane = xPct < 50 ? 'left' : 'right';
        const weapon = weaponsData.find(w => w.id === card.weaponId);

        // Spawn 3 Units (Squad)
        const squadOffsets = [0, -3, 3];
        const newUnits = squadOffsets.map((offset, i) => ({
            id: `player-${Date.now()}-${i}`,
            templateId: weapon?.name || 'Soldier',
            team: 'player' as const,
            type: 'unit' as const,
            x: xPct + offset,
            y: yPct - (Math.abs(offset)), // Wedge formation
            lane: lane as 'left' | 'right',
            health: 400,
            maxHealth: 400,
            damage: (weapon?.power || 1) * 3,
            range: 15, // Ranged
            attackSpeed: 1200,
            movementSpeed: 8,
            lastAttackTime: 0,
            isMoving: true,
            name: weapon?.name || 'Warrior'
        }));

        setEntities(prev => [...prev, ...newUnits]);
        setMantra(m => m - card.cost);
        setSelectedCardId(null);

        spawnParticle(xPct, yPct, 'gold', 'deploy');
    };

    const spawnParticle = (x: number, y: number, color: string, type: 'deploy' | 'hit' = 'deploy') => {
        const id = Date.now() + Math.random();
        setParticles(prev => [...prev, { id, x, y, color, type }]);
        setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 800);
    };

    return (
        <div className="h-screen bg-slate-900 flex flex-col relative overflow-hidden">
            {/* Top Info Bar */}
            <div className={`h-16 flex justify-between items-center px-4 z-20 font-display transition-colors ${gameTime < 30 ? 'bg-red-900/80 animate-pulse' : 'bg-black/50'}`}>
                <button onClick={onExit} className="text-white bg-red-600 px-4 py-1 rounded">Exit Battle</button>
                <div className={`text-2xl font-bold ${gameTime < 30 ? 'text-red-300 scale-110' : 'text-yellow-400'}`}>
                    {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-white">Enemy: Asura Army</div>
            </div>

            {/* Game Over Overlay */}
            {gameOver && (
                <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center">
                    <h1 className={`text-6xl font-black mb-4 ${gameOver === 'player' ? 'text-green-500' : gameOver === 'enemy' ? 'text-red-500' : 'text-yellow-500'}`}>
                        {gameOver === 'player' ? 'VICTORY!' : gameOver === 'enemy' ? 'DEFEAT' : 'TIME UP'}
                    </h1>
                    <button onClick={onExit} className="bg-white text-black px-8 py-3 rounded-full font-bold">Menu</button>
                </div>
            )}

            {/* Field */}
            <div
                className="flex-1 relative bg-[url('https://images.unsplash.com/photo-1542259682-628d695c07e2?q=80&w=2670')] bg-cover bg-center"
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = 100 - ((e.clientY - rect.top) / rect.height) * 100;
                    deployUnit(x, y);
                }}
            >
                {/* Visuals */}
                <div className="absolute top-1/2 left-0 right-0 h-16 bg-blue-500/30 border-y-2 border-blue-400/50 flex items-center justify-center"><span className="text-blue-200/50 font-bold tracking-[1em]">RIVER</span></div>
                <div className="absolute top-1/2 left-[20%] w-12 h-20 bg-stone-700 -translate-y-1/2 border-x-2 border-stone-500"></div>
                <div className="absolute top-1/2 right-[20%] w-12 h-20 bg-stone-700 -translate-y-1/2 border-x-2 border-stone-500"></div>

                {/* Particles */}
                {particles.map(p => (
                    <div
                        key={p.id}
                        className={`absolute rounded-full pointer-events-none ${p.type === 'hit' ? 'w-12 h-12 bg-purple-500/50 blur-sm animate-ping' : 'w-24 h-24 border-4 border-yellow-400 opacity-0 animate-ping'}`}
                        style={{ left: `${p.x}%`, bottom: `${p.y}%`, transform: 'translate(-50%, 50%)' }}
                    />
                ))}

                {/* Projectiles */}
                {projectiles.map(p => (
                    <div
                        key={p.id}
                        className="absolute w-4 h-4 rounded-full shadow-[0_0_10px_orange]"
                        style={{
                            left: `${p.x}%`,
                            bottom: `${p.y}%`,
                            transform: 'translate(-50%, 50%)',
                            backgroundColor: p.team === 'player' ? '#fbbf24' : '#ef4444' // Gold vs Red projectiles
                        }}
                    >
                        {/* Trail */}
                        <div className="absolute top-1/2 left-1/2 w-8 h-1 bg-yellow-200/50 -translate-y-1/2 -z-10 blur-sm" style={{ transform: 'rotate(45deg)' }}></div>
                    </div>
                ))}

                {/* Entities */}
                {entities.map(e => (
                    <div
                        key={e.id}
                        className={`absolute w-12 h-12 -ml-6 -mb-6 transition-all duration-[16ms] linear flex flex-col items-center justify-center`}
                        style={{
                            left: `${e.x}%`,
                            bottom: `${e.y}%`,
                            zIndex: Math.floor(100 - e.y)
                        }}
                    >
                        {/* Health */}
                        {e.health < e.maxHealth && (
                            <div className="w-12 h-1 bg-gray-700 rounded-full mb-1 overflow-hidden">
                                <div className={`h-full ${e.team === 'player' ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.max(0, e.health / e.maxHealth) * 100}%` }} />
                            </div>
                        )}

                        {/* Sprite Render */}
                        {e.type === 'unit' ? (
                            <div className="relative w-16 h-16 pointer-events-none">
                                <img
                                    src={e.team === 'player' ? warriorRun : warriorAttack}
                                    className={`w-full h-full object-contain ${e.team === 'enemy' ? 'scale-x-[-1] filter hue-rotate-180 brightness-50' : 'drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]'}`}
                                    alt="u"
                                />
                                {e.team === 'player' && e.isMoving && (
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-t from-white/20 to-transparent" />
                                )}
                            </div>
                        ) : (
                            <div className={`w-12 h-12 rounded-lg border-2 shadow-lg flex items-center justify-center text-xl ${e.team === 'player' ? 'bg-blue-900 border-blue-400' : 'bg-red-900 border-red-400'
                                }`}>🏰</div>
                        )}

                    </div>
                ))}
            </div>

            {/* Hand */}
            <div className="h-48 bg-black/80 border-t-4 border-yellow-600 p-4 flex gap-4 items-center overflow-x-auto z-30">
                <div className="flex flex-col items-center mr-4 min-w-[80px]">
                    <div className="text-xs text-gray-400 font-bold uppercase">Mantra</div>
                    <div className="text-4xl font-bold bg-gradient-to-b from-purple-500 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">{mantra}/10</div>
                    <div className="w-full h-2 bg-gray-800 rounded-full mt-2"><div className="h-full bg-purple-500 rounded-full transition-all duration-300" style={{ width: `${mantra * 10}%` }} /></div>
                </div>
                {unitCards.map(c => (
                    <div
                        key={c.id}
                        onClick={() => mantra >= c.cost && setSelectedCardId(c.id)}
                        className={`relative w-28 h-36 rounded-lg border-2 cursor-pointer transition-all hover:-translate-y-2 ${selectedCardId === c.id ? 'border-yellow-400 ring-4 ring-yellow-500/30' : mantra >= c.cost ? 'border-gray-500 bg-gray-800' : 'border-gray-700 bg-gray-900 opacity-50 grayscale'}`}
                    >
                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white border-2 border-purple-400 z-10">{c.cost}</div>
                        <div className="p-2 h-full flex flex-col items-center text-center">
                            <img src={warriorAttack} className="w-16 h-16 object-contain mb-2" alt="icon" />
                            <div className="font-bold text-xs text-white uppercase">{c.weaponId === 1 ? 'Brahmastra' : 'Astral'}</div>
                            <div className="text-[10px] text-yellow-400 mt-1">SQUAD x3</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
