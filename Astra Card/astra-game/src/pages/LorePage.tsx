import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export const LorePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-serif">
            <nav className="p-6 border-b border-white/10 bg-black/50 backdrop-blur sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full"><ArrowLeft /></button>
                    <h1 className="text-2xl font-bold font-sans">Mythology Archives</h1>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Expansion 1 */}
                <section className="mb-24">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-1 h-12 bg-purple-500" />
                        <h2 className="text-4xl font-bold text-purple-400 font-sans">Celestial Storm</h2>
                    </div>
                    <p className="text-xl text-gray-300 leading-relaxed mb-8">
                        The heavens rumble as Indra, the King of Gods, unveils his arsenal.
                        This expansion introduces 25 new weapons focused on weather control, time manipulation, and cosmic power.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <LoreCard
                            title="Vajra (Thunderbolt)"
                            subtitle="Slay the Demon Vritra"
                            desc="Forged from the bones of Sage Dadhichi, the Vajra is the indestructible weapon of Indra. It represents the righteous power of kingship and the ultimate sacrifice."
                        />
                        <LoreCard
                            title="Brahmashirsha"
                            subtitle="The Four-Headed Weapon"
                            desc="A variant of the Brahmastra with four times the power. Its invocation alone causes cosmic tremors. Capable of destroying the world if left unchecked."
                        />
                    </div>
                </section>

                {/* Expansion 2 */}
                <section className="mb-24">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-1 h-12 bg-red-500" />
                        <h2 className="text-4xl font-bold text-red-500 font-sans">Divine Feminine</h2>
                    </div>
                    <p className="text-xl text-gray-300 leading-relaxed mb-8">
                        The Shakti awakens. Witness the fierce power of Durga and Kali as they descend to defeat the demons that no god could slay.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <LoreCard
                            title="Durga's Trishul"
                            subtitle="Union of All Powers"
                            desc="Gifted by Shiva, this trident channelled the collective energy of the Trimurti to slay Mahishasura."
                        />
                        <LoreCard
                            title="Kali's Khadga"
                            subtitle="The Sword of Time"
                            desc="A blade that severs the ego and destroys time itself. Wielded by the fiercest form of the Mother Goddess."
                        />
                    </div>
                </section>
            </main>
        </div>
    );
};

const LoreCard = ({ title, subtitle, desc }: any) => (
    <div className="bg-white/5 p-8 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
        <h3 className="text-2xl font-bold text-astra-gold mb-1 font-sans">{title}</h3>
        <div className="text-sm text-gray-500 italic mb-4">{subtitle}</div>
        <p className="text-gray-300 leading-relaxed">{desc}</p>
    </div>
);
