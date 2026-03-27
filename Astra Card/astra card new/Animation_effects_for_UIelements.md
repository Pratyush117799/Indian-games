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