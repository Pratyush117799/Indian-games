# 🎮 CURSOR AI DEVELOPMENT PROMPT
## For Building "Zindagi - Indian Life Journey Story Game"

---

## 📋 PROMPT FOR CURSOR AI

```
Create a story-driven life simulation game called "Zindagi" - a Pokemon-style RPG that follows 
the complete life journey of an Indian middle-class person from birth to death (ages 0-75).

GAME SPECIFICATIONS:

=== CORE CONCEPT ===
- 2D top-down pixel art RPG (Pokemon Fire Red visual style)
- 12 chapters representing different life stages
- Turn-based dialogue and event system
- Deep narrative with branching storylines
- Indian cultural context (1995-2070 timeline)

=== TECHNICAL REQUIREMENTS ===
Framework: React + HTML5 Canvas or Phaser.js game engine
Art Style: Retro pixel art (16x16 character sprites, expandable to 32x32 for detail)
Resolution: 800x600 game window (scalable)
Save System: Local storage with multiple save slots (3 slots)

=== CHAPTER 1 PROTOTYPE (DEMO PHASE) ===
Build Chapter 1: "Bachpan (Childhood)" - Ages 0-5

FEATURES TO IMPLEMENT:

1. MAP SYSTEM:
   - Top-down 2D map of a small middle-class Indian home
   - Rooms: Living room, bedroom, kitchen, small balcony
   - Exterior: Small park nearby
   - NPCs: Mother, Father, Grandmother (Dadi)
   - Interactive objects: TV, toys, bed, dining table

2. CHARACTER SYSTEM:
   - Protagonist: Baby/toddler sprite (male - Arjun)
   - Progressive aging: 3 sprite variations (baby, toddler, 5-year-old)
   - Walking animation (4 directions)
   - Expression system (happy, sad, curious, tired)

3. DIALOGUE SYSTEM:
   - Text box at bottom (Pokemon-style)
   - NPC interaction on collision
   - Dialogue trees with simple choices
   - Hindi-English mixed dialogue (Hinglish flavor)
   - Example dialogue:
     Mother: "Arjun beta, come eat your food!"
     Choice: [Eat now] [Play more] [Throw tantrum]

4. STAT SYSTEM (visible in menu):
   - Health: 10/10
   - Happiness: 8/10
   - Curiosity: 5/10
   - Family Bond: 10/10
   - Display stats in a menu accessible via 'M' key

5. EVENT SYSTEM:
   - Scripted events trigger at specific locations/times
   - Key events for Chapter 1:
     a) Learning to walk (mini-game: press arrow keys in rhythm)
     b) First words (mini-game: match Hindi words with pictures)
     c) First day at playschool (cutscene + new map unlock)
     d) Playing in park (meet other kids, social stats)

6. TIME PROGRESSION:
   - Day/Night cycle (visual change in map)
   - Age counter visible in UI (Current Age: 2 years)
   - Skip time feature (sleep in bed to advance days)

7. MINI-GAMES:
   - Learning to Walk: Arrow key rhythm game
   - Color Recognition: Click matching colors
   - Speaking: Type simple Hindi words
   - Simple puzzle: Arrange toy blocks

8. SAVE/LOAD SYSTEM:
   - Auto-save on major events
   - Manual save option in menu
   - Load game from main menu
   - 3 save slots

9. MUSIC & SOUND:
   - Background music: Calm, nostalgic Indian instrumental
   - Sound effects: Footsteps, dialogue beep, door open/close
   - Ambient sounds: Birds chirping, traffic distant

10. UI ELEMENTS:
    - Health bar (top-left)
    - Menu button (top-right): Stats, Save, Quit
    - Dialogue box (bottom, Pokemon-style with character portrait)
    - Age and Chapter indicator (top-center)

11. CHOICE IMPACT SYSTEM:
    - Track player choices
    - Show subtle stat changes after choices
    - Example: 
      * Choosing "Eat now" → Health +1, Mother relationship +2
      * Choosing "Throw tantrum" → Happiness +1, Mother relationship -1

12. CUTSCENES:
    - Birth scene (opening): Static images with text
    - Naming ceremony: Animated text revealing name
    - First birthday: Family gathering (multiple NPCs)
    - First day at playschool: Walking to new location

=== VISUAL DESIGN SPECIFICATIONS ===

Color Palette:
- Warm, nostalgic tones (browns, creams, light greens)
- Indian home aesthetics: 
  * Colored walls (yellow, light green)
  * Steel utensils visible in kitchen
  * Traditional furniture (divan, low beds)
  * Calendars with deity pictures
  * Old TV set (90s style)

Character Sprites:
- Protagonist: Simple, cute baby/toddler design
- Mother: Saree-wearing, affectionate design
- Father: Shirt-pant, office-going look
- Grandmother: White saree, loving elderly design

=== TECHNICAL ARCHITECTURE ===

Folder Structure:
```
/zindagi-game
  /src
    /components
      Game.jsx (main game component)
      Map.jsx (render game world)
      Character.jsx (player character)
      NPC.jsx (non-player characters)
      DialogueBox.jsx (conversation UI)
      Menu.jsx (game menu)
      Stats.jsx (stat display)
    /assets
      /sprites
        /characters
        /objects
        /tiles
      /audio
        /music
        /sfx
      /data
        dialogues.json (all dialogue data)
        events.json (event scripting)
        maps.json (map data)
    /utils
      gameEngine.js (core game loop)
      saveSystem.js (save/load logic)
      eventHandler.js (event triggering)
      choiceTracker.js (track decisions)
    /styles
      game.css
  index.html
  package.json
```

=== CODE STRUCTURE GUIDELINES ===

1. Use React hooks for state management
2. Canvas for rendering or Phaser.js for game engine
3. JSON files for all game data (dialogues, events, choices)
4. Modular component design
5. Clean separation: Game logic, Rendering, UI, Data

=== GAMEPLAY FLOW ===

Main Menu → New Game → Character Creation (Name confirmation) → 
Chapter 1 Start → Tutorial (Movement) → Home Exploration → 
First Events → NPCs Interaction → Mini-games → 
Sleep (Age progression) → New Events → Chapter End → 
Save Game → Chapter 2 Teaser

=== KEY INTERACTIONS ===

Controls:
- Arrow Keys / WASD: Movement
- E / Enter: Interact with NPC/Object
- M: Open Menu
- Esc: Pause
- Space: Advance dialogue

Movement:
- Grid-based movement (tile-based)
- Collision detection with walls/objects
- NPCs have patrol routes or static positions

Interaction:
- Walk up to NPC and press E to talk
- Examine objects (toys, TV, food)
- Trigger events by walking to specific tiles

=== DATA STRUCTURES ===

Character State:
```javascript
{
  name: "Arjun",
  age: 2,
  chapter: 1,
  stats: {
    health: 10,
    happiness: 8,
    curiosity: 5,
    familyBond: 10
  },
  position: { x: 5, y: 5 },
  sprite: "toddler_male",
  relationships: {
    mother: 90,
    father: 85,
    grandmother: 95
  },
  choices: [],
  achievements: []
}
```

Event Structure:
```javascript
{
  id: "first_words",
  trigger: { age: 1, location: "living_room" },
  type: "minigame",
  dialogue: [
    "Mother: 'Say Maa, beta!'",
    "[Mini-game: Learning to speak]"
  ],
  outcomes: {
    success: { happiness: +2, curiosity: +1 },
    failure: { happiness: -1 }
  }
}
```

=== STYLING REQUIREMENTS ===

Game Window:
- Fixed 800x600 canvas/container
- Centered on page
- Pixel-perfect rendering (no blur)
- Retro CRT filter optional (scanlines effect)

UI Style:
- Pixel font (Press Start 2P or similar)
- Border boxes (Pokemon-style thick borders)
- Simple color scheme matching game aesthetic
- Health/stat bars with pixel art design

=== INITIAL IMPLEMENTATION PRIORITIES ===

Phase 1 (Essential - Build First):
✅ Basic map rendering with tiles
✅ Character movement with collision
✅ Simple NPC dialogue system
✅ Stats display
✅ Time progression (age counter)

Phase 2 (Core Gameplay):
✅ Event triggering system
✅ Choice tracking and consequences
✅ Mini-game integration (1-2 simple ones)
✅ Save/load functionality

Phase 3 (Polish):
✅ Music and sound effects
✅ Cutscenes (static images + text)
✅ UI animations
✅ Tutorial system

Phase 4 (Extension):
✅ Chapter completion screen
✅ Achievement system
✅ Multiple save slots
✅ Settings menu

=== SAMPLE DIALOGUE DATA ===

```json
{
  "dialogues": {
    "mother_morning_1": {
      "npc": "Mother",
      "text": "Good morning, Arjun beta! Did you sleep well?",
      "choices": [
        {
          "text": "Yes, Maa!",
          "effects": { "happiness": 1, "mother_relationship": 2 }
        },
        {
          "text": "Want to play!",
          "effects": { "curiosity": 1 }
        }
      ]
    }
  }
}
```

=== STARTER CODE REQUEST ===

Please generate:
1. Complete React project setup with necessary dependencies
2. Basic game engine with canvas rendering
3. Character movement with arrow key controls
4. Simple map (Indian home layout)
5. One NPC (Mother) with basic dialogue
6. Stats display system
7. Basic save/load functionality
8. Commented code explaining each system

Additional requests:
- Make it modular so new chapters can be easily added
- Include placeholder sprite rendering (colored squares until art is added)
- Implement smooth pixel art scaling
- Add basic collision detection
- Create a simple event system that can be expanded

=== TESTING CHECKLIST ===

[ ] Character moves in 4 directions smoothly
[ ] Collision detection works (can't walk through walls)
[ ] Dialogue appears when interacting with Mother
[ ] Stats are visible and update correctly
[ ] Age progresses when sleeping
[ ] Choices affect stats visibly
[ ] Game can be saved and loaded
[ ] No console errors
[ ] Responsive to window size (maintains aspect ratio)
[ ] Performance is smooth (60 FPS target)

=== EXPANSION NOTES FOR FUTURE ===

This Chapter 1 prototype should be designed so that:
- New chapters can be added as separate JSON files
- Character sprites can be swapped based on age
- New maps can be loaded dynamically
- Dialogue system supports any number of NPCs
- Event system can handle complex branching
- Stats system can accommodate new stats

Build this as a solid foundation that can scale to 12 chapters covering an entire lifetime.

=== CULTURAL ACCURACY CHECKLIST ===

Ensure authenticity:
[ ] Hindi-English mixed dialogue (Hinglish)
[ ] Indian home design (accurate to middle-class 90s-2000s)
[ ] Family dynamics (joint family, respect for elders)
[ ] Food references (dal-chawal, roti, etc.)
[ ] Festivals mentioned (Diwali, Holi in season)
[ ] Clothing accurate (saree, shirt-pant, not western)
[ ] Names are common Indian names
[ ] Family structure reflects reality

=== EMOTIONAL BEATS TO INCLUDE ===

Even in Chapter 1:
- Joy: First steps, birthday celebration
- Warmth: Grandmother's stories, mother's lullaby
- Curiosity: Exploring house, asking questions
- Fear: First day at playschool (separation anxiety)
- Love: Family dinner scenes, being tucked into bed

These emotional moments should be conveyed through:
- Thoughtful dialogue
- Character expressions
- Music shifts
- Pacing (slow down for intimate moments)

=== FINAL OUTPUT REQUEST ===

Please create:
1. Complete working prototype of Chapter 1
2. README with setup instructions
3. Documentation of all systems
4. Guide for adding new content (chapters, NPCs, events)
5. Sample JSON files showing data structure
6. Commented code explaining architecture

Technology preference: 
- React + Canvas (lighter) OR
- React + Phaser.js (more robust game engine)

Choose whichever is more suitable for long-term development of all 12 chapters.

START BUILDING THE GAME NOW. Focus on making Chapter 1 fully playable and emotionally engaging.
```

---

## 🚀 ALTERNATIVE SHORTER CURSOR PROMPT

If the above is too long, use this condensed version:

```
Build "Zindagi" - an Indian life simulation RPG (Pokemon-style) in React.

CHAPTER 1 PROTOTYPE:
- Top-down 2D pixel game (800x600)
- Player: Indian toddler (ages 0-5) in middle-class home
- Features: Character movement, NPC dialogue (Mother, Father, Dadi), stat system (Health, Happiness, Curiosity, Family Bond), choice-based events, save/load
- Setting: 1995-2000 Indian home (authentic middle-class aesthetic)
- Mini-games: Learning to walk, first words, color recognition
- Event system: Scripted story moments (first birthday, first day at playschool)
- UI: Pokemon-style dialogue box, stat menu, age counter
- Controls: Arrow keys (move), E (interact), M (menu)

Technical:
- React + HTML5 Canvas or Phaser.js
- JSON-based dialogue/event data
- Modular architecture (scalable to 12 life chapters)
- Pixel art style (colored squares as placeholders)
- Save system with 3 slots

Cultural elements:
- Hinglish dialogue
- 90s Indian home design
- Traditional family dynamics
- Authentic middle-class details

Deliver: Working prototype with movement, one NPC interaction, basic stats, and one mini-game. Make it expandable to full life story (birth to death across 75 years).
```

---

## 📚 SUPPLEMENTARY PROMPTS FOR CURSOR

### For Adding More Features Later:

**Prompt 2: Adding Combat/Challenge System**
```
Add a turn-based "exam/test" system to Zindagi game. Similar to Pokemon battles but for school exams. Include:
- Subject selection (Math, Science, Hindi, English, Social)
- Question-answer mechanics (multiple choice)
- Time pressure
- Study preparation affects success rate
- Results affect stats and story branches
```

**Prompt 3: Relationship System**
```
Implement a relationship meter system for all NPCs in Zindagi:
- Visual heart/star indicators (0-100 scale)
- Affected by dialogue choices and actions
- Unlocks special events at certain thresholds
- Can decay over time if neglected
- Affects story outcomes and available choices
```

**Prompt 4: Time Management System**
```
Create a day-scheduling system for Zindagi game:
- Divide day into time blocks (morning, afternoon, evening, night)
- Each activity consumes time
- Limited actions per day
- Strategic choice between study, social, rest, hobby
- Affects multiple stats
- Visual calendar/clock UI
```

**Prompt 5: Chapter Transition System**
```
Build chapter transition mechanics for Zindagi:
- End-of-chapter summary screen showing stats, achievements, key choices
- Age progression animation (character sprite morphs)
- Save checkpoint before new chapter
- Preview of upcoming chapter
- "Years later..." cinematic transition
```

---

## 🎨 ART ASSET PROMPTS (For AI Art Generators)

Use these prompts in Midjourney/DALL-E/Stable Diffusion:

**Character Sprites:**
```
"16-bit pixel art character sprite, Indian toddler boy, simple cute design, 
4-direction walking animation, top-down view, game asset, transparent background, 
retro RPG style"
```

**Home Tileset:**
```
"Pixel art tileset, Indian middle-class home interior, 1990s style, tiles include: 
floor tiles, walls, doors, windows, furniture (bed, table, chair), kitchen items, 
TV, calendars, 16x16 pixel size, warm colors, game asset"
```

**NPC Designs:**
```
"16-bit pixel art sprite, Indian mother in saree, kind expression, 
middle-aged, traditional look, top-down view, 32x32 pixels, game character"
```

---

## 💡 DEVELOPMENT TIPS

### For Hackathon Demo:
1. **Focus on Chapter 1 only** - Make it perfect
2. **Build 2-3 mini-games** that actually work
3. **Show emotional storytelling** - Make judges feel something
4. **Include one major choice** with visible consequences
5. **Add authentic cultural details** - This is your differentiator
6. **Create a compelling trailer** - 2-minute gameplay video

### For Cursor Workflow:
1. Start with basic movement and map
2. Add one NPC and dialogue system
3. Implement stats and choice tracking
4. Add one mini-game to prove concept
5. Polish UI and add music
6. Test thoroughly with friends/family

### Technical Priorities:
- **Save system is critical** - Players must be able to continue
- **Performance matters** - Must run smoothly on average laptops
- **Mobile-friendly** (optional) - Touch controls for wider reach
- **Accessibility** - Readable fonts, clear UI, difficulty options

---

## 🏆 PITCH DECK OUTLINE (For Hackathon)

**Slide 1: Title**
- "Zindagi - The Indian Life Story Game"
- Tagline: "Experience a complete Indian life from birth to death"

**Slide 2: Problem**
- 80% of games are imports
- No games representing authentic Indian life
- Youth disconnect from cultural values
- Need for meaningful, relatable gaming

**Slide 3: Solution**
- Deep narrative RPG covering entire human lifespan
- Authentic middle-class Indian experience
- Educational + entertaining
- Promotes cultural understanding

**Slide 4: Gameplay Demo**
- Live prototype demonstration
- Show 2-3 key moments
- Highlight emotional storytelling
- Display choice-consequence system

**Slide 5: Innovation**
- First complete-life simulation game
- Indian cultural authenticity
- Intergenerational appeal
- Therapeutic value (life reflection)

**Slide 6: Market Potential**
- Target: 400 million Indian gamers
- NRI nostalgia market
- Educational institutions
- Global cultural interest

**Slide 7: Business Model**
- Premium game (₹499)
- Regional DLCs (South, North, East, West variants)
- Female protagonist version
- International adaptation rights

**Slide 8: Roadmap**
- 6 months: Full 12-chapter development
- 12 months: Regional variants
- 18 months: Global launch
- Merchandise, animated series potential

**Slide 9: Team & Ask**
- Your team expertise
- Funding requirements
- Partnership opportunities
- Mentorship needs

**Slide 10: Vision**
- "Making India's story playable"
- Cultural preservation through gaming
- Next-gen edutainment
- Building indigenous game industry

---

## ✅ FINAL CHECKLIST BEFORE HACKATHON

**Game:**
- [ ] Chapter 1 fully playable (15-20 minutes gameplay)
- [ ] No game-breaking bugs
- [ ] Save/load working perfectly
- [ ] At least 2 mini-games functional
- [ ] Music and sound effects implemented
- [ ] Tested on 3+ different computers

**Presentation:**
- [ ] 10-slide pitch deck ready
- [ ] 2-minute gameplay trailer recorded
- [ ] Demo run-through practiced 5+ times
- [ ] Backup build on USB drive
- [ ] Offline version ready (no internet dependency)

**Documentation:**
- [ ] Game design document (this document!)
- [ ] Technical architecture explained
- [ ] Cultural research references
- [ ] Market research data
- [ ] Business model canvas

**Backup Plans:**
- [ ] Video demo if live demo fails
- [ ] Screenshots of all key moments
- [ ] Playable web build (itch.io backup)

---

## 🎯 WINNING STRATEGY

**What Judges Love:**
1. **Working prototype** > Fancy slides
2. **Emotional impact** > Technical complexity
3. **Cultural authenticity** > Generic game
4. **Clear vision** > Vague ambitions
5. **Scalability** > One-off project

**Your Edge:**
- No competition in this niche
- Deeply personal and relatable
- Shows real understanding of Indian life
- Technical + cultural + emotional balance
- Clear market need

**Elevator Pitch** (30 seconds):
*"Zindagi is India's first complete life-story game. Experience 75 years of an Indian person's journey from birth to death - every choice matters, every relationship counts. We're preserving our culture through gaming while creating an entirely new genre. It's Pokemon meets Indian middle-class reality - and it's never been done before."*

---

## 🚀 GOOD LUCK!

You have a **genuinely innovative concept**. Execute Chapter 1 well, present passionately, and show how it scales. This could genuinely win.

**Remember**: Judges want to see:
- Innovation ✓
- Execution ✓
- Impact ✓
- Scalability ✓
- Passion ✓

You have all five. Now build it! 🎮🇮🇳
