# Movement Controller Design

## Overview
The Hampi Runner character controller is a momentum-based parkour system with multiple movement states, stamina management, and advanced traversal mechanics.

## Core Components

### Character Setup
- **Rigidbody/Character Movement Component**: Physics-driven movement
- **Capsule Collider**: Standard character collision
- **Input System**: Unreal's Enhanced Input System
- **Collision Layers**: Ground, Climbable, WallRun, Ledge

### Movement Parameters

#### Base Movement
```cpp
WalkSpeed = 450.f       // Base walking speed
RunSpeed = 800.f        // Sprint speed
SlideSpeed = 1100.f     // Sliding speed
WallRunSpeed = 900.f    // Speed while wall-running
ClimbSpeed = 350.f      // Vertical climb speed
GravityScale = 2.2f     // Enhanced gravity for snappier jumps
```

#### Stamina System
```cpp
MaxStamina = 100.f          // Maximum stamina
SprintDrain = 12/sec        // Stamina drain when sprinting
WallRunDrain = 18/sec       // Stamina drain during wall-run
StaminaRegen = 15/sec       // Regen when idle/grounded
```

## State Machine

### States
```cpp
enum class EParkourState
{
    Grounded,   // Normal ground movement
    Airborne,   // In the air (jumping/falling)
    Slide,      // Sliding on ground
    WallRun,    // Running along a wall
    LedgeHang,  // Hanging from a ledge
}
```

### State Transitions

#### Grounded → Airborne
- Trigger: Jump input OR lose ground contact
- Action: Apply jump force, maintain horizontal momentum

#### Grounded → Slide
- Trigger: Crouch input AND speed > 600 units/sec
- Action: Lower capsule, reduce friction, add forward impulse

#### Airborne → WallRun
- Trigger: Wall detected ahead AND stamina > 15 AND sprint held
- Action: Reduce gravity, align velocity to wall tangent, camera roll

#### Airborne → LedgeHang
- Trigger: Ledge detected ahead AND jump held
- Action: Stop movement, snap to ledge position, lock rotation

#### WallRun → Airborne
- Trigger: No wall detected OR stamina depleted OR speed too low
- Action: Restore normal gravity, clear camera roll

## Movement Mechanics

### Momentum-Based Movement
Rather than teleporting to target speeds, the controller accelerates smoothly:

```cpp
Vector3 desiredVelocity = GetDesiredVelocity();
Vector3 currentVelocity = GetVelocity();
Vector3 acceleration = (desiredVelocity - currentVelocity) / timeToReachMax;
ApplyAcceleration(acceleration);
```

**Benefits:**
- Smooth speed transitions
- Preserved momentum when jumping
- Natural feeling acceleration/deceleration
- Different friction on ground vs. air

### Input Buffering
Jump inputs are buffered for 0.15 seconds to make ledge jumps and transitions feel responsive:

```cpp
void JumpPressed()
{
    bJumpHeld = true;
    JumpBufferTimer = 0.15f;
    
    if (IsGrounded())
    {
        ExecuteJump();
        JumpBufferTimer = 0.f;
    }
}

void Tick(float DeltaTime)
{
    if (JumpBufferTimer > 0.f)
        JumpBufferTimer -= DeltaTime;
        
    if (JumpBufferTimer > 0.f && CanJumpNow())
    {
        ExecuteJump();
        JumpBufferTimer = 0.f;
    }
}
```

## Advanced Mechanics

### Ledge Detection & Grabbing

Two-step raycasting system:
1. **Forward ray** from chest height to detect wall
2. **Downward ray** from above wall to find ledge top

```cpp
bool TraceForLedge(FVector& OutHangPoint, FVector& OutNormal)
{
    // 1. Cast forward from chest
    FVector origin = Position + Up * 1.5f;
    if (RaycastForward(origin, Forward, 0.7f, out hit))
    {
        // 2. Cast down from above hit point
        FVector topOrigin = hit.point + Up * 0.5f - Forward * 0.1f;
        if (RaycastDown(topOrigin, Down, 1.0f, out downHit))
        {
            OutHangPoint = downHit.point;
            OutNormal = hit.normal;
            return true;
        }
    }
    return false;
}
```

**Actions from ledge hang:**
- **W/Space**: Climb up (mantle over ledge)
- **S**: Drop down (return to airborne state)
- **Hold position**: Maintain hang indefinitely

### Wall-Running

**Detection:**
- Side raycast from character center
- Checks for vertical surface (wall)

**Requirements:**
- Must be airborne
- Moving forward with sufficient speed
- Stamina > 15
- Sprint button held

**Mechanics:**
- Reduce gravity to 60% of normal
- Align velocity along wall tangent (parallel to wall)
- Continuous stamina drain (18/sec)
- Camera rolls 10° toward wall

**Exit conditions:**
- Wall angle changes too much
- Speed drops below threshold
- Stamina depleted
- Player releases sprint

### Sliding

**Entry:**
- Must be grounded
- Speed > 600 units/sec
- Crouch input pressed

**Mechanics:**
- Lower capsule collision height
- Set friction to 0 initially
- Add forward impulse
- Gradually increase friction to slow to stop

**Exit:**
- Speed < 300 units/sec → return to grounded
- Can exit early by releasing crouch

### Climbing

**Requirements:**
- Forward surface tagged as "Climbable"
- Low horizontal speed
- Jump/interact input
- Stamina > 0

**Mechanics:**
- Move up along surface normal
- Constant vertical speed (ClimbSpeed)
- Stamina drain while climbing
- Can transition to ledge hang at top

## Stamina Management

### Drain Sources
- **Sprinting**: 12 stamina/sec (ground only)
- **Wall-running**: 18 stamina/sec
- **Climbing**: 15 stamina/sec
- **Sliding**: 8 stamina/sec

### Regeneration
- Only when grounded AND velocity < 200 units/sec
- Rate: 15 stamina/sec

### Low Stamina Effects
- **< 30% stamina**: Reduced run/wall-run speeds (×0.7)
- **0 stamina**: 
  - Cannot initiate wall-run or climb
  - Cannot sprint
  - Only walk and jump available
  - Must regenerate before advanced parkour

```cpp
void UpdateStamina(float DeltaTime)
{
    float drain = 0.f;
    
    if (bWantsToSprint && State == Grounded)
        drain += SprintDrain;
    if (State == WallRun)
        drain += WallRunDrain;
    if (State == Climb)
        drain += ClimbDrain;
        
    Stamina = Clamp(Stamina - drain * DeltaTime, 0, MaxStamina);
    
    // Regenerate when idle and grounded
    if (State == Grounded && Velocity.Size() < 200.f)
    {
        Stamina = Min(MaxStamina, Stamina + RegenRate * DeltaTime);
    }
    
    // Limit actions based on stamina
    if (Stamina < 30.f)
    {
        RunSpeed *= 0.7f;
        WallRunSpeed *= 0.7f;
    }
}
```

## Camera System

### Smoothing
- Separate camera rig with interpolated position/rotation
- Smooth following based on player velocity
- Prevents jarring camera snaps

### Effects
- **Head bob**: Subtle vertical oscillation when running
- **Wall-run tilt**: 10° camera roll toward wall
- **Landing compression**: Brief downward camera shift on landing

### Motion Sickness Prevention
- NO sudden FOV changes
- NO strong camera roll (max 10°)
- Smooth interpolation on all camera movements
- Optional: reduced camera shake settings

## Animation Integration

### Animation States
Map directly to parkour states:
- **Grounded**: Blend tree (idle → walk → run)
- **Airborne**: Jump start → jump loop → fall loop
- **Slide**: Slide animation
- **WallRun**: Wall-run cycle (left/right variants)
- **LedgeHang**: Hang idle → mantle up
- **Climb**: Climbing cycle

### Locomotion Blend Tree
- Input: Movement speed (0-800 units/sec)
- Blend: Idle → Walk → Run
- 1D blend space for smooth transitions

### Root Motion
- Use root motion for mantle and vault animations
- Disable for normal locomotion (use code-driven movement)

## Sound Effects

### Surface-Based Audio
Detect ground material via:
- Physics Material
- Surface Type tags
- Material instance parameters

**Variations:**
- Stone: Heavy, echoing footsteps
- Wood: Hollow, creaking sounds
- Sand: Soft, muffled footfalls
- Grass: Rustling, organic sounds

### Movement Audio
- **Footsteps**: Triggered by animation notifies, vary by speed
- **Landings**: Impact sounds based on fall distance
- **Wall-run**: Continuous scraping/sliding sound
- **Slide**: Friction sound with pitch based on speed
- **Climb**: Grunting, exertion sounds
- **Ledge grab**: Impact thud

### Stamina Audio
- Heavy breathing when stamina < 30%
- Gasping when stamina = 0
- Relief breath when recovering

---

## Implementation Checklist

- [ ] Set up character with capsule collider
- [ ] Implement state machine with all states
- [ ] Add momentum-based movement
- [ ] Implement input buffering
- [ ] Create ledge detection raycast system
- [ ] Add wall-run mechanics
- [ ] Implement sliding
- [ ] Create stamina system with drain/regen
- [ ] Set up camera smoothing and effects
- [ ] Create animation state machine
- [ ] Integrate surface-based audio
- [ ] Test all state transitions
- [ ] Tune movement parameters
- [ ] Optimize collision detection
- [ ] Add visual feedback (dust particles, wall-run trail)

---

*This movement system is designed for responsive, skill-based parkour gameplay*
