# ஆடு புலி ஆட்டம் (Aadu Puli Aattam)

A two-player local implementation of the traditional South Indian **Goats and Tigers** strategy board game (2000+ years old).

## Setup

```bash
cd aadu-puli-aattam
npm install
npm run dev
```

Open **http://localhost:5175** in your browser.

## How to play

- **Goats** (15 pieces): Place one goat per turn on any empty point until all 15 are on the board; then move one goat to an adjacent empty point each turn.
- **Tigers** (3 pieces): Move to an adjacent empty point, or **capture** a goat by jumping over it to an empty point beyond (one capture per turn).
- **Tigers win** by capturing 5 or more goats.
- **Goats win** by trapping all 3 tigers (no legal moves left).

Goats always move first.

## Rules summary

1. **Placement phase**: Goats place one goat per turn; tigers move or capture in between.
2. **Movement phase**: After 15 goats are placed, both sides only move/capture.
3. **Capture**: A tiger jumps over one adjacent goat to an empty point; the goat is removed. Only one capture per turn; capture is optional.
4. **Trapping**: Goats win when no tiger has any legal move (move or capture).

## Tech stack

- **React 18** + **TypeScript**
- **Vite**
- **Tailwind CSS**
- **SVG** for the board (points, edges, pieces)

## Project structure

- `src/components/` – GameBoard, Piece, Point, Edge, PlayerInfo, ControlPanel, VictoryModal, GameHistory
- `src/hooks/useGameState.ts` – Game state and actions
- `src/utils/` – boardConfig (points/edges), moveValidation, victoryCheck
- `src/types/types.ts` – TypeScript interfaces

## License

MIT.
