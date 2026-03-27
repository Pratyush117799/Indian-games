// Add to your existing ClashEngine.ts

interface GameState {
  entities: ClashEntity[];
  projectiles: Projectile[];
  playerMantra: number;
  enemyMantra: number;
  lastRegenTime: number;
  combatEvents: { type: 'hit', x: number, y: number }[];
}

export const deployCard = (
  card: Weapon,
  lane: 'left' | 'right',
  team: Team,
  state: GameState,
  timestamp: number
) => {
  const mantraKey = team === 'player' ? 'playerMantra' : 'enemyMantra';
  if (state[mantraKey] < card.mantraCost) return false;

  state[mantraKey] -= card.mantraCost;

  const spawnY = team === 'player' ? 5 : 95;
  const spawnX = lane === 'left' ? 25 : 75;

  const entity: ClashEntity = {
    id: `entity-${timestamp}-${Math.random()}`,
    templateId: card.name,
    team,
    type: 'unit',
    x: spawnX,
    y: spawnY,
    lane,
    health: card.power * 60,
    maxHealth: card.power * 60,
    damage: card.power * 20,
    range: 15 + (card.power * 2),
    attackSpeed: 1200 - (card.power * 50),
    movementSpeed: 8 + card.power,
    lastAttackTime: 0,
    isMoving: true,
    name: card.name
  };

  state.entities.push(entity);
  return true;
};

// In updateGameState, add mantra regen
if (timestamp - state.lastRegenTime >= 2500) {
  state.playerMantra = Math.min(10, state.playerMantra + 1);
  state.enemyMantra = Math.min(10, state.enemyMantra + 1);
  state.lastRegenTime = timestamp;
}