# ASTRA: Weapons of the Gods – UI Animation Effects Guidelines

## Overall Animation Philosophy
- **Core Theme**: Animations evoke divine invocation – subtle, majestic, and tied to Indian mythology. Use mantra-like particle flows, chakra spins, lotus blooms, and elemental bursts (fire embers, water ripples, wind gusts, thunder cracks) for feedback.
- **Principles**:
  - **Fluid & Elegant**: Ease-in-out curves (cubic-bezier(0.4, 0, 0.2, 1) for most), with sacred slowness for premium feel – no jarring snaps.
  - **Performance**: Lightweight for mobile (60fps target). Use CSS/WebGL where possible; particle systems limited to key moments.
  - **Audio Sync**: Pair with Vedic hums, chimes, thunder, or flute notes (e.g., mantra chant on card play).
  - **Accessibility**: Option to reduce motion; high-contrast glows for visibility.
  - **Dynamic Layers**: Foreground particles (sparks, auras), mid-ground element motion, background subtle parallax (cosmic drift).
- **Tools/Tech**: Framer Motion or Lottie for React; Spine or Phaser particles for game screens; CSS keyframes for simple hovers.

## Global Animation Effects
- **Screen Transitions**: Dissolving mandala wipe (golden lotus petals unfurling/receding) with soft glow fade (0.6s duration).
- **Button Hover/Press**: Scale up 1.1x with golden border pulse, subtle deity silhouette fade-in, element particles emitting (e.g., fire for aggressive buttons).
- **Loading States**: Rotating chakra wheel with filling mantra nectar and floating Om particles.
- **Notifications**: Pop-up as ancient scroll unrolling with golden seal break and soft chime.
- **Card Entrance**: Cards "invoke" with upward float from bottom, golden invocation circle beneath pulsing once, then element aura settles.

## 1. Main Menu Screen
- **Background Idle**: Slow cosmic drift parallax (stars/nebulae moving subtly), faint Vishnu silhouette breathing (gentle scale pulse every 8s).
- **Title Entrance**: Letters materialize with golden particle trails assembling from mantra dust, then subtle glow pulse sync'd to ambient hum.
- **Button Entrance**: Buttons bloom like lotuses from center mandala (sequential 0.2s stagger), idle gentle float up/down.
- **Button Interaction**: Hover – chakra spin behind icon accelerates, golden rim flare; Press – inward divine energy implosion with ripple, then pop feedback.
- **Profile/Shop Icons**: Idle sparkle rotation; hover – gem/gear enlarges with particle burst (gems sparkle more intensely).
- **Daily Rewards Lotus**: Constant gentle pulse and petal sway, stronger bloom animation on hover (full open with nectar drip particles).

## 2. Mode Selection / Lobby Screen
- **Background Split Transition**: Smooth crossfade with energy wave divider (golden trident line sweeping across).
- **Mode Toggle Chakra**: Rotate with satisfying click stops, emitting element particles matching selected mode (serene mist for Classic, war sparks for Clash).
- **Featured Banners**: Carousel slide with ancient scroll unroll effect, holographic card previews inside rotating slowly.
- **Quick Play Button**: Idle fiery script pulse breathing; hover – flame trail around text; press – explosive invocation flash with battlefield roar SFX.
- **Friends List**: Avatars fade in sequentially; online halo pulses gently; new message – subtle mantra notification bubble rising.
- **Navigation Bar**: Persistent with subtle glow underline sliding on tab change.

## 3. Deck Builder Screen
- **Panel Entrances**: Left/right panels slide in from sides with golden trail; central canvas blooms as mandala expanding.
- **Card Grid**: Cards lazy-load with staggered upward float and invocation circle flash.
- **Drag-and-Drop**: Dragged card lifts with 3D tilt (Framer Motion spring), ghost trail of element particles; snap to slot – golden lock-in pulse and chakra seal stamp.
- **Stats Charts**: Pie fill with glowing sector bloom; curve graph lines draw in with divine light trail.
- **Filter Buttons**: Press – chakra depression with spin and element burst matching filter.
- **Card Hover Preview**: Card enlarges/tilts forward with 3D flip optional, aura intensifies, particles emit strongly; ability text scrolls in as ancient script revealing.

## 4. Card Collection / Detail View Screen
- **Grid Idle**: Cards subtly breathe (scale 1–1.05x sync'd to slow pulse), Mythic with constant holographic shimmer shift.
- **Filter Activation**: Selected filter glows and emits radial mantra particles.
- **Card Tap/Open**: Full-screen expand with invocation vortex swirl (card spins in from grid position), then settles with element aura stabilization.
- **Detail View Interactions**: Stats orbs fill sequentially with nectar pour animation; ability text fades in line-by-line with soft glow reveal.
- **Craft/Upgrade**: Button press – divine shard particles sucked into card, then explosive upgrade flash with level-up chakra spin and new foil application animation.
- **Background Pedestals**: Slow rotation with god ray sweeps.

## 5. Classic Mode Battle Screen
- **Field Setup**: Opponent/player sides fade in from cosmic mist; life orbs descend and lock with golden chime.
- **Mantra Gain**: Each turn +1 orb fills with blue-gold nectar pour and soft bubble pop SFX.
- **Card Play**: Drag from hand – invocation circle appears on field, card slams down with impact ripple and element explosion (fire burst, water splash).
- **Artifact Idle**: Gentle float and aura pulse; health bar as jeweled frame with damage chip cracks.
- **Battle Phase Attack**: Selected artifact charges forward with motion trail, clash – energy beams collide with mythological counter explosion (mutual destruction = nova burst).
- **Phase Indicator**: Trinity symbols rotate smoothly with phase name blooming in Sanskrit/Gold.
- **End Turn Lotus**: Idle sway; press – full bloom with petal scatter and mantra particles rising to opponent.

## 6. Clash Mode Battlefield Screen
- **Lane Idle**: Subtle river flow animation with lotus drift; towers breathe gently with vimana light pulses.
- **Mantra Bar Fill**: Nectar drops drip every 2.5s with splash ripple and orb glow intensify.
- **Card Hand**: Cards fan in with invocation float; low-cost cards subtle eager bounce idle.
- **Deployment**: Drag – ghost unit preview marches path; release – unit materializes with divine drop flash and element trail start.
- **Unit Movement**: March with footstep dust/element trail; attack – weapon swing with impact particles and damage numbers as glowing Sanskrit numerals rising.
- **Projectiles**: Element-specific (Vajra lightning streak, Agneyastra fireball roll with ember tail).
- **Tower Damage**: Crown jewels crack/shatter sequentially; destruction – explosive collapse with debris and victory fanfare buildup.
- **Timer Incense**: Smoke trail rising realistically, flame flicker intensifying near end.

## 7. Shop / Progression Screen
- **Bundle Entrance**: Chests descend with golden chain lower, then gentle bounce settle.
- **Featured Bundle Hover**: Chest lid cracks open slightly with overflowing particles (cards/gems floating out).
- **Purchase Press**: Divine light beam from sky, shards sucked in, then reward explosion with confetti-like mantra petals.
- **Progression Chakra Ladder**: Level-up – current tier spins and fills with radiant gold, unlocking reward icons blooming sequentially.
- **Currency Icons**: Idle subtle spin and sparkle pulse.

## 8. Profile / Achievements Screen
- **Avatar Entrance**: Hero materializes with heroic pose animation (e.g., bow draw for Arjuna) and aura flare.
- **Stats Reveal**: Numbers count up with golden tick sounds and final glow settle.
- **Achievements Mandala**: Locked plaques faint pulse; unlock – sudden golden engraving reveal with chakra spin and triumphant chime.
- **Season Rank**: Ladder climb animation on update – avatar ascends with trail particles and tier name bloom.

These animation guidelines create an immersive, culturally resonant experience while providing clear feedback. They balance spectacle with usability – epic for key moments (invocations, victories), subtle for idle states. For implementation, prioritize core interactions first (card play/deployment) in prototyping.
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
# ASTRA: Weapons of the Gods – Voice Acting Guidelines for Mantras

## Overall Voice Acting Philosophy
- **Core Theme**: Mantras are the heart of invoking divine weapons – they must feel ancient, sacred, and powerful, evoking the ritualistic gravity of Vedic recitation. Voice acting should blend authentic Sanskrit phonetics with cinematic drama, making each invocation feel like a genuine astral activation.
- **Authenticity & Respect**: Use accurate or closely inspired Sanskrit phrasing where possible (drawn from Mahabharata, Ramayana, and Puranic references). Pronunciation guided by classical Vedic style (rolled 'r', aspirated consonants, elongated vowels). Avoid caricature – aim for reverence and intensity.
- **Voice Archetypes**:
  - **Destructive/Supreme (Shiva-linked)**: Deep, resonant male voice (baritone/bass) with gravelly intensity and echoing reverb – like a thunderous sage (e.g., think Ashwatthama's fury).
  - **Preservative/Divine (Vishnu-linked)**: Calm, authoritative male voice with warm mid-tones and ethereal choir layering – serene yet commanding.
  - **Fierce/Celestial (Indra/Warrior)**: Energetic, bold male voice with sharp enunciation and rising pitch – battle-ready heroism.
  - **Feminine/Divine Shakti**: Powerful female alto/soprano for goddess weapons – fierce and nurturing blend.
  - **Elemental/Illusion**: Varied – whispering for illusion, roaring for fire, flowing for water.
  - **Choral Layers**: Supreme weapons add multi-voice choir (male/female harmonic "Om" swells) for cosmic scale.
- **Delivery Style**:
  - **Build-Up**: Start low/slow (ritual preparation), crescendo to peak intensity (release of power).
  - **Effects**: Heavy cathedral reverb, subtle delay echoes, elemental overlays (fire crackle in voice, thunder rumble undertone).
  - **Length**: 3–8 seconds (short for common cards, longer/epic for supreme).
  - **Language**: Primarily Sanskrit (phonetic English transliteration provided for actors). Optional subtle English whisper echo for accessibility.
  - **Casting Notes**: Native Sanskrit scholars or trained Vedic chanters preferred; Indian accents for authenticity (e.g., North Indian classical style).
- **Technical Specs**: Recorded at 48kHz/24-bit; dry takes + processed versions (reverb, pitch shifts for divine feel). Volume normalized with dynamic peaks for impact.

## Global Mantra Elements
- **Invocation Prefix**: Most start with "Om" or "Phat" (explosive release) – deep choral "Aum" swell as base layer.
- **Suffix**: End with "Hum Phat Swaha" (offering/release) for activation burst.
- **Sync with Animations**: Voice peaks align with visual energy climax (e.g., weapon materialization flash).

## Supreme Tier Mantras (1–12)
1. **Brahmastra**  
   **Voice**: Deep bass male sage (furious yet controlled, like impending doom). Choral backing intensifies.  
   **Sample Line**: "Om Brahmane Namah... Astraaya Phat! Hum Phat Swaha!" (Build slow, explode on "Phat").  
   **Direction**: Whispered start, rising to roaring crescendo with cosmic echo; undertone of infinite serpent hiss.

2. **Brahmashirsha Astra**  
   **Voice**: Same bass, but more apocalyptic – layered with four harmonic voices (representing four heads).  
   **Sample Line**: "Om Chaturmukhaya Brahmane Namah... Shirsha Astraaya Hum Phat!"  
   **Direction**: Multi-tracked for quadrophonic feel; destructive rumble low-end, final "Phat" with world-ending reverb tail.

3. **Pashupatastra**  
   **Voice**: Gravelly Shiva-esque baritone (intense, ascetic fury). Subtle damaru drum echo in voice.  
   **Sample Line**: "Om Tryambakaya Namah... Pashupataye Astraaya Phat Swaha!"  
   **Direction**: Rhythmic pulsing (Nataraja dance vibe), third-eye intensity peak with dissolution whoosh.

4. **Narayanastra**  
   **Voice**: Serene mid-tenor (Vishnu's calm authority), layered soft female choir.  
   **Sample Line**: "Om Namo Narayanaya... Astraaya Vishnave Phat!"  
   **Direction**: Flowing, unstoppable build like missile shower; gentle start, relentless crescendo.

5. **Sudarshana Chakra**  
   **Voice**: Commanding male with sharp precision (justice edge). Spinning echo effect.  
   **Sample Line**: "Om Sudarshanaaya Vidmahe... Chakraaya Dhimahi Tanno Vishnu Prachodayaat Phat!"  
   **Direction**: Rapid spin modulation in voice; pursuit intensity with rotating pan.

6. **Vaishnavastra**  
   **Voice**: Warm, protective tenor with nurturing undertones.  
   **Sample Line**: "Om Vishnave Namah... Vaishnava Astraaya Swaha!"  
   **Direction**: Calming waves, shield-like resonance; soft choral harmony.

7. **Maheswarastra**  
   **Voice**: Deep Shiva bass with ash-smeared rasp.  
   **Sample Line**: "Om Maheshwaraaya Namah... Astraaya Hum Phat!"  
   **Direction**: Primal dissolution growl; fading echo like reality erasing.

8. **Trishula**  
   **Voice**: Fierce baritone with piercing clarity.  
   **Sample Line**: "Om Trishulaaya Namah... Tryambakaya Phat!"  
   **Direction**: Triple-layered delivery (one per prong); sharp "pierce" impact.

9. **Vajrayudha**  
   **Voice**: Bold, thunderous male (Indra's roar).  
   **Sample Line**: "Om Vajraaya Vidmahe... Indraaya Dhimahi Tanno Vajram Prachodayaat Phat!"  
   **Direction**: Crackling electricity in voice; storm rumble build to lightning strike peak.

10. **Gandiva**  
    **Voice**: Heroic warrior tenor (Arjuna-like confidence).  
    **Sample Line**: "Om Gandivaaya Namah... Agneya Dhanushe Phat!"  
    **Direction**: Bow twang resonance; inexhaustible energy swell.

11. **Pinaka**  
    **Voice**: Ancient, mountain-shaking bass.  
    **Sample Line**: "Om Pinakaaya Namah... Shiva Dhanushe Hum Phat!"  
    **Direction**: Vibration rumble (mountain shatter undertone).

12. **Kalki Ratnamaru**  
    **Voice**: Prophetic, intense male with future-echo.  
    **Sample Line**: "Om Kalkine Namah... Ratnamaru Khadgaaya Phat Swaha!"  
    **Direction**: Apocalyptic fire; judgment finality with choral end-times swell.

## Selected Expansion/Elemental Mantras
101. **Indrastra**  
    **Voice**: Thunderous Indra style.  
    **Sample**: "Om Indraaya Namah... Meghavaahanaaya Phat!"

102. **Vajrayudha** (Variant)  
    **Voice**: Impact-focused.  
    **Sample**: "Om Vajra Hastaya Phat!"

103–112. **Celestial/Astral**  
    - General: Ethereal male/female mix; starry reverb (e.g., Chandra Astra: Soothing lunar female whisper "Om Somaya Namah").

113. **Mohanastra**  
    **Voice**: Hypnotic female alto (enchanting, seductive).  
    **Sample**: "Om Mohanaaya Vidmahe... Sammohini Devyai Phat!"

114–116. **Illusion/Sleep/Desire**  
    - Whispered delivery with swirling echoes (e.g., Nidra Astra: Yawning, drowsy female "Om Nidra Devyai Swaha").

## Production Notes
- **Recording Sessions**: Provide actors with phonetic guides (IAST transliteration) and context clips from epics.
- **Variants**: Multiple takes – normal, low health (desperate), combo (layered with previous).
- **Localization**: Sanskrit core + optional dubbed translations for global markets.
- **Edge Cases**: Supreme weapons – rare, longer chants; muted in practice mode for speed.

This creates an authentic, immersive audio layer – mantras that make playing a card feel like wielding true divine power.
# ASTRA: Weapons of the Gods – Enhanced UI Design Prompts & Feature Explanations

## Overall Design Philosophy & Technical Guidelines
The UI for **ASTRA** must deeply integrate Indian mythological authenticity with modern, intuitive digital card game mechanics. Every element should evoke divine grandeur—temple carvings, chakra wheels, lotus blooms, cosmic auras—while ensuring seamless functionality across mobile (primary for Clash Mode) and desktop/tablet (optimal for Classic Mode deck building).

**Core Technical Considerations**:
- **Responsiveness**: Mobile-first (portrait for Clash battles, landscape optional for Classic). Safe zones for notches/camera cuts. Scalable vector elements for sharp rendering on all densities.
- **Performance**: Lightweight particle effects (use sprite sheets or GPU-accelerated shaders). 60 FPS target. Load assets progressively.
- **Accessibility**: High contrast ratios (gold on dark indigo), scalable text, color-blind modes (element icons with shapes, not just colors), voice-over support hooks, tap targets ≥48px.
- **Animations**: Subtle but impactful—energy pulses synced to game events (e.g., mantra gain triggers nectar drop particles), card plays with invocation flash and element-specific VFX (fire embers, lightning arcs).
- **Audio Integration**: Vedic ambient music, chant SFX on actions, thunder for powerful plays.
- **Cultural Depth**: All icons/motifs drawn from authentic sources (Om, Trishula, lotus, mandala). Avoid caricature; aim for reverence.
- **Game Context Integration**: UI elements directly reflect mechanics—mantra as elixir, life as chakra orbs, counters as neutralizing energy clashes.

Features are ordered from **major** (core gameplay screens) to **supporting/smaller** (utility overlays), with detailed explanations followed by refined prompts.

## 1. Main Menu Screen (Major – Entry Point & Mode Hub)
**Detailed Explanation**:  
The main menu is the player's first immersion into the divine world. It serves as the central hub for mode selection, profile access, and daily engagement. Technically, it must load quickly (pre-load common assets), support background music fade-in, and handle offline/online states gracefully. Small features like pulsing daily reward button encourage retention. The mandala button layout reinforces cultural symmetry while providing clear navigation. On mobile, buttons are large tap targets; on desktop, hover tooltips show mode previews.

**Refined Prompt**:  
"Highly detailed main menu UI mockup for premium Indian mythology card game 'ASTRA: Weapons of the Gods'. Dark cosmic background with subtle starry nebula gradient and faint preserving Vishnu silhouette in Ananta coils. Central large title 'ASTRA' in ornate golden Cinzel Decorative font with glowing divine aura and rising mantra particle effects (golden Sanskrit letters floating upward). Four primary buttons arranged in perfect mandala symmetry: 'Classic Duel' (icon: ancient scroll and crossed divine bow, tooltip: strategic turn-based battles), 'Clash Battle' (icon: crossed Vajra and Trishula with lightning/flame trails, tooltip: real-time lane warfare), 'Deck Builder' (icon: stacked holographic cards, tooltip: craft your arsenal), 'Collection' (icon: open illuminated manuscript, tooltip: view mythic weapons). Buttons have golden temple-carved borders, hover/tap lift animation with radial glow flare. Bottom persistent bar: Player avatar (customizable hero portrait, e.g., Arjuna with Gandiva) in circular frame with level chakra wheel filling progressively with gold nectar. Daily rewards lotus icon pulsing gently with particle sparkles and notification badge. Top-right: Settings gear incorporating Om symbol, shop gem icon with rotating sparkle animation. Full ornate temple arch framing entire screen with subtle engraved lotus motifs and soft god-ray lighting. Luxurious, immersive, culturally authentic digital fantasy style with high contrast for accessibility, 4k ultra-detailed mockup optimized for both mobile portrait and desktop landscape."

## 2. Classic Mode Battle Screen (Major – Core Gameplay Loop)
**Detailed Explanation**:  
This is the heart of strategic play. Layout mirrors opponent/player symmetry for clarity. Mantra bar must visually sync with turn-based gain (+1 orb fill animation). Field zones limited to 5-7 slots prevent clutter. Combat resolution needs clear VFX pipeline: drag-to-play snap, clash animation with power comparison beams, counter neutralization explosion (mutual destruction particles). Small features: Phase indicator prevents confusion, graveyard peek shows recent plays, end-turn lotus bloom confirms action. Technical: Real-time damage numbers pop-ups, undo buffer for mis-taps (edge case).

**Refined Prompt**:  
"Intricate Classic Mode battle screen UI for turn-based mythological card duel. Symmetrical top-bottom layout: Opponent side (top) with life total as large red-glowing chakra orb (starting 30, depleting with crack effects), hand size counter as veiled scroll stack, field zone of 7 artifact slots with health bars and status icons. Player side mirrored at bottom. Central mandala battlefield mat with drag-and-drop snap zones glowing gold on valid plays. Right sidebar: Mantra pool as vertical elixir bar filling with blue-gold nectar drops (+1 per turn with particle splash animation), current mantra count in large numerals. Large 'End Turn' button as blooming lotus that animates petals opening when pressed, with confirmation ripple. Left sidebar: Deck count as shrinking ancient scroll with card back preview, graveyard stack (tap to fan out recent cards with fade-in). Top center phase indicator: Rotating trinity wheel showing Draw/Main/Battle/End phases with icon and text glow. Dynamic VFX hooks: Card invocation flash with element particles (fire embers, water ripples), combat clash with crossing energy beams and mythological counter explosion (serpent coils for neutralization). Background: Epic Kurukshetra battlefield haze with distant chariots. Strategic, clean UI with deep cultural immersion, high accessibility contrast, 4k detailed mockup."

## 3. Clash Mode Battlefield Screen (Major – Real-Time Core Gameplay)
**Detailed Explanation**:  
Fast-paced vertical mobile layout critical for thumb reachability. Mantra bar at bottom for quick glances. Card hand fanned for one-hand play. Deployment ghost previews prevent misplacements. Towers have distinct health bars (crown depletion animation for wins). Small features: Timer as incense for tension, emote button for social play. Technical: Smooth unit pathing trails, projectile VFX without lag, auto-battle indicators for idle units.

**Refined Prompt**:  
"High-energy Clash Mode battlefield UI optimized for mobile portrait. Vertical layout: Opponent base at top with golden vimana king tower and two crown towers (health as jeweled crowns depleting with gem shatter animation). Player base mirrored at bottom. Two clear lanes divided by central lotus-bridge river with subtle water ripple effects. Bottom center mantra bar: 10 orb slots filling with blue-gold nectar drops every 2.5s (particle splash on gain). Card hand: 5 fanned slots with cost orbs below each, drag-to-deploy with translucent ghost preview and valid zone mandala glow. Deployment zones highlighted per lane. Units show health bars, element trail particles, and auto-attack animations. Top center timer as burning incense stick with trailing smoke. Quick emote button (mandala wheel icon) and surrender seal. Dynamic chaos VFX: Element-specific projectiles (Vajra lightning arcs, Agneyastra fireballs), tower divine beam attacks. Background: Vast war field with distant Kailash peaks and flying garudas. Fast-paced, intuitive mobile battler UI with ornate temple framing and performance-optimized glows, 4k vibrant mockup."

## 4. Deck Builder Screen (Major – Pre-Game Strategy)
**Detailed Explanation**:  
Core customization hub. Drag-and-drop essential with haptic feedback. Stats panel provides balance feedback (element pie prevents mono-decks). Small features: Search with third-eye magnifier, auto-suggest counters. Technical: Offline caching of collection, cloud sync indicator.

**Refined Prompt**:  
"Comprehensive deck builder UI with advanced functionality. Left panel: Filterable collection grid (chakra buttons for tier/element/rarity, search bar as glowing third eye). Central curved mandala canvas with 40 snap slots and running count meter (chakra filling to 40). Right deep stats panel: Element distribution pie with glowing icons, power curve line graph, simulated win rate vs meta. Top bar: Editable deck name with Sanskrit flourish, save/load slots as golden seals, export/share scroll button. Card preview on drag: Enlarged 3D rotating view with element VFX and ability tooltip scroll. Background: Ancient divine library with floating manuscripts and soft golden god rays. Functional yet ornate UI with drag haptic cues and cloud sync indicator, 4k detailed mockup."

## 5. Victory / Defeat Screen (Major – Emotional Closure)
**Detailed Explanation**:  
Critical for player retention. Victory rewards cascade builds dopamine; defeat offers learning without frustration. Small features: MVP card highlight, replay button for analysis.

**Refined Prompt**:  
"Dramatic post-battle results screen. Victory variant: Radiant golden particle explosion with blooming lotuses, player's hero in triumphant pose wielding key weapon, 'Divine Victory!' in massive glowing Cinzel. Rewards cascade animation: Gold coins raining, new cards holographic flip reveal, experience chakra dramatic fill with level-up flare. Defeat variant: Somber crimson ash particles, respectful hero bow, 'Honorable Battle' text with consolation rewards and tip scroll (e.g., 'Consider Garudastra counters'). Shared elements: MVP card highlight, replay/save buttons as glowing scrolls, continue lotus. Background: Transforming battlefield to heavenly realm. Emotional, cinematic UI with epic music swell hooks, 4k mockup."

## 6. Daily Quests / Missions (Supporting – Retention Driver)
**Detailed Explanation**:  
Encourages daily login. Progress bars visualize goals. Small features: Reroll option (limited), claim animation.

**Refined Prompt**:  
"Engaging daily quests UI as vertical scroll of engraved stone tablets (5-7 quests with progress chalice bars). Completed tablets stamped with blooming lotus and reward burst particles. Top refresh timer as incense with smoke trail. 'Claim All' spinning chakra button. Background: Heavenly garden with reward fountains. Motivational with subtle Vedic chimes on claims, 4k mockup."

## 7. Tutorial / Onboarding (Supporting – Accessibility & Learning)
**Detailed Explanation**:  
Guided flow reduces bounce rate. Step-by-step with contextual overlays. Skippable but rewarding completion.

**Refined Prompt**:  
"Multi-step interactive tutorial with Vyasa-sage narrator portrait. Overlays highlight mechanics (mantra gain, card play, counter clash) with guiding arrows and glows. Progress as lotus petal bloom. Background: Serene ashram. Gentle, educational UI with skip option, 4k series mockup."

## 8. In-Battle Emotes / Quick Chat (Small – Social Layer)
**Detailed Explanation**:  
Adds personality without toxicity. Preset cultural emotes prevent misuse. Mute for comfort.

**Refined Prompt**:  
"Radial emote mandala wheel overlay with 8 cultural stickers (namaste, Kali roar, Ganesha laugh). Tap triggers short animation above tower with Vedic phrase bubble. Semi-transparent, quick-close. Fun, respectful social feature, 4k mockup."

## 9. Loading Screens (Small – Downtime Education)
**Detailed Explanation**:  
Turns waits into lore lessons. Rotating tips prevent repetition.

**Refined Prompt**:  
"Educational loading with central mandala spinner and cycling lore tips on ancient scroll. Panning epic background art. Progress as filling divine lamp. Calm, informative UI, 4k variants."

## 10. Settings Menu (Small – Customization)
**Detailed Explanation**:  
Comprehensive but non-overwhelming. Tabbed for navigation. Accessibility prominent.

**Refined Prompt**:  
"Tabbed settings with Audio/Graphics/Controls/Account sections. Sliders with previews, toggles as lotus flips. Background: Meditation chamber. Clean, user-centric UI, 4k mockup."

These refined prompts and explanations provide production-ready depth, balancing cultural reverence, technical precision, and engaging gameplay flow.
# ASTRA: Weapons of the Gods – Additional Essential Features UI Design Prompts

## Overall UI Style Reminder
- Maintain the sacred Indian mythology theme: Ornate golden temple carvings, lotus/chakra motifs, cosmic gradients (indigo-gold), subtle Sanskrit accents, divine glow particles.
- Dynamic Effects: Energy pulses, element-based particles (fire embers, water ripples, thunder sparks), smooth mandala transitions, Vedic chant audio cues.
- Color Palette: Gold (#FFD700), crimson (#C41E3A), sapphire (#0F52BA), emerald (#50C878), divine white glow.
- Typography: Cinzel for titles, Inter for body, Devanagari-inspired for flavor.
- All prompts optimized for 4k mockups, mobile-first where relevant.

## 1. Tutorial / Onboarding Flow
**Prompt**:  
"Interactive tutorial onboarding sequence for mythology card game. First screen: Serene ashram setting with sage narrator (Vyasa-inspired figure) in glowing aura, guiding player through swipe gestures. Step-by-step overlays: Highlight mantra bar filling with nectar drops, card draw animation with golden scroll unrolling, simple combat demo (Agneyastra vs basic sword) with elemental explosion particles and counter text popup. Progress bar as blooming lotus petals. Skip button as subtle Om symbol. Background: Misty Himalayan peaks with floating ancient texts. Gentle guiding arrows with divine glow, voice-over speech bubbles in elegant scroll. Immersive, educational UI with Indian cultural warmth, non-intrusive tooltips, 4k welcoming mockup series."

## 2. Daily Quests / Missions Screen
**Prompt**:  
"Daily quests panel with rewarding feel. Vertical scroll list of 5-7 quests styled as ancient stone tablets with golden engravings (e.g., 'Invoke 3 Fire Astras – Reward: 100 Gold + Divine Shard'). Completed quests show blooming lotus stamp and particle burst. Progress bars as filling soma chalices. Top banner: Daily refresh timer as burning incense stick with smoke trails. Claim All button as large glowing chakra that spins when pressed. Background: Heavenly garden with floating reward chests and soma nectar fountains. Motivational UI with subtle reward sparkles and Vedic achievement chimes, 4k progression mockup."

## 3. Leaderboard / Rankings Screen
**Prompt**:  
"Global and friends leaderboard screen. Tabbed interface: Seasonal (chakra tiers: Brahman gold tier at top), All-Time, Friends. Ranked list with player avatars (hero portraits like Arjuna/Karna), rank numbers as jeweled crowns, win rates as victory laurels, favorite weapon icons glowing. Player's own rank highlighted with radiant golden frame and upward arrow animation if climbing. Top 3 podium with holographic supreme weapons (Brahmastra floating above #1). Background: Grand cosmic hall with starry rankings etched in stone. Competitive yet aspirational UI with rank-up particle celebrations, 4k prestige mockup."

## 4. Multiplayer Matchmaking Lobby
**Prompt**:  
"Multiplayer matchmaking screen for Clash or Classic modes. Central spinning chakra wheel with 'Searching for worthy opponent...' text in fiery script, pulsing divine energy. Player's selected deck preview on left with hero commander portrait. Opponent found animation: Mandala explosion revealing enemy hero with dramatic thunder/flame effects. Ready check buttons as glowing seals. Chat bubble preset emotes (e.g., 'Om Namah Shivaya', 'Jai Shri Ram'). Cancel button subtle. Background: Dual-sided battlefield preview with player/opponent bases. Tense, exciting UI with building mantra particle anticipation, 4k versus mockup."

## 5. In-Battle Emotes / Quick Chat
**Prompt**:  
"In-battle emote wheel overlay (activated by button). Radial mandala wheel with 8 emotes: Heroic poses (Arjuna bow draw), respectful namaste, laughing Ganesha, angry Kali roar, well-played lotus, etc. Each emote triggers short animated sticker above player's king tower with element particles and short Vedic phrase bubble. Mute opponent option. Semi-transparent during battle to not obstruct view. Fun, cultural UI with expressive animations and subtle sound effects (chants, laughs), 4k lively mockup."

## 6. Victory / Defeat Screen
**Prompt**:  
"Post-battle results screen split for victory/defeat. Victory: Radiant golden explosion with blooming lotuses, player's hero in triumphant pose holding supreme weapon, 'Divine Victory!' title in massive Cinzel with particle fireworks. Rewards cascade: Gold coins raining, cards unlocking with holographic flips, experience chakra filling dramatically. Defeat: Somber crimson fade with ash particles, respectful bow from hero, 'Honorable Battle' consolation text, smaller rewards with learning tip (e.g., 'Try countering with Garudastra'). Replay/Share buttons as glowing scrolls. Background: Transforming battlefield to heavenly/ashram. Emotional, rewarding UI with epic music swell and particle celebrations, 4k dramatic mockup."

## 7. Card Crafting / Upgrade System
**Prompt**:  
"Card crafting workshop screen. Central anvil/altar with selected card hovering and glowing. Dust/Shards cost displayed as prisms breaking into particles when applied. Upgrade path visualization: Card tiers evolving with visual effects (Common → Mythic gains holographic border and aura flare). Disenchant button as controlled flame consuming duplicates. Filterable inventory grid below. Background: Divine forge with Agni flames and floating weapon essences. Satisfying progression UI with crafting sparkles and level-up divine chime, 4k magical mockup."

## 8. Loading Screen Variants
**Prompt**:  
"Dynamic loading screens with educational flavor. Rotating tips on ancient scroll overlay (e.g., 'Brahmastra can only be countered by another Brahmastra'). Central animated mandala spinner with element particles cycling. Background: Slowly panning epic artwork (Kurukshetra battle, cosmic Vishnu, stormy Indra). Flavor quotes from Mahabharata/Ramayana fading in with Devanagari accent. Progress bar as filling divine lamp oil. Calm, immersive UI that teaches lore during waits, 4k serene mockup series."

## 9. Events / Limited-Time Mode Screen
**Prompt**:  
"Special events hub screen. Large featured banner with themed artwork (e.g., 'Durga Navratri Festival' with goddess weapons glowing). Event-specific rules preview, exclusive rewards carousel (holographic event cards). Entry button as grand temple gate opening. Timer countdown as sinking sand in hourglass with Sanskrit numerals. Limited deck builder shortcut. Background: Festive divine celebration with lanterns and flower petals floating. Exciting seasonal UI with urgent glowing accents and celebration particles, 4k festive mockup."

## 10. Settings / Options Menu
**Prompt**:  
"Comprehensive settings menu with cultural elegance. Tabbed sections: Audio (Vedic music slider with chant preview), Graphics (particle density, bloom toggles), Controls (card drag sensitivity), Account (link options). Accessibility options highlighted (color-blind modes with chakra color swaps). Credits roll button opening ancient scroll with developer names in Devanagari. Background: Quiet meditation chamber with soft god rays. Clean, user-friendly UI with toggle switches as flipping lotus petals, 4k polished mockup."

These additional prompts cover core essential features beyond basic screens, ensuring a complete, polished, and culturally immersive game experience. Total: 10 new prompts, bringing the full UI suite to production-ready depth.
