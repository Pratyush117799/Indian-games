import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Sword, BookOpen, Rocket } from 'lucide-react';

interface LandingPageProps {
    onNavigate: (view: 'lore' | 'play' | 'home') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
                <div className="text-2xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-astra-gold to-yellow-200">ASTRA</div>
                <div className="flex gap-8">
                    <button onClick={() => onNavigate('home')} className="hover:text-astra-gold transition-colors">Home</button>
                    <button onClick={() => onNavigate('lore')} className="hover:text-astra-gold transition-colors">Lore</button>
                    <button onClick={() => onNavigate('play')} className="bg-white text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform">PLAY NOW</button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative h-screen flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2622')] bg-cover bg-center opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

                <motion.div
                    style={{ y: y1 }}
                    className="relative z-10 text-center px-4"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="text-7xl md:text-9xl font-black mb-6 tracking-tight"
                    >
                        WEAPONS<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600">OF THE GODS</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10"
                    >
                        Command the Astras. Rewrite the Epics. The ultimate mythology strategy game is here.
                    </motion.p>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onNavigate('play')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 px-12 py-4 rounded-lg font-bold text-xl shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-white/20"
                    >
                        ENTER THE BATTLEFIELD
                    </motion.button>
                </motion.div>
            </header>

            {/* Features Carousel */}
            <section className="py-32 relative">
                <div className="absolute inset-0 bg-slate-900/50 skew-y-3 transform origin-top-left -z-10" />
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <FeatureCard
                        icon={<Sword className="w-12 h-12 text-red-400" />}
                        title="Epic Duels"
                        desc="Master the elemental counters and tier hierarchy in strategic 1v1 card combat."
                    />
                    <FeatureCard
                        icon={<Rocket className="w-12 h-12 text-blue-400" />}
                        title="Zero-G Physics"
                        desc="Experience the new Kshetra mode with realistic recoil and zero-gravity mechanics."
                    />
                    <FeatureCard
                        icon={<BookOpen className="w-12 h-12 text-yellow-400" />}
                        title="Deep Lore"
                        desc="Explore the origins of Brahmastra, Pashupatastra, and 200+ mythological weapons."
                        onClick={() => onNavigate('lore')}
                    />
                </div>
            </section>

            {/* Expansion Teaser */}
            <section className="py-32 bg-black relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                            CELESTIAL STORM
                        </h2>
                        <h3 className="text-2xl text-white/80">Expansion Pack 1 Available Now</h3>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Discover the power of Indra's thunderbolts and the cosmic weapons of the heavens.
                            Features 25 new Supreme and Celestial tier cards that manipulate weather and time.
                        </p>
                        <button onClick={() => onNavigate('lore')} className="text-purple-400 font-bold hover:text-purple-300 flex items-center gap-2 group">
                            Explore Collection <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>

                    <motion.div
                        style={{ y: y2 }}
                        className="flex-1 relative"
                    >
                        {/* Placeholder for Box Art */}
                        <div className="w-[400px] h-[500px] bg-gradient-to-br from-purple-900 to-slate-900 border border-purple-500/30 rounded-xl relative shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 group">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-32 h-32 text-purple-400/20 group-hover:text-purple-400/50 transition-colors" />
                            </div>
                            <div className="absolute bottom-8 left-8">
                                <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Expansion Set 01</div>
                                <div className="text-4xl font-black italic">STORM</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 border-t border-white/10 py-12 text-center text-gray-500 text-sm">
                <p>&copy; 2026 Astra Games. Inspired by Indian Mythology.</p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, onClick }: any) => (
    <motion.div
        whileHover={{ y: -10 }}
        onClick={onClick}
        className={`bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
    >
        <div className="mb-6">{icon}</div>
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
    </motion.div>
);
