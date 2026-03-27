# Mission & Narrative System Design

## Overview
The mission system drives the narrative through a branching storyline set in the court of Krishna Deva Raya, with main story missions, side quests, and dynamic narrative choices that affect gameplay and outcomes.

---

## Data Architecture

### Mission Definition (Data Assets)

```cpp
enum class EMissionType
{
    Main,     // Core storyline
    Side      // Optional side quests
}

struct FMissionStage
{
    FName StageId;                  // Unique identifier
    FText ObjectiveText;            // "Reach the gopuram peak"
    FName TargetLocationTag;        // Tag for objective volume
    FName TargetNPCId;              // NPC to interact with (optional)
    float TimeLimitSeconds;         // 0 = no time limit
}

class UMissionDef : public UDataAsset
{
    FName MissionId;                        // "mission_main_01"
    EMissionType Type;
    FText Title;                            // "The Traitor's Message"
    FText Description;                      // Multi-line quest description
    TArray<UMissionDef*> Prerequisites;     // Missions that must be completed first
    TArray<FMissionStage> Stages;           // Sequential objectives
}
```

**Example Mission Data Asset:**
```
DA_Mission_Main_01
├── MissionId: "traitor_message"
├── Type: Main
├── Title: "The Traitor's Message"
├── Description: "Intercept a suspicious letter before it reaches enemy hands..."
├── Prerequisites: []
├── Stages:
│   ├── Stage 0: "Reach the bazaar rooftops" (TargetLocationTag: "bazaar_rooftop_01")
│   ├── Stage 1: "Follow the messenger" (TargetNPCId: "npc_messenger_shadowy")
│   └── Stage 2: "Return to the palace" (TargetLocationTag: "palace_courtyard", TimeLimit: 120s)
```

---

## Core Systems

### 1. Mission Manager

**Responsibilities:**
- Track active mission and current stage
- Monitor time limits
- Trigger stage transitions
- Handle mission success/failure
- Manage prerequisites and unlocking

**Key Methods:**
```cpp
void StartMission(UMissionDef* Mission)
    // Validates prerequisites, initializes first stage

void CompleteCurrentStage()
    // Advances to next stage or completes mission

void FailMission()
    // Handles mission failure (retry, alternate path, etc.)

bool CanStartMission(UMissionDef* Mission)
    // Checks if prerequisites are met
```

**Implementation:**
- Singleton actor placed in persistent level
- Broadcasts delegates for UI updates
- Saves mission progress to save game

### 2. Mission Objectives

#### Objective Volume Triggers
Place trigger volumes in the world tagged with stage IDs:

```cpp
class AMissionObjectiveVolume : public AVolume
{
    FName ObjectiveStageId;              // "bazaar_rooftop_01"
    AMissionManager* MissionManager;
    
    OnBeginOverlap(AActor* OtherActor)
    {
        if (OtherActor is Player)
            MissionManager->CompleteCurrentStage();
    }
}
```

**Usage:**
- Place at key locations (rooftops, NPC positions, secret areas)
- Designer-friendly (no code needed to add new objectives)
- Can add visual effects (highlight, particle beacon)

#### NPC Interaction Objectives
```cpp
class ANPCCharacter : public ACharacter
{
    FName NPCId;                         // "npc_messenger_shadowy"
    
    void OnInteract()
    {
        if (MissionManager->CurrentStage.TargetNPCId == NPCId)
            MissionManager->CompleteCurrentStage();
    }
}
```

#### Timed Objectives
Mission manager ticks and counts down:
```cpp
void Tick(float DeltaTime)
{
    if (CurrentStage.TimeLimitSeconds > 0)
    {
        StageTimeRemaining -= DeltaTime;
        if (StageTimeRemaining <= 0)
            FailMission();
    }
}
```

**UI Display:**
- Timer widget appears when time limit active
- Warning animations at 30s, 10s remaining
- Urgent audio cues

---

## Main Storyline

### Narrative Overview
**Setting:** 1520 CE, height of Vijayanagara Empire  
**Player Role:** Royal messenger and trusted parkour courier for Krishna Deva Raya  
**Central Conflict:** Political intrigue threatens the stability of the empire

### Story Arc (10 Main Missions)

#### Act 1: The Rising Threat (Missions 1-3)

**Mission 1: "The Traitor's Message"**
- Stage 0: Overhear suspicious conversation in bazaar
- Stage 1: Follow messenger to secret meeting spot
- Stage 2: Intercept letter before it reaches city walls (timed: 2 min)
- **Reward:** Unlocks Royal Enclosure, introduces court politics

**Mission 2: "Whispers in the Palace"**
- Stage 0: Report findings to the King
- Stage 1: Search minister's quarters for evidence (stealth)
- Stage 2: Escape palace guards (if detected)
- **Branching:** Stealth success vs. combat escape affects later missions

**Mission 3: "The Port Sabotage"**
- Stage 0: Travel to Vijayanagara port (Riverside zone)
- Stage 1: Investigate sabotaged trade ships
- Stage 2: Chase down arsonist through boulder fields (parkour challenge)
- **Reward:** Reveals foreign conspiracy, unlocks Side Quest chain

#### Act 2: The Investigation (Missions 4-6)

**Mission 4: "Shadows of the Elephant Stables"**
- Stage 0: Follow suspect to elephant stables at night
- Stage 1: Eavesdrop on conversation (stealth)
- Stage 2: Photograph evidence using ancient drawing technique (minigame)
- **Branching:** Different evidence leads to different accused parties

**Mission 5: "The Merchant's Gambit"**
- Stage 0: Meet with merchant guild leader in bazaar
- Stage 1: Deliver bribe to corrupt guard (moral choice)
- Stage 2: Retrieve compromising documents from guild house
- **Choice Impact:** Accept/refuse bribe affects merchant guild relationship

**Mission 6: "Temple of Secrets"**
- Stage 0: Decode inscription in Virupaksha Temple
- Stage 1: Access hidden chamber below gopuram
- Stage 2: Escape collapsing passage (timed parkour sequence)
- **Reward:** Ancient artifact, reveals historical context of conspiracy

#### Act 3: The Confrontation (Missions 7-10)

**Mission 7: "The Royal Gathering"**
- Stage 0: Attend court assembly (dialogue-heavy)
- Stage 1: Present evidence to the King
- Stage 2: Defend accusations in debate (dialogue choices)
- **Major Branch:** Different evidence paths lead to different accused traitors

**Mission 8: "Midnight Escape"**
- Stage 0: Betrayal! Framed as traitor yourself
- Stage 1: Escape from palace guards (intense chase)
- Stage 2: Reach safe house in bazaar (timed: 3 min)
- **Tone Shift:** From investigator to fugitive

**Mission 9: "Allies in Shadow"**
- Stage 0: Recruit underground resistance members
- Stage 1: Gather final proof of real traitor's identity
- Stage 2: Infiltrate enemy stronghold (stealth-heavy)
- **Branching:** Can recruit 2-4 allies based on prior choices

**Mission 10: "Dawn of Justice"**
- Stage 0: Confront the true traitor at Virupaksha Temple
- Stage 1: Chase sequence across all zones
- Stage 2: Final confrontation and reveal
- **Multiple Endings:**
  - **Ending A:** Traitor captured, player vindicated, honored as hero
  - **Ending B:** Traitor escapes, player clears name but left in exile
  - **Ending C:** Player exposes conspiracy but sacrifices reputation for kingdom's stability

---

## Side Missions

### Categories

#### 1. Timed Deliveries (Parkour Races)
**Format:** Deliver message/package from Point A to Point B within time limit

**Examples:**
- "Urgent Dispatch": Bazaar → Royal Enclosure (60s)
- "The King's Request": Palace → Virupaksha Temple (90s)
- "Merchant's Rush": River → Lotus Mahal (120s)

**Rewards:**
- Experience points
- Stamina upgrades (increase max stamina)
- Cosmetic items (different messenger robes)

**Design Notes:**
- Multiple routes (fast risky vs. slower safe)
- Checkpoints to show optimal path
- Leaderboards for speedrunners

#### 2. Artifact Collection (Exploration)
**Format:** Find hidden historical artifacts across Hampi

**Examples:**
- "Lost Inscriptions": Collect 10 stone inscriptions
  - Each shows Kannada/Sanskrit phrase + translation
  - Provides lore about Vijayanagara history
  
- "Royal Coins": Find 15 gold coins hidden in hard-to-reach spots
  - Requires advanced parkour techniques
  - Rewards cosmetic golden robe

- "Sacred Relics": Locate 5 temple artifacts
  - Hidden in secret chambers
  - Unlocks bonus temple lore entries

**Rewards:**
- Lore entries in codex
- Concept art unlocks
- Achievement/trophy progress

#### 3. Spy Missions (Stealth)
**Format:** Follow targets, eavesdrop, gather intelligence without detection

**Examples:**
- "The Merchant's Secret": Follow merchant to hidden meeting (3 min)
  - Use rooftop routes to stay undetected
  - Fail if target spots you 3 times
  
- "Guard Patrol Study": Observe guard routes and map them
  - Educational for later heist missions
  - Rewards stealth tips

- "Informant Network": Recruit 5 NPCs as informants
  - Dialogue-based missions
  - Unlocks fast travel shortcuts

**Rewards:**
- Intel on main story targets
- Stealth ability upgrades (quieter footsteps)
- NPC allies for specific missions

#### 4. Rescue Missions (Time Pressure)
**Format:** Save NPCs from danger within time limit

**Examples:**
- "Trapped in the Tank": NPC fell into pushkarini, pull them out (45s)
- "Fire at the Bazaar": Evacuate NPCs from burning building (90s)
- "Boulder Collapse": Reach injured climber on boulder before they fall (60s)

**Rewards:**
- NPC gratitude (discounts at shops)
- Moral satisfaction
- Karma points (affects ending)

---

## Dialogue System

### Node-Based Branching

**Structure:**
```
DialogueNode
├── SpeakerNPCId
├── DialogueText
├── Choices[]
│   ├── Choice 1 → NextNodeId
│   ├── Choice 2 → NextNodeId
│   └── Choice 3 → NextNodeId
└── TriggeredFlags[] (set on completion)
```

**Implementation:**
- Use Unreal's dialogue system or custom data tables
- Each dialogue tree is a separate asset
- Can trigger cutscenes, animations, camera changes

### Choice Consequences

**Flag System:**
Global flags tracked in GameState:
```cpp
TMap<FName, bool> StoryFlags;

// Examples:
// "helped_merchant_guild" = true
// "exposed_spy_a" = true
// "accepted_bribe" = true
```

**Impact Areas:**

1. **Mission Availability:**
   - If `helped_merchant_guild` = true, unlock "Merchant's Favor" side quest
   - If `exposed_spy_a` = true, spy won't appear in later missions

2. **Dialogue Changes:**
   - NPCs reference past choices
   - "I heard you helped the merchants..."
   - Different dialogue trees based on flags

3. **Gameplay Changes:**
   - Guards hostile/friendly based on reputation
   - Merchants offer discounts or refuse service
   - Access to certain zones restricted/granted

4. **Endings:**
   - Combination of flags determines ending variant
   - Example: `accepted_bribe + exposed_spy_a + traitor_escaped` = Ending B

---

## Historical NPCs

### Key Characters

**Krishna Deva Raya (King)**
- **Role:** Quest giver, final arbiter
- **Personality:** Wise, strategic, tests player's loyalty
- **Dialogue:** Formal, philosophical
- **Quests:** Main storyline missions

**Tenali Rama (Court Jester)**
- **Role:** Comic relief, unexpected ally
- **Personality:** Witty, clever, uses humor to deliver wisdom
- **Dialogue:** Playful riddles and jokes
- **Quests:** Side missions involving pranks and wit challenges

**Timmarusu (Chief Minister)**
- **Role:** Potentially the traitor OR wrongly accused
- **Personality:** Stern, calculating
- **Dialogue:** Short, businesslike
- **Branching:** Player's investigation determines if he's guilty

**Aliya Rama Raya (General)**
- **Role:** Military leader, potential ally or rival
- **Personality:** Honorable but ambitious
- **Dialogue:** Direct, martial
- **Quests:** Combat/defense missions

**Merchant Guild Leader**
- **Role:** Economic power broker
- **Personality:** Greedy but pragmatic
- **Dialogue:** Transactional, negotiating
- **Quests:** Trade route protection, bribery choices

**Portuguese Trader**
- **Role:** Foreign influence, potential conspirator
- **Personality:** Charming but suspicious
- **Dialogue:** Accent, flowery language
- **Quests:** Reveals foreign involvement in conspiracy

### NPC Implementation

**System:**
- Base class `ANPCCharacter`
- Dialogue component attached
- Interaction prompt on approach
- Minimal AI (stand/patrol waypoints)

**Dialogue Triggers:**
- Proximity-based (appear when player nearby)
- Mission-triggered (appear for specific quests)
- Time-based (only available certain times)

---

## Collectibles & Rewards

### Stone Inscriptions (Lore Collectibles)

**Design:**
- 50 inscriptions scattered across Hampi
- Real historical text where possible (with translation)
- Hidden in hard-to-reach spots (cliff ledges, temple peaks, underwater)

**Content:**
- Short (2-4 sentences) in Kannada/Sanskrit
- English translation appears below
- Voice narration (optional audio setting)
- Topics: Temple history, royal decrees, poems, religious texts

**Rewards:**
- 10 inscriptions → "Scholar" achievement
- 25 inscriptions → Unlock codex with bonus lore
- 50 inscriptions → Golden robe cosmetic

**UI:**
- Glowing particle effect marks collectibles
- Map shows collected vs. uncollected
- Codex menu to re-read all collected

### Hidden Passages & Secret Areas

**Types:**

1. **Underground Tunnels:**
   - Connect Royal Enclosure ↔ Bazaar
   - Require specific mission or key item to unlock
   - Shortcut routes for speedruns

2. **Secret Shrines:**
   - Hidden temple chambers
   - Platforming puzzles to reach
   - Contain rare collectibles

3. **Rooftop Gardens:**
   - Secluded peaceful areas
   - No combat/chase music
   - Meditation points for lore audio logs

**Discovery Rewards:**
- Achievement for each secret area
- Fast travel unlock
- Unique cosmetic items
- Concept art galleries

---

## Stealth & Guard System

### Guard AI

**States:**
```
Patrol → Suspicious → Alert → Search → Patrol
```

**State Details:**

**Patrol:**
- Follow waypoint route
- Normal walk speed
- Look around periodically
- Vision cone: 90°, 15m range

**Suspicious:**
- Investigate noise/movement
- Walk to last known player position
- Vision cone widens to 120°
- 5 second investigation, then return to patrol

**Alert:**
- Actively chasing player
- Run speed (matches player walk speed)
- Vision cone: 180°, 25m range
- Call for reinforcements (2 additional guards)

**Search:**
- Lost sight of player
- Search last known area for 15 seconds
- If player not found, return to Patrol

### Stealth Mechanics

**Cover System:**
- **Tall Grass:** Crouch to hide, guards can't see you
- **Shadows:** Unlit areas provide concealment
- **Crowds:** Blend into bazaar crowds (no parkour allowed)
- **Interiors:** Enter buildings to break line of sight

**Detection:**
- Line of sight check from guard to player
- Factors:
  - Distance
  - Player movement speed (running = easier to spot)
  - Cover type
  - Noise level

**Noise:**
- **Quiet:** Crouch-walk, ledge hang
- **Medium:** Normal walk, slide
- **Loud:** Run, land from height, knock over objects

### Stealth Failure Handling

**Not Always Instant Fail:**
- Some missions allow combat/escape
- Others require full stealth (fail if detected)

**Escape Options:**
1. **Outrun guards:** Use parkour to reach safe zone
2. **Lose in crowd:** Enter bazaar crowd and walk slowly
3. **Hide in building:** Enter interior and wait
4. **Complete objective quickly:** Grab item and escape before surrounded

**Checkpoint System:**
- Stealth missions have frequent checkpoints
- If caught, restart from last checkpoint (not full mission)

---

## Time-Based Mission Variants

### Escape Sequences

**Format:** Triggered by mission failure or story events

**Example: "Midnight Escape" (Mission 8)**
1. **Cutscene:** Player framed as traitor
2. **Timer starts:** 180 seconds to reach safe house
3. **Obstacles:**
   - Guards blocking normal routes
   - Doors locked (must use parkour routes)
   - Chase music intensifies at 60s, 30s
4. **Success:** Reach safe house with time remaining
5. **Failure:** Captured, alternate story branch (prison break mission)

**Design Principles:**
- Clear visual markers for escape route
- Multiple valid paths (fast risky vs. slower safe)
- Dramatic music and camera shake
- Breathing room at checkpoints

### Timed Challenges (Optional)

**Par Times:**
- Each timed mission has:
  - **Bronze:** Generous time (most players succeed)
  - **Silver:** Moderate challenge (skilled players)
  - **Gold:** Speedrun tier (top 10% of players)

**Rewards:**
- Bronze: Complete mission
- Silver: Bonus XP
- Gold: Cosmetic item

---

## Branching Narrative Framework

### Flag Tracking

**Critical Flags:**
```cpp
// Reputation
"player_reputation_palace"   // -100 to +100
"player_reputation_merchants" // -100 to +100
"player_reputation_military"  // -100 to +100

// Story Branches
"traitor_identity"            // "timmarusu" | "general" | "merchant"
"main_ally"                   // "tenali" | "general" | "merchants"
"final_evidence_type"         // "documents" | "witness" | "artifact"

// Moral Choices
"accepted_bribe_count"        // 0-5
"stealth_kills"               // 0-∞ (if combat added later)
"civilians_helped"            // 0-∞
```

### Ending Determination

**Ending A: "Hero's Vindication"**
- Requirements:
  - `player_reputation_palace > 50`
  - `traitor_identity` correctly identified
  - `civilians_helped > 10`
- Outcome: Player honored, traitor punished, empire secure

**Ending B: "Exile's Honor"**
- Requirements:
  - `player_reputation_palace < 0`
  - `traitor_identity` correctly identified
  - `accepted_bribe_count = 0`
- Outcome: Player clears name but must leave, traitor escapes

**Ending C: "Sacrifice for Stability"**
- Requirements:
  - `player_reputation_palace > 0`
  - `traitor_identity` wrong
  - `final_evidence_type = "artifact"`
- Outcome: Player takes blame to prevent civil war, becomes martyr

**Ending D: "Fall of the Messenger"**
- Requirements:
  - `player_reputation_palace < -50`
  - `accepted_bribe_count > 3`
- Outcome: Player truly becomes traitor, imprisoned, empire weakens

---

## Implementation Checklist

**Data Setup:**
- [ ] Create mission data asset structure
- [ ] Define all main story missions (10)
- [ ] Define side mission templates (20+)
- [ ] Write dialogue trees for key NPCs
- [ ] Set up flag system in game state

**World Setup:**
- [ ] Place objective volumes for all missions
- [ ] Position NPCs with dialogue components
- [ ] Add collectible inscriptions to world
- [ ] Mark secret areas and passages
- [ ] Set guard patrol routes

**Systems:**
- [ ] Implement mission manager
- [ ] Create objective volume triggers
- [ ] Build dialogue UI
- [ ] Program guard AI (patrol, detect, chase)
- [ ] Implement stealth detection
- [ ] Create timer UI for timed missions
- [ ] Build mission log/journal UI

**Polish:**
- [ ] Add mission start/complete cinematics
- [ ] Integrate voice acting for NPCs
- [ ] Create mission-specific music stings
- [ ] Design UI for branching choice preview
- [ ] Test all story branches
- [ ] Balance time limits
- [ ] Playtest stealth difficulty

---

*The narrative weaves player choice and parkour mastery into an unforgettable journey through Vijayanagara's golden age*
