# Hampi Runner - Setup Instructions

## Prerequisites

### Required Software
1. **Unreal Engine 5.3+**
   - Download from Epic Games Launcher
   - Install C++ development components

2. **IDE (choose one):**
   - **Visual Studio 2022** (recommended for Windows)
     - Install "Game development with C++" workload
   - **JetBrains Rider** (cross-platform alternative)
   - **Xcode** (macOS)

3. **Git** (optional, for version control)
   - Download from git-scm.com

### System Requirements
- **OS:** Windows 10/11, macOS, or Linux
- **CPU:** Quad-core processor (Intel i5/AMD Ryzen 5 or better)
- **RAM:** 16 GB minimum, 32 GB recommended
- **GPU:** NVIDIA GTX 1660 / AMD RX 5600 or better
- **Storage:** 50 GB free space (for UE5 + project)

---

## Project Creation

### Step 1: Create New Unreal Project

1. **Open Epic Games Launcher**
2. **Navigate to Unreal Engine → Library**
3. **Click "Launch" on UE 5.3+**
4. **In the Unreal Project Browser:**
   - Select **"Games"** category
   - Choose **"Blank"** template
   - Set **Project Type: C++** (important!)
   - Choose **Desktop / Console**
   - Set **Target Platform: Desktop**
   - Set **Quality Preset: Maximum**
   - Set **Starter Content: No Starter Content**
   - Set **Raytracing: Enabled** (if GPU supports)

5. **Project Location:**
   - Choose a location, e.g., `D:\UnrealProjects\`
   - Project Name: `HampiRunner`
   - Full path will be: `D:\UnrealProjects\HampiRunner\`

6. **Click "Create"**
   - Wait for project generation (2-5 minutes)
   - Editor will open automatically

### Step 2: Close the Editor
Close the editor for now — we'll add the C++ code before reopening.

---

## Code Integration

### Step 3: Add HampiRunner Game Module

Navigate to your project's `Source` folder:
```
D:\UnrealProjects\HampiRunner\Source\
```

You should see a folder named `HampiRunner` (or your project name). This is the main game module.

### Step 4: Copy Source Files

From this package, copy the entire `Source/HampiRunner/` folder structure into your project:

**Copy from package:**
```
HampiRunner-Package/Source/HampiRunner/
├── Characters/
│   ├── HampiRunnerCharacter.h
│   └── HampiRunnerCharacter.cpp
└── Missions/
    ├── MissionDef.h
    ├── MissionManager.h
    ├── MissionManager.cpp
    ├── MissionObjectiveVolume.h
    └── MissionObjectiveVolume.cpp
```

**Copy to your project:**
```
D:\UnrealProjects\HampiRunner\Source\HampiRunner\
├── Characters/
│   ├── HampiRunnerCharacter.h
│   └── HampiRunnerCharacter.cpp
└── Missions/
    ├── MissionDef.h
    ├── MissionManager.h
    ├── MissionManager.cpp
    ├── MissionObjectiveVolume.h
    └── MissionObjectiveVolume.cpp
```

**Note:** The package also includes module files:
- `HampiRunner.Build.cs`
- `HampiRunner.h`
- `HampiRunner.cpp`

If your project already has these files, you can use the existing ones. Only add if missing.

### Step 5: Verify Build.cs

Open `HampiRunner.Build.cs` and ensure it contains:

```csharp
using UnrealBuildTool;

public class HampiRunner : ModuleRules
{
    public HampiRunner(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;

        PublicDependencyModuleNames.AddRange(new string[] { 
            "Core", 
            "CoreUObject", 
            "Engine", 
            "InputCore",
            "EnhancedInput"  // For new input system
        });

        PrivateDependencyModuleNames.AddRange(new string[] { });
    }
}
```

---

## Build & Compile

### Step 6: Generate Project Files

**Windows:**
1. Navigate to project root: `D:\UnrealProjects\HampiRunner\`
2. Right-click on `HampiRunner.uproject`
3. Select **"Generate Visual Studio project files"**
4. Wait for generation to complete

**macOS/Linux:**
1. Open Terminal in project root
2. Run: 
   ```bash
   <UE5_Install_Path>/Engine/Build/BatchFiles/Mac/GenerateProjectFiles.sh -project="HampiRunner.uproject" -game
   ```

### Step 7: Compile the Project

**Method 1: From IDE**

1. Open `HampiRunner.sln` (Visual Studio solution file)
2. Set build configuration to **"Development Editor"**
3. Set platform to **"Win64"** (or your platform)
4. Build → **Build Solution** (Ctrl+Shift+B)
5. Wait for compilation (5-15 minutes first time)

**Method 2: From Unreal Editor**

1. Open `HampiRunner.uproject` (double-click)
2. If prompted to rebuild, click **"Yes"**
3. Editor will compile and open

### Step 8: Verify Compilation

Once editor opens, check:
- No compilation errors in Output Log
- **Tools → Refresh Visual Studio Code Project** (if using VSCode)

---

## Project Setup in Editor

### Step 9: Configure Input System

1. **Edit → Project Settings**
2. Navigate to **Engine → Input**
3. **Enable Enhanced Input:**
   - Scroll to bottom
   - Check **"Enable Enhanced Input"**

4. **Create Input Mapping Context:**
   - In Content Browser, right-click → Input → **Input Mapping Context**
   - Name: `IMC_Player`
   - Open it and add these mappings:

   | Action Name | Key | Modifiers |
   |-------------|-----|-----------|
   | Jump | Space | - |
   | Sprint | Left Shift | - |
   | Crouch | Left Ctrl | - |
   | MoveForward | W | - |
   | MoveForward | S | Negate |
   | MoveRight | D | - |
   | MoveRight | A | Negate |
   | LookUp | Mouse Y | - |
   | Turn | Mouse X | - |

5. **Create Input Actions:**
   - Right-click → Input → **Input Action**
   - Create actions for: Jump, Sprint, Crouch (bool type)
   - Create actions for: MoveForward, MoveRight, LookUp, Turn (axis1D type)

### Step 10: Create Character Blueprint

1. **Content Browser → Add → Blueprint Class**
2. **Parent Class:** Search for and select `HampiRunnerCharacter`
3. Name: `BP_HampiRunner`
4. Open the blueprint

5. **Add Camera Components:**
   - Add **Spring Arm Component**
     - Socket: Root (attach to CapsuleComponent)
     - Target Arm Length: 300
     - Use Pawn Control Rotation: ✓
   - Add **Camera Component**
     - Socket: SpringArm (attach to spring arm tip)

6. **Set Input Mapping:**
   - In Event Graph, on BeginPlay:
     - Get PlayerController → **Add Mapping Context**
     - Mapping Context: Select `IMC_Player`
     - Priority: 0

7. **Compile and Save**

### Step 11: Set Default GameMode

1. **Edit → Project Settings**
2. Navigate to **Maps & Modes**
3. Under **Default Modes:**
   - Default GameMode: Create new → `BP_HampiGameMode`
4. Open `BP_HampiGameMode`:
   - Default Pawn Class: `BP_HampiRunner`
5. Save

### Step 12: Create Test Level

1. **File → New Level → Empty Level**
2. **Add Floor:**
   - Modes Panel → Basic → **Cube**
   - Drag into scene
   - Scale: X=100, Y=100, Z=1
   - Location: X=0, Y=0, Z=0
3. **Add Player Start:**
   - Modes Panel → Basic → **Player Start**
   - Location: X=0, Y=0, Z=200
4. **Add Lighting:**
   - Directional Light (Modes → Lights)
   - Sky Light (Modes → Lights)
5. **Save Level:**
   - **File → Save Current Level As**
   - Name: `L_Test`
   - Location: Content/Maps/

---

## Testing Movement

### Step 13: Test Play

1. **Click "Play" (Alt+P)** in toolbar
2. **Test Controls:**
   - WASD: Move
   - Mouse: Look
   - Space: Jump
   - Shift: Sprint
   - Ctrl: Crouch

3. **Expected Behavior:**
   - Should spawn in test level
   - Movement should work
   - Camera should follow
   - Jump should work
   - Sprint should increase speed

4. **Debug if needed:**
   - Open **Output Log** (Window → Developer Tools → Output Log)
   - Check for errors
   - Verify character is spawning

### Step 14: Test Advanced Parkour (Optional)

To test wall-run and sliding:

1. **Add Walls:**
   - Place cubes as walls (tall and thin)
   - Location near player spawn

2. **Test Wall-Run:**
   - Sprint toward wall
   - Jump at wall while holding sprint
   - Should stick to wall and run along it

3. **Test Slide:**
   - Sprint on flat ground
   - Press crouch while moving fast
   - Should slide forward

---

## Mission System Setup

### Step 15: Create Mission Manager

1. **Content Browser → Add → Blueprint Class**
2. **Parent Class:** `MissionManager`
3. Name: `BP_MissionManager`
4. Drag into level (persistent location)

### Step 16: Create First Mission

1. **Content Browser → Right-click → Miscellaneous → Data Asset**
2. **Asset Class:** `MissionDef`
3. Name: `DA_Mission_Test`
4. Open and configure:
   - Mission Id: `test_mission`
   - Type: Main
   - Title: "Test Mission"
   - Description: "Reach the objective marker"
   - Add Stage:
     - Stage Id: `stage_0`
     - Objective Text: "Reach the red cube"
     - Target Location Tag: `objective_test`
     - Time Limit: 60 seconds

### Step 17: Create Objective Volume

1. **Modes → Volumes → Add Volume**
2. Select **"Mission Objective Volume"** (if available in dropdown)
   - If not: Use **Trigger Volume**, we'll convert it

3. **Place volume at target location**
4. **Select volume → Details Panel:**
   - Objective Stage Id: `stage_0`
   - Mission Manager Ref: Select `BP_MissionManager` from level

5. **Add visual marker (red cube) inside volume**

### Step 18: Test Mission

1. **Select BP_MissionManager in level**
2. **Details → Available Missions**
   - Add Element
   - Select `DA_Mission_Test`

3. **Add Blueprint to start mission:**
   - Open `BP_HampiRunner`
   - Event Graph → BeginPlay
   - Get `MissionManager` (Get Actor of Class)
   - Call `Start Mission` (pass DA_Mission_Test)

4. **Play:**
   - Mission should start on spawn
   - UI should show objective (if implemented)
   - Reaching red cube should complete stage

---

## Additional Setup (Optional)

### Create UI (Optional)

1. **Create Widget Blueprint:**
   - Content Browser → User Interface → Widget Blueprint
   - Name: `WBP_MissionHUD`

2. **Add Text Blocks:**
   - Mission Title
   - Objective Text
   - Timer (if timed mission)

3. **Bind to Mission Manager:**
   - Subscribe to `OnMissionStarted` and `OnStageChanged` events
   - Update text blocks with mission info

4. **Add to Viewport:**
   - In `BP_HampiRunner` → BeginPlay
   - Create Widget → `WBP_MissionHUD`
   - Add to Viewport

### Configure Collision Channels (Recommended)

1. **Edit → Project Settings → Collision**
2. **Add Custom Channels:**
   - `Ledge` (Trace type)
   - `Climbable` (Trace type)
   - `WallRun` (Trace type)

3. **Update Character:**
   - Capsule collision should ignore/overlap as needed

---

## Troubleshooting

### Common Issues

**Issue: Compilation Errors**
- **Solution:** 
  - Ensure all files copied correctly
  - Check for typos in file names
  - Regenerate project files

**Issue: Character doesn't move**
- **Solution:**
  - Verify Input Mapping Context is added
  - Check GameMode has correct Default Pawn
  - Ensure Player Start is in level

**Issue: Can't find HampiRunnerCharacter class**
- **Solution:**
  - Rebuild project
  - Refresh code (Tools → Refresh Visual Studio Project)
  - Restart editor

**Issue: Wall-run doesn't work**
- **Solution:**
  - Ensure walls are on correct collision channel
  - Check stamina isn't depleted
  - Verify sprint is pressed

**Issue: Mission doesn't start**
- **Solution:**
  - Check MissionManager is in level
  - Verify mission data asset is assigned
  - Add debug print statements in StartMission()

### Getting Help

- **Unreal Documentation:** docs.unrealengine.com
- **Unreal Forums:** forums.unrealengine.com
- **Discord:** Unreal Slackers Discord
- **Reddit:** r/unrealengine

---

## Next Steps

### Recommended Development Order

1. **Polish Movement:**
   - Tune speed values
   - Add animation blend trees
   - Implement sound effects

2. **Build First Environment:**
   - Block out Virupaksha Temple zone
   - Add basic geometry
   - Place parkour routes

3. **Create Main Missions:**
   - Implement first 3 story missions
   - Add dialogue system
   - Test branching paths

4. **Add Visuals:**
   - Import photogrammetry assets
   - Create material library
   - Implement lighting

5. **Optimize:**
   - Set up LODs
   - Implement streaming
   - Profile performance

### Learning Resources

**Unreal C++ Tutorials:**
- Unreal Engine official documentation
- Udemy: "Unreal Engine 5 C++ Developer"
- YouTube: "Unreal Engine C++ Tutorial Series"

**Game Development:**
- "Game Programming Patterns" by Robert Nystrom
- "The Art of Game Design" by Jesse Schell

**Indian History (for authenticity):**
- Books on Vijayanagara Empire
- Archaeological Survey of India resources
- Hampi tourism documentation

---

## Project Structure Reference

```
HampiRunner/
├── Config/                     # Project configuration
├── Content/                    # All game assets
│   ├── Maps/                  # Levels
│   │   └── L_Test.umap
│   ├── Characters/            # Character blueprints
│   │   └── BP_HampiRunner.uasset
│   ├── Missions/              # Mission data assets
│   │   └── DA_Mission_Test.uasset
│   ├── UI/                    # Widget blueprints
│   │   └── WBP_MissionHUD.uasset
│   └── Input/                 # Input mappings
│       └── IMC_Player.uasset
├── Source/                     # C++ source code
│   └── HampiRunner/
│       ├── HampiRunner.Build.cs
│       ├── Characters/
│       │   ├── HampiRunnerCharacter.h
│       │   └── HampiRunnerCharacter.cpp
│       └── Missions/
│           ├── MissionDef.h
│           ├── MissionManager.h
│           └── ...
└── HampiRunner.uproject        # Project file
```

---

**You're now ready to start developing Hampi Runner! Good luck with your parkour adventure through history.**
