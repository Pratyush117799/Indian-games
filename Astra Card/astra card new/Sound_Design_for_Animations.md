# ASTRA: Weapons of the Gods – Sound Design for Animations

## Overall Sound Design Philosophy
- **Core Theme**: Evoke the majesty of Indian mythology through a blend of ancient Vedic authenticity and epic cinematic fantasy. Sounds should feel divine, resonant, and immersive – like invoking astras in a sacred ritual. Draw from traditional Indian instruments and natural elements while layering modern polished effects for clarity and impact.
- **Key Influences**:
  - **Traditional**: Vedic mantras (deep male/female choral "Om" or "Hum"), shankh (conch shell blows), ghanta (temple bells), damaru (Shiva's rhythmic drum), bansuri (flute melodies), sitar/veena plucks, tabla rhythms.
  - **Elemental**: Fire (crackling flames, whooshes), Water (rippling flows, splashes), Wind (howling gusts, chimes), Thunder (deep rumbles, cracks), Divine (ethereal choirs, reverb-heavy glows).
  - **Cinematic**: Hans Zimmer-style deep braams for tension, orchestral swells for victories, subtle reverb tails for cosmic scale.
- **Audio Principles**:
  - **Layering**: UI feedback (sharp, foreground), ambient immersion (subtle, background), and impactful events (layered with stingers).
  - **Sync Precision**: Tight timing with visuals (e.g., shankh blow on card play peak, thunder crack on impact).
  - **Dynamic Range**: Quiet moments serene (soft flutes), epic plays explosive (full orchestral hit with reverb).
  - **Cultural Authenticity**: Use real recordings of ragas/mantras where possible; avoid clichés – focus on reverence (e.g., no over-the-top "Bollywood" flair).
  - **Accessibility**: Full volume slider controls (Music, SFX, Voice). Mute option with visual feedback only. Subtitles for any voiced mantras.
  - **File Format/Tech**: WAV/OGG for SFX, adaptive music system (FMOD/Wwise) for layering tracks that react to game state (e.g., intensify during supreme weapon play).
- **Volume Guidelines**: UI clicks 70–80% max, ambient 30–50%, epic events 100% with ducking (music lowers during key SFX).

## Global Sound Effects
- **Screen Transitions**: Soft veena pluck fading into shankh swell (low-to-high pitch), with subtle mantra choir fade (0.6s dissolve sync).
- **Button Hover**: Gentle sitar string bend upward or temple bell chime (soft ding with harmonic overtones).
- **Button Press/Confirm**: Crisp tabla hit or damaru roll, followed by golden "seal" stamp thud with light reverb.
- **Loading**: Slow rotating mantra chant ("Om Namah Shivaya" layered loop) with rising bansuri melody and particle-like wind chimes.
- **Notifications/Rewards**: Triumphant shankh blast (short), followed by cascading ghanta bells and sparkling veena arpeggio.
- **Card Entrance/Invocation**: Universal "mantra rise" – deep choral "Aum" building with energy whoosh, peaking in element-specific stinger (fire roar, lightning crack).
- **Error/Negative Feedback**: Low damaru thud with dissonant sitar scrape and fading echo (subtle, non-punishing).

## 1. Main Menu Screen
- **Ambient Loop**: Serene bansuri flute melody in Raga Bhimpalasi (calm, meditative) layered with distant temple bells and soft cosmic hum.
- **Title Entrance**: Deep choral mantra assembly (syllables building to full "Astra") with rising orchestral swell and final ghanta gong.
- **Button Interactions**: Hover – soft veena pluck harmonic; Press – satisfying damaru snap with mode-specific accent (bow twang for Classic, weapon clash for Clash).
- **Daily Rewards Lotus**: Idle gentle wind chimes; Hover/Claim – blooming shankh swell with nectar pour bubbles and reward jingle (upward sitar scale).

## 2. Mode Selection / Lobby Screen
- **Ambient**: Dual-layer music – Classic side soft veena raga (peaceful), Clash side building tabla rhythm with distant war drums (intensity ramps on toggle).
- **Mode Toggle**: Chakra spin whoosh with shankh direction change (left/right pitch shift) and music crossfade swell.
- **Quick Play Press**: Epic conch battle call (long shankh blow) transitioning to war chant buildup.
- **Friends/Message Notifications**: Soft flute notification ping with mantra whisper ("Sandesh" voiced subtly).

## 3. Deck Builder Screen
- **Ambient**: Calm library raga on santoors (plucked strings) with page-turn rustles and floating scroll wind.
- **Card Drag/Snap**: Whoosh trail with element accent (fire crackle drag); Snap – golden lock seal with damaru confirmation and chakra ding.
- **Filter Activation**: Tabla rhythm accent matching filter (thunder rumble for Thunder element).
- **Card Hover Preview**: Subtle aura hum rising, with ability-specific mantra whisper (voiced ancient Sanskrit line from flavor text).

## 4. Card Collection / Detail View Screen
- **Ambient**: Ethereal choir hum with distant ghanta echoes, intensifying on Mythic cards.
- **Card Grid Idle**: Very subtle holographic shimmer (high-frequency crystal chimes, layered softly).
- **Card Open/Detail**: Invocation mantra full chant (short, card-specific element voiceover) with page-turn scroll unroll.
- **Upgrade/Craft**: Building energy braam, shard absorption suction whoosh, then explosive upgrade fanfare (orchestral hit with veena flourish and level-up bells).

## 5. Classic Mode Battle Screen
- **Ambient Music**: Epic orchestral raga blend – starts serene (sitar leads), builds tension with tabla during battle phase.
- **Mantra Gain**: Soft nectar pour bubble with rising veena note and "ping" chime per orb.
- **Card Play**: Dramatic mantra invocation chant (voiced "Om [Weapon Name]") with element explosion (e.g., Agneyastra fire roar whoosh).
- **Combat Clash**: Weapon swing whoosh, impact clash (metal/thunder/divine boom), counter neutralization – mutual annihilation nova with deep braam and fading choir.
- **Phase Change**: Trinity rotation with damaru roll and phase name voiced in Sanskrit whisper.
- **End Turn/Victory**: Lotus bloom soft chimes; Win – triumphant shankh fanfare with full choral "Jaya" victory chant.

## 6. Clash Mode Battlefield Screen
- **Ambient**: Dynamic war score – constant low tabla war drums, intensifying with unit count; river flow water loop in center.
- **Mantra Fill**: Nectar drip splashes building to orb complete chime.
- **Deployment**: Unit materialize with divine drop thud and march footstep rhythm (element footsteps: fire crackles, water squelches).
- **Unit Attacks/Projectiles**: Swing/clash impacts (weapon-specific: Vajra thunder crack, arrow twangs); Projectiles – whoosh trails with element accents.
- **Tower Damage/Destruction**: Crown crack fractures (glass shatter with jewel tones), full destroy – massive explosion with debris fall and victory swell buildup.
- **Timer Low**: Incense flame intensifying crackle with urgent tabla acceleration.

## 7. Shop / Progression Screen
- **Ambient**: Uplifting veena/sitar marketplace raga with coin clinks and gem sparkles.
- **Bundle Interactions**: Chest lower chain rattle; Hover open – treasure reveal with overflowing coin pour and gem tinkles.
- **Purchase**: Divine approval shankh (positive), reward explosion with cascading bells and upward orchestral flourish.
- **Level-Up**: Chakra fill with rising mantra choir and triumphant ghanta gong series.

## 8. Profile / Achievements Screen
- **Ambient**: Personal heroic theme – solo bansuri melody personalizing to selected avatar (e.g., bow twang accents for Arjuna).
- **Achievement Unlock**: Sudden golden engraving chisel scrape, then reveal fanfare (shankh + bells) with "Siddhi" voiced achievement.
- **Stats Count-Up**: Soft ticking veena plucks syncing to numbers, final settle with harmonious chord.

These sound guidelines sync perfectly with the visual animations, creating a fully immersive audio-visual experience rooted in Indian mythology. Prioritize cultural sensitivity in recordings (authentic ragas, respectful mantras). For prototyping, start with core interactions (card play, deployments) using free libraries like Freesound (tagged "Indian instruments") or premium packs (Epic Stock Media mythological sets).