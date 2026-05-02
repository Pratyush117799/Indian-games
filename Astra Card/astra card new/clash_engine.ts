// Add to game state
interface GameState {
  playerMantra: number;
  enemyMantra: number;
  lastRegenTime: number;
  // ...
}

// In updateGameState
if (timestamp - state.lastRegenTime > 2500) {
  state.playerMantra = Math.min(10, state.playerMantra + 1);
  state.enemyMantra = Math.min(10, state.enemyMantra + 1);
  state.lastRegenTime = timestamp;
}

// Deployment function
export const deployCard = (card: Weapon, lane: 'left' | 'right', team: Team, state: GameState) => {
  if (state[`${team}Mantra`] < card.mantraCost) return;
  state[`${team}Mantra`] -= card.mantraCost;

  const spawnY = team === 'player' ? 10 : 90;
  const spawnX = lane === 'left' ? 25 : 75;

  const entity: ClashEntity = {
    id: `entity-${Date.now()}`,
    templateId: card.name,
    team,
    type: 'unit',
    x: spawnX,
    y: spawnY,
    lane,
    health: card.power * 60,
    maxHealth: card.power * 60,
    damage: card.power * 20,
    range: 20, // Adjust per card
    attackSpeed: 1000,
    movementSpeed: 10,
    lastAttackTime: 0,
    isMoving: true,
    name: card.name
  };
  state.entities.push(entity);
};