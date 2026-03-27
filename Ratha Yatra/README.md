# Ratha Yatra - Ancient Indian Chariot Simulation

## Overview
Ratha Yatra is a 3D vehicle simulation game built in Unity, featuring realistic chariot physics, horse AI, and historical Indian settings.

## Project Structure
- **Assets/Scripts**: Contains all C# source code for controllers and managers.
- **Assets/Models**: Place 3D models for chariots, horses, characters, and environment here.
- **Assets/Textures**: Textures and materials.
- **Assets/Audio**: Sound effects and music.
- **Assets/Scenes**: Unity scenes (Main Menu, Gameplay, Testing).
- **Assets/Prefabs**: Pre-configured GameObjects.

## Core Systems
### Vehicle Physics
- `RathaController.cs`: Main vehicle logic, handling acceleration, turning, and horse connection.
- `HorseController.cs`: AI for individual horses, handling stamina and animation states.

### Gameplay
- `GameManager.cs`: Controls global game state (Menu, Playing, Paused).
- `InputManager.cs`: Centralizes player input.
- `DriverController.cs`: IK handling for the driver character.
- `MissionManager.cs`: Controls mission flow and objectives.
- `MissionConfig.json`: Configuration file for mission data.

### Environment
- `WeatherManager.cs`: Handles dynamic weather states (Clear, Rain, Storm, HeatWave).
- `TerrainGenerator.cs`: Procedural terrain generation scaffolding.

### UI & Networking
- `UIManager.cs`: Manages HUD and menu visibility.
- `NetworkManager.cs`: Setup for multiplayer functionality.

## Setup Instructions
1. Open this folder as a Unity Project (Unity Hub -> Add).
2. Ensure you have the necessary packages installed (Cinemachine, ProBuilder, Netcode for GameObjects).
3. Create a Main Scene and attach `RathaController` to your chariot GameObject.
4. Assign `HorseController` scripts to your horse GameObjects and link them in the `RathaController`.
