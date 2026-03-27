# Historical Hampi Environment Design

## Overview
The game world is set in 16th century Hampi, capital of the Vijayanagara Empire during the reign of Krishna Deva Raya. The environment is designed as a single open-world map divided into streaming zones for performance.

## World Structure

### Streaming Zones
```
Hampi_Map/
├── Virupaksha_Temple_Zone      (High detail, main parkour hub)
├── Royal_Enclosure_Zone        (Story missions, underground passages)
├── Bazaar_Zone                 (Urban parkour, crowds)
├── Riverside_Boulders_Zone     (Natural parkour playground)
└── Lotus_Mahal_Gardens_Zone    (Mixed parkour, stealth areas)
```

**Streaming Strategy:**
- Zones load/unload based on player proximity
- 150-200m radius loading bubble
- Adjacent zones pre-loaded for seamless transition
- Distant zones show low-poly LODs

---

## Key Locations

### 1. Virupaksha Temple Complex

**Description:**
The most iconic structure in Hampi, featuring a massive gopuram (gateway tower), temple courtyard, and surrounding shrines.

**Design:**
- **Gopuram (50m tall tower)**:
  - Modular climbable pieces
  - Balconies at multiple heights for parkour chains
  - Stone protrusions as handholds
  - Scaled colliders for realistic climbing
  - Internal staircase for alternate routes

- **Temple Courtyard**:
  - Open plaza with mandapa (pillared halls)
  - Wooden beams connecting buildings
  - Banner ropes for swinging/sliding
  - Roof edges for running routes
  - Stone walls with ledges

**LOD System:**
- **LOD0** (0-50m): Full geometry with carved details, individual stones
- **LOD1** (50-150m): Simplified mesh, baked normal maps
- **LOD2** (150m+): Billboard impostor with baked lighting

**Parkour Routes:**
1. **Vertical ascent**: Ground → balcony → gopuram top
2. **Roof circuit**: Mandapa roofs → banner ropes → courtyard walls
3. **Interior passage**: Through temple halls to hidden shrine

**Materials:**
- Primary: Weathered granite (tiling texture)
- Accent: Sandstone trim (unique pieces)
- Vertex painting for moss/dirt in crevices

---

### 2. Royal Enclosure

**Description:**
Walled administrative area with palaces, audience halls, and underground passages.

**Design:**

#### Above Ground
- **Lotus Mahal**: Two-story pavilion
  - Arched balconies for climbing
  - Domed roof for perching
  - Gardens with trees as vertical elements
  
- **Stepped Tank (Pushkarini)**:
  - Rectangular water reservoir
  - Stone steps descending into water
  - High ledges (15m+) enable diving
  - **DiveZone trigger**: Enables dive animation, negates fall damage
  
- **Outer Walls**: 
  - 8m tall stone walls
  - Patrol walkways on top
  - Bastions as vantage points

#### Underground Passages
- **Separate navmesh layer** for AI
- Torch-lit tunnels connecting:
  - Royal Enclosure ↔ Bazaar
  - Palace ↔ Secret shrine
- **Stealth routes**: Bypass surface guards
- **Escape sequences**: Timed missions use these routes

**Gameplay Features:**
- **Stealth cover**: Shadows, pillars, tall grass
- **Guard patrols**: Scripted routes on walls and courtyards
- **Secret entrances**: Hidden doorways requiring specific items/missions

---

### 3. Stone Chariot & Elephant Stables

**Stone Chariot (Vittala Temple)**:
- Iconic stone structure shaped like a chariot
- **Parkour hub design**:
  - Climb stone wheels (3m diameter)
  - Jump from chariot roof to nearby temple roofs
  - Side panels have horizontal ledges
  - Central shrine accessed via mantle

**Elephant Stables**:
- Row of 11 domed chambers
- **Repeating architecture** ideal for parkour rhythm:
  - Wall-run along arches
  - Roof-hop across domes
  - Swing from dome to dome
- Ground level: Wide corridor for sprinting/sliding
- Rooftop: Continuous parkour route (100m length)

**Challenge Route:**
- Timed run: Ground floor → chariot → stable rooftops → return
- No touching ground after initial climb

---

### 4. Hampi Bazaar (Street Zone)

**Description:**
Long colonnaded street (1km) with market stalls, merchant houses, and crowd activity.

**Design:**

#### Street Level
- **Stone pillars** (5m tall, 2m spacing):
  - Perfect for parkour rhythm
  - Wall-run between pillars
  - Swing around pillars for sharp turns
  
- **Market stalls**:
  - Cloth canopies (vaultable obstacles)
  - Wooden crates (slide under)
  - Ceramic pots (destructible obstacles)
  
- **Crowds**:
  - Pooled NPC system (max 50 active)
  - Simple waypoint AI + avoidance
  - Low-poly LODs beyond 30m

#### Rooftop Routes
- **Merchant houses** (2-story):
  - Flat roofs connected via wooden planks
  - Clotheslines for rail slides
  - Chimneys/ventilation shafts as perching points
  
- **Continuous route**: Can traverse entire bazaar without touching ground

**Atmospheric Details:**
- Hanging lanterns (sway in wind)
- Textile banners (dynamic cloth simulation)
- Spice dust particles
- Merchant callout audio (spatialized)

**Gameplay:**
- **Chase sequences**: Through crowds and rooftops
- **Timed deliveries**: Navigate bazaar quickly
- **Stealth**: Blend into crowds, use rooftops to avoid guards

---

### 5. Riverside Boulder Fields

**Description:**
Natural boulder formations along the Tungabhadra River, historically known for unique rock formations.

**Design:**

#### Boulder Arrangement
- Clustered groups with varying sizes:
  - Small (1-3m): Stepping stones
  - Medium (5-8m): Climbable via ledges
  - Large (10-15m): Major landmarks with multiple routes
  
- **Narrow ledges**: Create tension and precision platforming
- **Gaps between boulders**: Require calculated jumps
- **Natural caves**: Shortcuts and hidden collectibles

#### Parkour Playground
- **Free-form exploration**: No strict paths
- **Vertical challenges**: Stack of 3-4 boulders requiring multi-stage climb
- **Speed challenges**: Slalom through boulder field

**Technical Implementation:**
- **Photogrammetry**: Scanned real Hampi boulders
- **Re-topology**: Game-friendly meshes (2k-8k tris)
- **Modular pieces**: Mix/match for variety
- **Granite material**: Shared tiling texture with vertex color variation

**Gameplay:**
- **Exploration rewards**: Collectibles hidden in hard-to-reach spots
- **Time trials**: Boulder course with checkpoints
- **Escape sequences**: Chase through boulder maze

---

### 6. Lotus Mahal Gardens

**Description:**
Indo-Islamic influenced palace with symmetrical gardens, water features, and ornamental trees.

**Design:**

#### Palace Structure
- Two-story with open arcades
- Central courtyard with fountain
- Balconies on all four sides (perfect for chain routes)

#### Gardens
- **Manicured layout**:
  - Quadrant design with pathways
  - Low ornamental walls (1m) for vaulting
  - Stone benches (perching/vaulting)
  
- **Trees**:
  - Large shade trees (8-12m tall)
  - Branches as horizontal traversal
  - Leaves provide visual cover for stealth
  
- **Water channels**:
  - Narrow canals (1m wide)
  - Can run along edges
  - Fountains as audio masking

**Parkour Routes:**
1. **Garden perimeter**: Low walls → benches → tree branches
2. **Palace circuit**: Ground floor arcade → balcony → roof
3. **Vertical ascent**: Tree → palace balcony → roof

**Stealth Areas:**
- Gardens provide multiple hiding spots
- Guards patrol predictable routes
- Trees offer elevated stealth observation

---

## Asset Production Pipeline

### Photogrammetry Assets
**Targets:**
- Boulder formations
- Stone carvings and pillars
- Temple architectural details

**Workflow:**
1. Capture photos on-site (or use reference photos)
2. Process in RealityCapture/Meshroom
3. Re-topology in Blender/Maya (reduce to game-ready poly count)
4. Bake high-poly details to normal maps
5. Create LODs automatically or manually

### Modular Architecture

**Temple Kit:**
- Base platforms (1m, 2m, 4m modules)
- Pillars (straight, carved, corner)
- Arches (plain, ornate)
- Dome pieces (quarter sections)
- Wall segments (plain, window, door)

**Benefits:**
- Fast level layout iteration
- Consistent visual language
- Efficient memory usage (shared materials)
- Easy LOD generation

### Shared Materials

**Granite Master Material:**
- Tiling albedo/normal (512cm repeat)
- Roughness variation via noise
- Vertex color for dirt/moss layers
- Weathering mask for edges

**Trim Sheets:**
- Ornamental borders (256x2048)
- Stone edges and cornices
- Doorway/window frames
- UV layout: Stack repeating elements

---

## Performance Optimization

### Level of Detail (LOD)

**Hero Structures** (Gopuram, Palaces):
- LOD0: Full detail (0-50m)
- LOD1: 50% triangles (50-100m)
- LOD2: 25% triangles (100-200m)
- LOD3: Billboard impostor (200m+)

**Auto-LOD Settings:**
- Screen size thresholds: 1.0, 0.5, 0.25, 0.1
- Automatic generation in UE5 (Nanite optional for static meshes)

### Occlusion Culling
- **Precomputed visibility**: Bake visibility between zones
- **Hierarchical Z-buffer occlusion**: Dynamic occlusion in-game
- **Manual occlusion volumes**: Place in dense temple areas

### Baked Lighting
- **Lightmass**: Bake indirect lighting for static structures
- **Lightmap resolution**:
  - Hero structures: 512-1024
  - Modular pieces: 256-512
  - Background: 128-256

### World Composition
- Enable world composition in UE5
- Divide map into grid cells (500m x 500m)
- Stream cells based on player location
- Persistent level contains mission managers and game state

---

## Atmospheric Elements

### Time of Day
- **Golden hour** (primary gameplay time): 5-7 PM
  - Warm orange/red lighting
  - Long shadows enhance readability
  - Showcases granite texture

- **Optional**: Day/night cycle for specific missions
  - Night: Stealth-focused missions
  - Dawn: Atmospheric exploration

### Weather
- **Dry season** (primary): Clear skies, high visibility
- **Monsoon** (optional): Rain effects, wet surfaces (higher slide friction)

### Audio Atmosphere
- **Ambient layers**:
  - Wind rustling through temple ruins
  - Distant river sounds
  - Temple bells
  - Crowd murmur in bazaar
  - Bird calls (peacocks, crows)

- **Music**: Indian classical instruments (sitar, tabla, veena)
  - Dynamic intensity based on action state
  - Quiet exploration vs. intense chase themes

---

## Navigation & Waypoints

### Parkour Routes
- **Color-coded cloth**: Subtle environmental hints
  - Yellow cloth: Main story routes
  - Blue cloth: Optional challenge routes
  - Red cloth: Dangerous shortcut routes

### Fast Travel
- **Meditation stones**: Placed at key locations
  - Virupaksha Temple entrance
  - Royal Enclosure gate
  - Bazaar center
  - River shrine
  - Only unlocked after visiting

### Map System
- **Parchment-style map UI**
- Fog of war reveals as areas explored
- Icons for:
  - Mission objectives
  - Collectibles (inscriptions)
  - Fast travel points
  - Points of interest

---

## Technical Specifications

### Recommended Scope
- **Total playable area**: ~4 km²
- **Streaming zones**: 5 main zones
- **Unique structures**: 15-20 hero buildings
- **Modular pieces**: 100-150 reusable assets

### Triangle Budget (Per Frame)
- Hero structures (visible): 5-8M tris
- Environment fill: 3-5M tris
- Characters/effects: 1-2M tris
- **Total**: 10-15M tris (UE5 Nanite can handle more)

### Texture Memory Budget
- Materials: 1.5-2GB (with streaming)
- Lightmaps: 500MB-1GB
- UI/effects: 300-500MB
- **Total**: ~3GB VRAM target (scalable)

---

## Environment Checklist

- [ ] Create zone blocking layout
- [ ] Model hero structures (gopuram, palaces)
- [ ] Create modular architecture kit
- [ ] Set up photogrammetry pipeline
- [ ] Develop master granite material
- [ ] Create trim sheets for details
- [ ] Implement LOD system
- [ ] Set up streaming zones
- [ ] Bake lightmaps
- [ ] Place parkour route hints (cloth markers)
- [ ] Add atmospheric audio
- [ ] Implement time of day system
- [ ] Create map UI
- [ ] Test performance across all zones
- [ ] Polish environmental storytelling details

---

*Hampi's historical grandeur serves as both aesthetic and functional playground for parkour*
