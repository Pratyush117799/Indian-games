## Chakravyuh — Strategic Puzzle Game

**Chakravyuh** is a tile-based strategy and puzzle game inspired by the ancient Mahabharata military formation. One player (the **Architect**) builds the formation, and the other (the **Warrior**) must find a path from the entry to the center and then to the exit.

### Setup

1. Install dependencies:

```bash
cd "chakravyuh-game"
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open the URL printed in the terminal (typically `http://localhost:5173`) in your browser.

### How to Play

#### Builder Phase (Architect)

- Use the **tile inventory** on the right to select a tile type.
- **Click** on an empty cell on the 9x9 board to place the selected tile.
- **Click** a placed tile to rotate it by 90° clockwise.
- **Right-click** a placed tile (not entry/center/exit) to remove it and refund it to your inventory.
- When you think a valid path exists from **Entry → Center → Exit**, click **“Verify Solution”**.
- If a path exists, the **“Lock Formation”** button becomes available. Click it to switch to the **Solver** phase.

#### Solver Phase (Warrior)

- The warrior appears at the **entry** tile.
- **Click** the warrior to select it, then **click** an adjacent valid tile to move.
- You can also use the **arrow keys** to move the warrior.
- You must visit the **center** tile before the **exit** tile becomes accessible.
- Win by reaching the exit after visiting the center; lose if you have **no valid moves** remaining.

Use the **Restart** button to reset the board and inventory and return to the Builder phase.

### Game Rules

- Movement is **orthogonal only** (up/down/left/right).
- The warrior can move only along connected **path / entry / center / exit** tiles.
- **Walls** and **guards** are blocking; the warrior cannot move onto them.
- A valid formation must provide a continuous path from **entry** to **center** and from **center** to **exit**.

### Technology Stack

- **Framework**: React + TypeScript
- **Bundler/Dev Server**: Vite
- **Styling**: Tailwind CSS + small custom CSS utilities
- **State Management**: React hooks (`useState`, `useMemo`, `useCallback`)
- **Pathfinding**: A\* algorithm over a 2D grid with directional tile connections

### Sample Starting Configuration

When the app starts, the board is empty except for:

- A fixed **entry** tile on the left edge.
- A fixed **center** tile in the middle of the board.
- A fixed **exit** tile on the right edge.

The Architect then builds any Chakravyuh formation they like using the available tiles and validates it before handing it to the Warrior.

