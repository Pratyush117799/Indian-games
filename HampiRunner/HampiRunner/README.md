# Hampi Runner - Historical Parkour Game

## Overview
Hampi Runner is a parkour movement game set in the historical Vijayanagara Empire (Hampi, India) during the reign of Krishna Deva Raya. Players navigate the iconic temples, bazaars, and boulder fields of Hampi using advanced parkour mechanics including wall-running, sliding, ledge-grabbing, and climbing.

## Project Structure

```
HampiRunner/
├── README.md                           # This file
├── Documentation/                      # Design documents and guides
│   ├── 01_MovementController_Design.md # Movement system design
│   ├── 02_Environment_Design.md        # Level and world design
│   ├── 03_Mission_System_Design.md     # Quest and narrative systems
│   └── 04_Setup_Instructions.md        # How to set up the project
└── Source/                             # C++ source code
    └── HampiRunner/                    # Game module
        ├── HampiRunner.Build.cs
        ├── HampiRunner.h
        ├── HampiRunner.cpp
        ├── Characters/                 # Character classes
        │   ├── HampiRunnerCharacter.h
        │   └── HampiRunnerCharacter.cpp
        └── Missions/                   # Mission system
            ├── MissionDef.h
            ├── MissionManager.h
            ├── MissionManager.cpp
            ├── MissionObjectiveVolume.h
            └── MissionObjectiveVolume.cpp
```

## Key Features

### Movement System
- **Momentum-based parkour**: Smooth, physics-driven movement
- **Wall-running**: Run along vertical surfaces
- **Ledge grabbing**: Automatically grab and climb ledges
- **Sliding**: Crouch while sprinting to slide
- **Stamina system**: Manage energy for advanced moves
- **Input buffering**: Responsive controls even at speed

### Environment
Historical Hampi locations including:
- Virupaksha Temple with climbable gopuram
- Royal Enclosure with underground passages
- Hampi Bazaar with colonnades and rooftop routes
- Riverside boulder fields for natural parkour
- Lotus Mahal and gardens
- Stone Chariot parkour hub

### Mission System
- Main storyline: Political intrigue in Krishna Deva Raya's court
- Side missions: Deliveries, artifact collection, spy missions
- Branching dialogue with consequences
- Timed objectives and escapes
- Historical NPCs and authentic narrative

## Technology Stack
- **Engine**: Unreal Engine 5
- **Language**: C++
- **Platform**: PC (expandable to consoles)

## Getting Started
1. Read through the documentation in the `Documentation/` folder
2. Follow the setup instructions in `04_Setup_Instructions.md`
3. Review the C++ source code in `Source/HampiRunner/`
4. Create your Unreal Engine 5 project and integrate the code

## Development Status
This is a design and code template ready for implementation in Unreal Engine 5.

## Credits
Concept and Design: Historical parkour game set in 16th century Hampi
Engine: Unreal Engine 5
Language: C++

---
*Experience the glory of the Vijayanagara Empire through parkour*
