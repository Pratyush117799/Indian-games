# 💻 CURSOR AI PROMPTS - AADU PULI AATTAM
## Complete Development Guide for Goats and Tigers Game

---

## 🚀 PRIMARY PROMPT (MVP - COMPLETE GAME)

### **MAIN CURSOR PROMPT - Copy This Entire Block**

```
Create "Aadu Puli Aattam" (ஆடு புலி ஆட்டம்) - the traditional South Indian "Goats and Tigers" strategy board game.

=== GAME OVERVIEW ===

A two-player asymmetric strategy game where:
- Player 1 controls 3 Tigers (hunters/predators)
- Player 2 controls 15 Goats (prey/defenders)
- Tigers try to capture 5+ goats to win
- Goats try to trap all tigers (immobilize them) to win

This is an ancient Tamil game (2000+ years old) with perfect information and deep strategic gameplay.

=== BOARD STRUCTURE ===

The board is a diamond-shaped point-to-point grid with 23 vertices (points) and 32 edges (lines).

Board Layout (ASCII representation):
```
        0
       /|\
      1-2-3
     /|X|X|\
    4-5-6-7-8
     \|X|X|/
      9-10-11
       \|/
        12

Point 0: Top apex
Points 1,2,3: Second row
Points 4,5,6,7,8: Middle row (widest)
Points 9,10,11: Fourth row
Point 12: Bottom apex

Additional points for full 23-point structure (expand as needed)
```

Connections (edges):
- All adjacent points in same row are connected horizontally
- Points between rows are connected vertically
- Diagonal connections form triangular patterns
- Center has cross formation (marked with X in ASCII)

All 23 points are valid positions for pieces.

=== INITIAL SETUP ===

Starting Position:
- Tiger 1: Point 0 (top apex)
- Tiger 2: Point 4 (left end of middle row)
- Tiger 3: Point 8 (right end of middle row)
- All 15 Goats: Off-board (not yet placed)

First Move: Goat player always goes first

=== GAME PHASES ===

PHASE 1 - PLACEMENT PHASE (First 15 turns for goats):

Goat Player Turn:
- Places ONE goat on any empty point
- Cannot move existing goats yet
- Strategic placement to block tigers

Tiger Player Turn (during placement):
- Moves ONE tiger to adjacent empty point OR
- Captures a goat by jumping over it

Phase 1 ends when all 15 goats are on the board.

PHASE 2 - MOVEMENT PHASE:

Goat Player Turn:
- Moves ONE goat to adjacent empty point
- Cannot jump or capture
- Goal: Surround and trap all tigers

Tiger Player Turn:
- Moves ONE tiger to adjacent empty point OR
- Captures a goat by jumping over it
- Can only capture one goat per turn

=== MOVEMENT RULES ===

Valid Moves:
- Can only move to adjacent points connected by a line
- Can move in any direction (no forward-only restriction)
- Destination must be empty (unless tiger is capturing)

Tiger Capture Mechanism:
- Tiger jumps over an adjacent goat to an empty point beyond
- Goat must be directly adjacent (connected by line)
- Empty point must exist on the other side (inline)
- Captured goat is removed from board permanently
- Only ONE capture per turn (no multiple jumps)
- Capture is OPTIONAL (tiger can choose to move instead)

Goat Movement:
- Can only move to adjacent empty points
- CANNOT jump over tigers or other goats
- CANNOT capture tigers (only trap them)

=== VICTORY CONDITIONS ===

Tigers Win:
- Capture 5 or more goats (reducing goat count to ≤10)

Goats Win:
- All 3 tigers have no legal moves (completely trapped)
- Tigers cannot move and cannot capture

Draw (rare):
- Threefold repetition of position
- 50 consecutive moves without capture
- Mutual agreement

=== TECHNICAL REQUIREMENTS ===

Framework: React + TypeScript
Styling: Tailwind CSS (core utility classes only)
State Management: React hooks (useState, useReducer)
Board Rendering: SVG (scalable vector graphics)
AI: Minimax algorithm with alpha-beta pruning (optional for MVP, recommended for full version)

=== FILE STRUCTURE ===

```
/aadu-puli-aattam
  /src
    /components
      GameBoard.tsx          (main game board SVG)
      Point.tsx              (individual point/vertex)
      Edge.tsx               (connecting lines)
      Piece.tsx              (tiger or goat piece)
      PlayerInfo.tsx         (player stats, turn indicator)
      ControlPanel.tsx       (buttons: new game, undo, etc.)
      VictoryModal.tsx       (end game screen)
      GameHistory.tsx        (move list)
    /hooks
      useGameState.ts        (main game state management)
      useAI.ts              (AI opponent logic - optional)
    /types
      types.ts              (TypeScript interfaces)
    /utils
      boardConfig.ts        (23 points, 32 edges definition)
      moveValidation.ts     (validate moves and captures)
      victoryCheck.ts       (check win conditions)
      aiEngine.ts           (minimax algorithm - optional)
    /constants
      config.ts             (game constants)
    App.tsx
    index.css
  package.json
  tsconfig.json
  tailwind.config.js
```

=== DATA STRUCTURES ===

Point Interface:
```typescript
interface Point {
  id: number;              // 0-22 (23 total points)
  x: number;               // SVG x coordinate
  y: number;               // SVG y coordinate
  connections: number[];   // Array of connected point IDs
}
```

Edge Interface:
```typescript
interface Edge {
  from: number;   // Point ID
  to: number;     // Point ID
}
```

Piece Interface:
```typescript
interface Piece {
  id: string;              // Unique identifier (T1, T2, T3, G1-G15)
  type: 'tiger' | 'goat';
  position: number | null; // Point ID or null if not on board
  captured: boolean;       // Only for goats
}
```

Game State Interface:
```typescript
interface GameState {
  phase: 'placement' | 'movement';
  currentPlayer: 'tiger' | 'goat';
  tigers: Piece[];          // Array of 3 tiger pieces
  goats: Piece[];           // Array of 15 goat pieces
  goatsPlaced: number;      // Count of goats on board (0-15)
  goatsCaptured: number;    // Count of goats captured by tigers
  moveHistory: Move[];
  winner: 'tiger' | 'goat' | null;
  selectedPiece: string | null;  // Currently selected piece ID
}

interface Move {
  pieceId: string;
  from: number | null;     // null for placement
  to: number;
  captured?: number;       // Point ID of captured goat (if any)
  turn: number;
}
```

=== BOARD CONFIGURATION ===

Define all 23 points with coordinates and connections:

```typescript
// Example for simplified version - expand to full 23 points
const POINTS: Point[] = [
  // Row 1 - Top
  { id: 0, x: 400, y: 50, connections: [1, 2, 3] },
  
  // Row 2
  { id: 1, x: 250, y: 150, connections: [0, 2, 4, 5] },
  { id: 2, x: 400, y: 150, connections: [0, 1, 3, 5, 6, 7] },
  { id: 3, x: 550, y: 150, connections: [0, 2, 7, 8] },
  
  // Row 3 - Widest (middle)
  { id: 4, x: 100, y: 250, connections: [1, 5, 9] },
  { id: 5, x: 250, y: 250, connections: [1, 2, 4, 6, 9, 10] },
  { id: 6, x: 400, y: 250, connections: [2, 5, 7, 10, 11] },
  { id: 7, x: 550, y: 250, connections: [2, 3, 6, 8, 11] },
  { id: 8, x: 700, y: 250, connections: [3, 7, 11] },
  
  // Row 4
  { id: 9, x: 250, y: 350, connections: [4, 5, 10, 12] },
  { id: 10, x: 400, y: 350, connections: [5, 6, 9, 11, 12] },
  { id: 11, x: 550, y: 350, connections: [6, 7, 8, 10, 12] },
  
  // Row 5 - Bottom
  { id: 12, x: 400, y: 450, connections: [9, 10, 11] },
  
  // Add remaining points to reach 23 total for full traditional board
];

const EDGES: Edge[] = [
  // Generate from connections above
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  // ... etc
];
```

=== COMPONENT IMPLEMENTATION ===

1. GAME BOARD (SVG):

```typescript
// GameBoard.tsx structure
- SVG viewBox: "0 0 800 600"
- Render all edges (lines) first (behind pieces)
- Render all points (circles) 
- Render all pieces (tigers and goats)
- Click handlers on points for piece placement/movement
- Highlight valid moves when piece is selected

Visual Style:
- Background: Warm terracotta/sandstone (#D2691E)
- Edges: Dark brown lines, strokeWidth: 3
- Points: Small cream circles, radius: 8
- Tigers: Orange circles (#FF6347), radius: 25, with "T" label
- Goats: White circles (#F5F5DC), radius: 20, with "G" label
- Valid move indicator: Green glow/outline
- Selected piece: Golden glow
```

2. PIECE RENDERING:

```typescript
// Piece.tsx
- Tiger: Large orange circle with black border, "T1/T2/T3" text
- Goat: Smaller white circle with brown border, "G" text (or number)
- Draggable: true (for better UX)
- Click to select (highlights valid moves)
- Smooth position transitions (300ms)
- Capture animation: Fade out + shrink (500ms)
```

3. MOVE VALIDATION LOGIC:

```typescript
function isValidMove(
  piece: Piece, 
  fromPoint: number | null, 
  toPoint: number, 
  gameState: GameState
): { valid: boolean; capture?: number } {
  
  // Check if points are connected
  if (fromPoint !== null) {
    const point = POINTS[fromPoint];
    if (!point.connections.includes(toPoint)) {
      return { valid: false };
    }
  }
  
  // Check if destination is empty
  const occupiedBy = getPieceAtPoint(toPoint, gameState);
  if (occupiedBy !== null) {
    return { valid: false };
  }
  
  // Tiger-specific logic
  if (piece.type === 'tiger' && fromPoint !== null) {
    // Check for capture move
    const captureResult = checkTigerCapture(fromPoint, toPoint, gameState);
    if (captureResult.canCapture) {
      return { valid: true, capture: captureResult.capturedPoint };
    }
    // Regular adjacent move
    return { valid: true };
  }
  
  // Goat-specific logic
  if (piece.type === 'goat') {
    // During placement phase
    if (gameState.phase === 'placement' && fromPoint === null) {
      return { valid: true };
    }
    // During movement phase (only adjacent)
    if (gameState.phase === 'movement' && fromPoint !== null) {
      return { valid: true };
    }
  }
  
  return { valid: false };
}

function checkTigerCapture(
  from: number, 
  to: number, 
  state: GameState
): { canCapture: boolean; capturedPoint?: number } {
  
  // Check if move is exactly 2 steps in same direction
  const fromPoint = POINTS[from];
  const toPoint = POINTS[to];
  
  // Calculate midpoint
  const midX = (fromPoint.x + toPoint.x) / 2;
  const midY = (fromPoint.y + toPoint.y) / 2;
  
  // Find point at midpoint
  const midPoint = POINTS.find(p => 
    Math.abs(p.x - midX) < 1 && Math.abs(p.y - midY) < 1
  );
  
  if (!midPoint) return { canCapture: false };
  
  // Check if goat is at midpoint
  const goatAtMid = state.goats.find(g => 
    g.position === midPoint.id && !g.captured
  );
  
  if (!goatAtMid) return { canCapture: false };
  
  // Check if from → mid → to forms a line
  const isInLine = fromPoint.connections.includes(midPoint.id) &&
                   midPoint.connections.includes(to);
  
  if (!isInLine) return { canCapture: false };
  
  return { canCapture: true, capturedPoint: midPoint.id };
}
```

4. VICTORY DETECTION:

```typescript
function checkVictory(state: GameState): 'tiger' | 'goat' | null {
  // Tigers win if 5+ goats captured
  if (state.goatsCaptured >= 5) {
    return 'tiger';
  }
  
  // Goats win if all tigers are trapped (no legal moves)
  if (state.phase === 'movement') {
    const allTigersTrapped = state.tigers.every(tiger => 
      tiger.position !== null && 
      getValidMoves(tiger, state).length === 0
    );
    
    if (allTigersTrapped) {
      return 'goat';
    }
  }
  
  return null;
}

function getValidMoves(piece: Piece, state: GameState): number[] {
  if (piece.position === null) return [];
  
  const point = POINTS[piece.position];
  const validMoves: number[] = [];
  
  for (const connectedPoint of point.connections) {
    const moveResult = isValidMove(piece, piece.position, connectedPoint, state);
    if (moveResult.valid) {
      validMoves.push(connectedPoint);
    }
  }
  
  // For tigers, also check 2-step capture moves
  if (piece.type === 'tiger') {
    // Check all points reachable by jumping
    for (const adjacent of point.connections) {
      const adjacentPoint = POINTS[adjacent];
      for (const beyond of adjacentPoint.connections) {
        if (beyond === piece.position) continue; // Don't jump back
        const captureResult = checkTigerCapture(piece.position, beyond, state);
        if (captureResult.canCapture) {
          validMoves.push(beyond);
        }
      }
    }
  }
  
  return validMoves;
}
```

=== UI IMPLEMENTATION ===

1. PLAYER INFO PANEL:

```typescript
Display:
- Current turn: "Goat's Turn" or "Tiger's Turn"
- Phase: "Placement Phase (X/15 goats placed)" or "Movement Phase"
- Goats captured: "X/5" with progress bar
- Goats remaining: "X" (for placement phase)

Style: Clean card layout, side panel
```

2. CONTROL BUTTONS:

```typescript
Buttons:
- New Game
- Undo Move (disabled if no moves made)
- Show Rules (modal)
- Settings (sound, theme)
- Hint (if AI is available)

Style: Traditional Tamil-inspired buttons with modern UX
```

3. MOVE HISTORY:

```typescript
Display format:
1. Goat placed at point 10
2. Tiger T1: 0 → 2
3. Goat placed at point 5
4. Tiger T2: 4 → 6 (captures goat at 5)

Style: Scrollable list, click to highlight move on board
```

=== GAME FLOW ===

1. Game Start:
   - Initialize board
   - Place 3 tigers at starting positions
   - Set phase to 'placement'
   - Set current player to 'goat'

2. Placement Phase Loop:
   - Goat player clicks empty point → place goat
   - Switch to tiger player
   - Tiger player clicks tiger → highlights valid moves
   - Tiger player clicks valid destination → move/capture
   - Switch to goat player
   - Repeat until 15 goats placed
   - Transition to movement phase

3. Movement Phase Loop:
   - Current player clicks their piece → highlights valid moves
   - Player clicks valid destination → move/capture
   - Check victory condition
   - Switch player
   - Repeat until game ends

4. Game End:
   - Display victory modal
   - Show game statistics
   - Offer rematch or new game

=== STYLING GUIDELINES ===

Color Palette (Tailwind):
- Background: bg-stone-700
- Board area: bg-orange-100 border-4 border-orange-900
- Tigers: bg-orange-500 border-2 border-black
- Goats: bg-stone-100 border-2 border-stone-800
- Valid moves: ring-2 ring-green-400
- Selected piece: ring-2 ring-yellow-400 shadow-lg shadow-yellow-300
- Captured animation: opacity-0 scale-0

Typography:
- Title: Tamil + English (if Tamil font available)
- Font family: 'Inter' or similar clean sans-serif
- Headings: text-2xl font-bold
- Body: text-base

Layout:
- Responsive: Works on 1024px+ screens
- Board: Centered, max-width 800px
- Side panels: Sticky position
- Mobile: Stack vertically (optional for MVP)

=== ANIMATIONS ===

CSS Transitions:
```css
.piece {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.piece.capturing {
  animation: capture 0.5s ease-in-out;
}

@keyframes capture {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); }
  100% { transform: scale(0); opacity: 0; }
}

.valid-move {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
```

=== TESTING CHECKLIST ===

Functionality:
[ ] Goats can be placed on any empty point during placement
[ ] Tigers can move to adjacent empty points
[ ] Tigers can capture goats by jumping
[ ] Goats can move in movement phase
[ ] Victory detection works correctly
[ ] Turn switching works properly
[ ] Phase transition (placement → movement) works
[ ] Undo move works
[ ] New game resets state

UI/UX:
[ ] Valid moves highlight on piece selection
[ ] Pieces animate smoothly
[ ] Captured goats disappear with animation
[ ] Turn indicator updates correctly
[ ] Victory modal displays properly
[ ] Responsive layout works

Edge Cases:
[ ] Cannot place goat on occupied point
[ ] Cannot move piece if not their turn
[ ] Cannot capture if no goat in between
[ ] Cannot move to non-adjacent point
[ ] Tigers cannot win with <5 captures
[ ] Goats cannot win in placement phase

=== DELIVERABLES ===

Please create:
1. Complete React + TypeScript project
2. All components as specified
3. Full game logic implementation
4. Beautiful UI with Tamil aesthetic
5. Smooth animations
6. Victory detection
7. Move validation
8. README with:
   - Setup instructions
   - How to play
   - Rules summary
   - Technology stack

=== OPTIONAL ENHANCEMENTS (After MVP) ===

If time permits, add:
- AI opponent (minimax algorithm)
- Sound effects (place, move, capture)
- Move hints
- Game replay
- Save/load game
- Online multiplayer

=== PRIORITIES ===

Phase 1 (MVP - Must Have):
✅ Board rendering with 23 points
✅ Piece placement and movement
✅ Capture mechanics
✅ Phase transitions
✅ Victory detection
✅ Turn management

Phase 2 (Polish - Should Have):
✅ Animations
✅ Visual styling
✅ Move history
✅ Undo functionality

Phase 3 (Advanced - Nice to Have):
⭕ AI opponent
⭕ Sound effects
⭕ Tutorial overlay
⭕ Puzzle mode

START BUILDING NOW. Focus on getting Phase 1 fully functional first.

Create a working prototype with:
- Playable 2-player local game
- All rules implemented correctly
- Clean, usable interface
- Proper Tamil cultural aesthetic

IMPORTANT: The board should be beautiful and true to traditional South Indian design. Use warm colors (terracotta, saffron, cream) and clean geometric shapes.
```

---

## 🔧 SUPPLEMENTARY PROMPTS

### **Prompt 2: Enhanced Visual Design**

```
Enhance the Aadu Puli Aattam game with authentic South Indian visual aesthetics:

1. BOARD BEAUTIFICATION:
   
   Add decorative elements:
   - Hand-drawn line style (slight irregularity for traditional feel)
   - Wood grain texture background
   - Kolam (rangoli) border pattern around board
   - Tamil script title: "ஆடு புலி ஆட்டம்"
   - Subtle shadow/depth on lines (3D carved effect)

2. PIECE REDESIGN:
   
   Tigers:
   - Circular tokens with tiger face illustration
   - Orange/saffron gradient (#FF9933 to #FF6347)
   - Black stripe pattern overlay
   - Tamil label "புலி" (Puli - Tiger)
   - Pulsing glow when selected
   
   Goats:
   - Circular tokens with goat head profile
   - Cream/white gradient (#F5F5DC to #FFFDD0)
   - Simple minimalist goat illustration
   - Tamil label "ஆடு" (Aadu - Goat)
   - Gentle sway animation when idle

3. BACKGROUND DESIGN:
   
   - Aged parchment/stone texture
   - Warm sepia tones
   - Subtle temple architecture patterns in corners
   - Traditional South Indian art motifs

4. ENHANCED ANIMATIONS:
   
   Tiger Capturing:
   - Pounce animation (arc trajectory)
   - Brief roar effect (visual shake)
   - Goat fades out with "caught" indicator
   
   Goat Trapping Victory:
   - Tigers get "trapped" visual (chains/cage effect)
   - Goats celebrate with bounce animation
   
   Placement:
   - Pieces drop in from above with gentle bounce
   - Sparkle effect on placement

5. UI POLISH:
   
   - Buttons styled like traditional Tamil temple architecture
   - Ornate borders inspired by Mughal/Dravidian art
   - Victory modal with traditional celebration imagery
   - Move history styled as palm leaf manuscript

Use SVG patterns and gradients. Keep animations smooth (60fps).
Maintain cultural authenticity while ensuring modern UX.
```

---

### **Prompt 3: AI Opponent Implementation**

```
Add an AI opponent to Aadu Puli Aattam with 3 difficulty levels:

1. MINIMAX ALGORITHM:

Implement classic minimax with alpha-beta pruning:

```typescript
function minimax(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean
): { score: number; move?: Move } {
  
  // Terminal conditions
  const winner = checkVictory(state);
  if (winner === 'tiger') return { score: 10000 };
  if (winner === 'goat') return { score: -10000 };
  if (depth === 0) return { score: evaluatePosition(state) };
  
  // Generate all possible moves
  const moves = generateAllMoves(state);
  
  if (maximizing) { // Tiger's turn
    let maxScore = -Infinity;
    let bestMove = moves[0];
    
    for (const move of moves) {
      const newState = applyMove(state, move);
      const result = minimax(newState, depth - 1, alpha, beta, false);
      
      if (result.score > maxScore) {
        maxScore = result.score;
        bestMove = move;
      }
      
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) break; // Prune
    }
    
    return { score: maxScore, move: bestMove };
    
  } else { // Goat's turn
    let minScore = Infinity;
    let bestMove = moves[0];
    
    for (const move of moves) {
      const newState = applyMove(state, move);
      const result = minimax(newState, depth - 1, alpha, beta, true);
      
      if (result.score < minScore) {
        minScore = result.score;
        bestMove = move;
      }
      
      beta = Math.min(beta, minScore);
      if (beta <= alpha) break; // Prune
    }
    
    return { score: minScore, move: bestMove };
  }
}
```

2. EVALUATION FUNCTION:

```typescript
function evaluatePosition(state: GameState): number {
  let score = 0;
  
  // Material advantage (from tiger perspective)
  score += state.goatsCaptured * 100;
  
  // Mobility (number of legal moves)
  const tigerMoves = countTotalMoves(state.tigers, state);
  const goatMoves = countTotalMoves(state.goats, state);
  score += (tigerMoves - goatMoves) * 5;
  
  // Tiger positioning (prefer center control)
  for (const tiger of state.tigers) {
    if (tiger.position !== null) {
      score += evaluatePointStrength(tiger.position) * 3;
    }
  }
  
  // Goat formation strength (clustering)
  score -= evaluateGoatFormation(state) * 4;
  
  // Capture threats (goats that can be captured)
  score += countThreatenedGoats(state) * 15;
  
  // Tiger safety (distance from being trapped)
  score += evaluateTigerSafety(state) * 10;
  
  return score;
}

function evaluatePointStrength(pointId: number): number {
  // Points with more connections are stronger
  return POINTS[pointId].connections.length;
}

function evaluateGoatFormation(state: GameState): number {
  // Reward goats that are adjacent (forming walls)
  let formationStrength = 0;
  
  for (const goat of state.goats) {
    if (goat.position === null || goat.captured) continue;
    
    const adjacentGoats = state.goats.filter(g => 
      g.position !== null && 
      !g.captured &&
      POINTS[goat.position!].connections.includes(g.position!)
    );
    
    formationStrength += adjacentGoats.length;
  }
  
  return formationStrength;
}
```

3. DIFFICULTY LEVELS:

Easy (Beginner):
- Search depth: 2 moves
- Random move selection (30% of time)
- No complex evaluation
- Deliberately makes mistakes

Medium (Intermediate):
- Search depth: 4 moves
- Full evaluation function
- Occasional suboptimal moves (10%)
- Balanced challenge

Hard (Expert):
- Search depth: 6 moves
- Full evaluation + pattern recognition
- Opening book (pre-computed good starts)
- No intentional mistakes
- Endgame database (if <6 pieces on board)

4. AI MOVE SELECTION:

```typescript
async function getAIMove(
  state: GameState, 
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<Move> {
  
  const depth = {
    easy: 2,
    medium: 4,
    hard: 6
  }[difficulty];
  
  // Add thinking delay (feels more natural)
  await delay(500 + Math.random() * 1000);
  
  if (difficulty === 'easy' && Math.random() < 0.3) {
    // 30% random moves for easy mode
    const moves = generateAllMoves(state);
    return moves[Math.floor(Math.random() * moves.length)];
  }
  
  const result = minimax(state, depth, -Infinity, Infinity, state.currentPlayer === 'tiger');
  
  if (difficulty === 'medium' && Math.random() < 0.1) {
    // 10% suboptimal moves for medium
    const moves = generateAllMoves(state);
    return moves[Math.floor(Math.random() * moves.length)];
  }
  
  return result.move!;
}
```

5. UI INTEGRATION:

Add game mode selection:
- "2 Player Local"
- "vs AI (Easy)"
- "vs AI (Medium)"
- "vs AI (Hard)"

Show AI "thinking" indicator with spinner.
Animate AI moves smoothly (don't instant-apply).
Add "Hint" button that shows AI's suggested move.

6. TESTING:

Test AI by playing against it:
- Easy should lose most games
- Medium should be challenging but beatable
- Hard should win most games as tigers

Balance evaluation weights if needed.
```

---

### **Prompt 4: Tutorial System**

```
Create an interactive tutorial for Aadu Puli Aattam:

1. TUTORIAL STRUCTURE (7 Steps):

Step 1: Welcome & History
- Modal with game history (2000+ years old)
- Brief story about the game
- Images of traditional boards (optional)
- "Start Tutorial" button

Step 2: Board Introduction
- Highlight the diamond-shaped board
- Explain points (vertices) and lines (edges)
- Show how pieces can move along lines
- Interactive: "Click on any point to see connections"
- Progress to next step

Step 3: Meet the Pieces
- Introduce 3 Tigers (hunters)
- Introduce 15 Goats (defenders)
- Explain asymmetric gameplay
- Show starting positions
- Interactive: "Click on a tiger to see where it can move"

Step 4: Goat Placement Phase
- Explain Phase 1 rules
- Guide player to place 3 goats
- AI automatically responds with tiger moves
- Highlight valid placement spots
- Tips appear: "Try to block tiger movement paths"

Step 5: Tiger Capturing
- Set up scenario where tiger can capture
- Guide player (as tiger) to make capture
- Explain jump mechanics
- Show goat removal
- Practice: "Complete 2 more captures"

Step 6: Movement Phase
- Transition to Phase 2
- Show both players can now move pieces
- Guide goat player to create formation
- Demonstrate trapping concept
- Interactive: "Move goats to surround one tiger"

Step 7: Victory Conditions
- Explain tigers win by