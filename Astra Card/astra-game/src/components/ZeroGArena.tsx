import React, { useEffect, useRef, useState } from 'react';
import Phaser from '../game/phaser-shim';
import { BattleScene } from '../game/scenes/BattleScene';
import { ZERO_G_CONFIG } from '../game/ZeroGGame';

export const ZeroGArena: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const gameRef = useRef<any>(null);
    const [prana, setPrana] = useState(0);
    const [selectedUnit, setSelectedUnit] = useState<'tank' | 'sniper' | 'swarm' | null>(null);

    useEffect(() => {
        if (!gameRef.current) {
            const config = {
                ...ZERO_G_CONFIG,
                scene: [BattleScene],
                parent: 'phaser-container'
            };
            gameRef.current = new Phaser.Game(config);

            // Listen for Game Events
            gameRef.current.events.on('prana-update', (val: number) => {
                setPrana(val);
            });
        }

        return () => {
            gameRef.current?.destroy(true);
            gameRef.current = null;
        };
    }, []);

    const handleDragStart = (type: 'tank' | 'sniper' | 'swarm') => {
        setSelectedUnit(type);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (!selectedUnit || !gameRef.current) return;

        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gameRef.current.events.emit('spawn-unit', {
            type: selectedUnit,
            x,
            y,
            team: 'player'
        });

        setSelectedUnit(null);
    };

    return (
        <div className="h-screen bg-slate-900 flex flex-col relative">
            {/* Header */}
            <div className="h-16 bg-black/50 flex justify-between items-center px-4 z-20 border-b border-white/10">
                <button onClick={onExit} className="text-white bg-red-600 px-4 py-1 rounded hover:bg-red-700">Exit Zero-G</button>
                <div className="text-xl font-bold text-blue-400">ZERO-G KSHETRA</div>
                <div className="text-white font-mono">Prana: {prana}/10</div>
            </div>

            {/* Game Container overlaying Drag Area */}
            <div className="flex-1 relative overflow-hidden"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}>

                {/* Phaser mounts here */}
                <div id="phaser-container" className="absolute inset-0 z-0" />

                {/* UI Overlay */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 p-4 rounded-xl border border-blue-500/30 flex gap-4 z-10">
                    <div
                        draggable
                        onDragStart={() => handleDragStart('tank')}
                        className="w-16 h-16 bg-blue-900 rounded border border-blue-400 flex items-center justify-center cursor-grab hover:scale-105 transition-transform"
                    >
                        🛡️
                        <span className="absolute bottom-0 text-[10px] text-white">Gada</span>
                    </div>
                    <div
                        draggable
                        onDragStart={() => handleDragStart('sniper')}
                        className="w-16 h-16 bg-green-900 rounded border border-green-400 flex items-center justify-center cursor-grab hover:scale-105 transition-transform"
                    >
                        🏹
                        <span className="absolute bottom-0 text-[10px] text-white">Dhanush</span>
                    </div>
                    <div
                        draggable
                        onDragStart={() => handleDragStart('swarm')}
                        className="w-16 h-16 bg-yellow-900 rounded border border-yellow-400 flex items-center justify-center cursor-grab hover:scale-105 transition-transform"
                    >
                        🛸
                        <span className="absolute bottom-0 text-[10px] text-white">Chakra</span>
                    </div>
                </div>
            </div>

            {/* Prana Bar */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-800">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${prana * 10}%` }} />
            </div>
        </div>
    );
};
