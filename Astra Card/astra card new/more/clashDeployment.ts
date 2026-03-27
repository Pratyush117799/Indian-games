// clashDeployment.ts (extend your ClashEngine)
export const deployFromCard = (card: Weapon, lane: 'left' | 'right', team: Team, state: ClashGameState) => {
  const entity: ClashEntity = {
    // Derive stats as prior
    health: card.power * 70,
    damage: card.power * 25,
    // Ability hook
    onHit: () => resolveAbility("onHit", { card, target: enemyEntity, state })
  };
  state.entities.push(entity);
  resolveAbility("onPlay", { card, state }); // e.g., summon swarms
};