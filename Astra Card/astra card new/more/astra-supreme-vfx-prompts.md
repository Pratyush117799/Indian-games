# ASTRA: Weapons of the Gods – Supreme Tier VFX Prompts

## Overview & VFX Design Philosophy
Supreme Tier weapons are the game's mythic climaxes—their Visual Effects (VFX) must evoke awe, divine terror, and cosmic scale while remaining performant and readable. VFX reinforce **mechanical clarity** (e.g., counter neutralization instantly recognizable) and **mythological immersion** (serpent coils for Brahmastra, third-eye beams for Shiva weapons).

**Core Guidelines**:
- **Style**: Blend classical Indian motifs (mandalas, lotuses, Sanskrit runes glowing mid-air) with epic fantasy particle systems—volumetric god rays, energy shockwaves, elemental distortion (heat haze, lightning forks).
- **Color & Lighting**: Dominant gold/crimson/blue with divine bloom/glow. High dynamic range: Intense core light fading to ethereal edges.
- **Timing & Pacing**: 
  - Build-up (0.5–1s): Invocation aura.
  - Peak (1–2s): Ability climax with screen shake/slow-motion.
  - Resolution (0.5–1s): Fallout particles.
- **Performance**: Mobile-first—use sprite-based particles, limit emitters (max 5–8 per supreme), GPU instancing. Classic Mode: Precise, paused highlights. Clash Mode: Chaotic but readable (no full-screen obscuring >2s).
- **Audio Sync**: Deep Vedic chants, thunder rumbles, cosmic whooshes, serpent hisses.
- **Readability**: Counter VFX overrides (e.g., mutual destruction = mirrored explosions). Health/damage numbers pop clearly over chaos.
- **Triggers**: Tied to ability timings (On-Play, On-Clash, On-Resolution, On-Destruction).
- **Edge Cases**: Mirror matches → symmetrical VFX; low-device mode → reduced particles but core shapes preserved.

Prompts are crafted for VFX artists (Unity Particle System, Unreal Niagara, or similar). Each includes trigger context, full sequence, mode variations, and nuances.

## Supreme VFX Prompts

### 1. Brahmastra
**Trigger**: On-Play (invocation) + On-Destruction (Eternal return or neutralization).  
**Prompt**:  
"Cosmic Brahmastra VFX sequence: On-Play—card center erupts with golden arrowhead forming from swirling nebula particles, infinite multi-headed serpent materializing in glowing coils (volumetric trails with galaxy textures inside scales), radiating divine fire shockwaves with Sanskrit rune particles orbiting. Build-up: Serpent heads multiply with hiss SFX and screen edge distortion. Peak: Full-screen cosmic bloom with slow-motion serpent devouring tail (Ouroboros loop 1s). On-Destruction/Eternal: If neutralized—mutual serpent explosion with mirrored opponent coils clashing in energy nova; if Eternal return—serpent recoils gracefully, card bouncing back to hand with reforming galaxy trail and soft chime. Classic Mode: Pausable highlight with rune text overlay. Clash Mode: Global lane distortion, units briefly silhouetted. Performance: 6 emitters (serpent trails, fire waves, runes, galaxy sparks, shock rings, bloom). Epic, recurring divine serpent motif with infinite loop potential."

### 2. Brahmashirsha Astra
**Trigger**: On-Resolution (Cataclysm if unopposed).  
**Prompt**:  
"Apocalyptic Brahmashirsha VFX: On-Play—four fierce Brahma heads emerge from crimson missile core with roaring flame bursts and ash particles. Build-up: Heads rotate with building tremor shake and cracking reality lines (screen fracture shader). Peak (unopposed): Cataclysm—full-screen four-directional flame waves, world-ending ash storm particles, field entities disintegrating into red embers with apocalyptic chant crescendo. If opposed: Normal missile impact with reduced four-head flare. Classic Mode: Step-by-step head reveal. Clash Mode: Tower-targeted wipe with structural crumble. Performance: 8 emitters (flame mouths, ash storm, fracture lines, ember dissolve, shockwaves). Terrifying world-end scale with reality-break shader nuance."

### 3. Pashupatastra
**Trigger**: Passive (Irresistible) + On-Resolution.  
**Prompt**:  
"Irresistible Pashupatastra annihilation vortex: On-Play—blue-black swirling void forms with piercing trident spikes and faint Nataraja silhouette pulsing in rhythm. Build-up: Vortex intensifies with cosmic dissolution particles (entities edge-fading). Peak: Total target erasure—inescapable pull trails sucking in opponent card/unit, final trident pierce with third-eye beam and absolute silence-to-thunder SFX drop. No counter flash (emphasize inevitability). Classic Mode: Slow vortex build for tension. Clash Mode: Area pull affecting nearby units. Performance: 5 emitters (vortex swirl, trident spikes, dissolution fade, third-eye beam, silence vacuum). Serene yet fearsome—minimal color for dread."

### 4. Narayanastra
**Trigger**: On-Resolution (Unstoppable ramp if resisted).  
**Prompt**:  
"Unstoppable Narayanastra missile shower: On-Play—Vishnu cosmic silhouette in sky raining infinite golden arrows with conch/disc trails. Build-up: Arrow count multiplies with momentum blur. If resisted: Ramp—arrows intensify, screen fill with doubling projectiles and backlash lightning. Surrender prompt: Calming blue fade if accepted. Peak: Unstoppable barrage with preservation glow shielding caster. Classic Mode: Resistance prompt pause. Clash Mode: Lane-flooding wave. Performance: 7 emitters (arrow rain, conch trails, backlash forks, glow shield). Punishing aggression with visual escalation nuance."

### 5. Sudarshana Chakra
**Trigger**: On-Play + On-Kill (Return).  
**Prompt**:  
"Spinning Sudarshana Chakra pursuit: On-Play—thousand-edged disc materializes with fierce Vishnu eye center, blazing motion blur trails and fiery edge particles. Peak: High-speed spin throw with pursuit curve (homing path glow). On-Kill/Return: Disc boomerangs back with bloodless justice flare and soft chime, reforming in hand/deck. Classic Mode: Precise target lock line. Clash Mode: Auto-homing with trail damage. Performance: 4 emitters (spin blur, fire edges, eye glow, return arc). Inexorable justice feel with smooth return loop."

### 6. Vaishnavastra
**Trigger**: On-Play (Preserve).  
**Prompt**:  
"Protective Vaishnavastra shield: On-Play—blue-gold lotus petals bloom around target, forming conch-motif barrier with calming ripple waves. Build-up: Barrier solidifies with preservation particles. Peak: Absorb hit—impact distortion absorbed into nectar splash and heal glow. Classic Mode: Highlight protected target. Clash Mode: Visible bubble on unit. Performance: 5 emitters (petal bloom, ripple waves, conch glow, absorb flash, heal sparks). Serene defensive aura nuance."

### 7. Maheswarastra
**Trigger**: On-Resolution (Dissolve).  
**Prompt**:  
"Maheswarastra permanent dissolution: On-Play—blue flame vortex with damaru motifs. Peak (win): Target pulled into void, erased with ash smear and no graveyard trail (exile particles vanishing into nothing). Classic Mode: Slow dissolve for emphasis. Clash Mode: Instant erase. Performance: 6 emitters (flame vortex, damaru shake, ash smear, void pull, exile fade). Finality nuance—no return possible."

### 8. Trishula
**Trigger**: Passive (Pierce) + On-Hit.  
**Prompt**:  
"Trishula illusion-piercing strike: On-Play—three-prong trident with serpent coils and third-eye beam. Peak: Pierce through shields—beam ignores barriers with crack shatter particles. Classic Mode: Shield break overlay. Clash Mode: Penetrating hit. Performance: 4 emitters (beam, coils, shatter, eye flare). Symbolic trinity glow nuance."

### 9. Vajrayudha
**Trigger**: On-Hit (Stun).  
**Prompt**:  
"Vajrayudha thunder impact: On-Play—diamond thunderbolt crackling blue arcs. Peak: Strike explosion with stun freeze frame and chain lightning forks. Target outline locked with electric chains. Classic Mode: Pause on stun. Clash Mode: Unit freeze animation. Performance: 5 emitters (arcs, impact blast, chain forks, freeze particles). Indestructible shock nuance."

### 10. Gandiva
**Trigger**: On-Play (Inexhaustible draw).  
**Prompt**:  
"Gandiva inexhaustible flame bow: On-Play—golden bow draw with Agni fire nock and infinite quiver glow. Peak: Arrow release with draw card cascade (holographic card reveal particles). Classic Mode: Hand fill animation. Clash Mode: Resource gain sparkle. Performance: 4 emitters (fire nock, quiver glow, arrow trail, card cascade). Value generation warmth nuance."

### 11. Pinaka
**Trigger**: On-Play (Shatter).  
**Prompt**:  
"Pinaka mountain-shatter vibration: On-Play—massive bow hum with resonance waves. Peak: Shockwave shattering low-Power targets (rock crumble particles). Classic Mode: Area clear ripple. Clash Mode: Entry blast. Performance: 5 emitters (hum waves, shock rings, crumble debris). Primal vibration nuance."

### 12. Kalki Ratnamaru
**Trigger**: Conditional (Judgment activation).  
**Prompt**:  
"Kalki final judgment sword: Build-up (condition met)—white-hot blade with cosmic motifs charging. Peak: Massive swing purification firestorm, evil-targeting embers. Screen bright bloom with end-times chant. Classic Mode: Late-game flare. Clash Mode: Global boost. Performance: 6 emitters (blade charge, firestorm, ember judgment, bloom flash). Prophetic climax nuance."

These VFX prompts elevate supreme moments to legendary status—balanced for impact and performance.