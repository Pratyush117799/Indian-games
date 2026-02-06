import React, { useState, useMemo } from 'react';
import { Weapon } from '../types';
import { Card } from './Card';
import { Search, Filter, Swords } from 'lucide-react';
import weaponsData from '../data/weapons.json';

const allWeapons = weaponsData as Weapon[];

interface DeckBuilderProps {
    onDeckSave: (deck: Weapon[]) => void;
    onBack: () => void;
}

export const DeckBuilder: React.FC<DeckBuilderProps> = ({ onDeckSave, onBack }) => {
    const [deck, setDeck] = useState<Weapon[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTier, setFilterTier] = useState<string>('All');

    const filteredWeapons = useMemo(() => {
        return allWeapons.filter(w => {
            const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                w.element.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTier = filterTier === 'All' || w.tier === filterTier;
            return matchesSearch && matchesTier;
        });
    }, [searchTerm, filterTier]);

    const addToDeck = (weapon: Weapon) => {
        if (deck.length >= 30) return; // Max 30 cards
        if (deck.filter(w => w.id === weapon.id).length >= 3) return; // Max 3 copies
        setDeck([...deck, weapon]);
    };

    const removeFromDeck = (index: number) => {
        const newDeck = [...deck];
        newDeck.splice(index, 1);
        setDeck(newDeck);
    };

    const stats = useMemo(() => {
        const power = deck.reduce((acc, curr) => acc + curr.power, 0);
        const avgCost = deck.length ? (deck.reduce((acc, curr) => acc + curr.mantraCost, 0) / deck.length).toFixed(1) : 0;
        const divines = deck.filter(c => c.tier === 'Supreme' || c.tier === 'Celestial').length;
        return { power, avgCost, divines };
    }, [deck]);

    return (
        <div className="h-screen bg-black/90 text-white flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gray-900">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="text-gray-400 hover:text-white">&larr; Back</button>
                    <h2 className="text-xl font-bold text-astra-gold">Armory</h2>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search weapons..."
                            className="bg-gray-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-astra-gold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="bg-gray-800 rounded-full px-4 py-2 text-sm border-none"
                        value={filterTier}
                        onChange={(e) => setFilterTier(e.target.value)}
                    >
                        <option value="All">All Tiers</option>
                        <option value="Supreme">Supreme</option>
                        <option value="Celestial">Celestial</option>
                        <option value="Elemental">Elemental</option>
                    </select>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right text-xs text-gray-400">
                        <div>{deck.length}/30 Cards</div>
                        <div>Avg Cost: {stats.avgCost}</div>
                    </div>
                    <button
                        onClick={() => onDeckSave(deck)}
                        disabled={deck.length < 10}
                        className="bg-astra-gold text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-400 disabled:opacity-50"
                    >
                        SAVE DECK
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Collection View (Left) */}
                <div className="flex-1 p-6 overflow-y-auto bg-grid-pattern">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredWeapons.map((weapon) => (
                            <div key={weapon.id} onClick={() => addToDeck(weapon)} className="transform hover:scale-105 transition-transform duration-200">
                                {/* Using a mini version of Card for performance, or scale down */}
                                <div className="relative pointer-events-none transform scale-75 origin-top-left w-[300px] h-[450px] mb-[-100px] mr-[-60px]">
                                    <Card data={weapon} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Current Deck (Right) */}
                <div className="w-80 bg-gray-900 border-l border-white/10 flex flex-col">
                    <div className="p-4 bg-gray-800 font-bold border-b border-white/5">
                        Current Loadout
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {deck.length === 0 && (
                            <div className="text-center text-gray-500 mt-10">
                                <Swords className="mx-auto mb-2 opacity-50" />
                                Select cards to add
                            </div>
                        )}
                        {deck.map((card, idx) => (
                            <div key={idx} className="bg-gray-800 p-2 rounded flex justify-between items-center group hover:bg-gray-700">
                                <div>
                                    <div className="text-sm font-bold text-gray-200">{card.name}</div>
                                    <div className="text-[10px] text-gray-500">{card.tier} • {card.mantraCost}⚡</div>
                                </div>
                                <button
                                    onClick={() => removeFromDeck(idx)}
                                    className="text-red-500 opacity-0 group-hover:opacity-100 px-2"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* Stats Footer */}
                    <div className="p-4 bg-gray-800 text-xs text-gray-400 space-y-1">
                        <div className="flex justify-between"><span>Supreme/Celestial:</span> <span>{stats.divines}</span></div>
                        <div className="flex justify-between"><span>Total Power:</span> <span>{stats.power}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
