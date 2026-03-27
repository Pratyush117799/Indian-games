// classicCombat.ts
export const resolveClash = (attacker: Weapon, defender: Weapon, state: ClassicGameState) => {
  let attackPower = attacker.power;
  let defensePower = defender.power;

  // Tier bonus
  if (tierValue(attacker.tier) > tierValue(defender.tier)) attackPower += 2;

  // Elemental counter
  if (elementsCounter(attacker.element, defender.element)) attackPower += 3;

  // Specific counter override
  if (defender.counteredBy.includes(attacker.name)) {
    // Defender wins automatically
    destroyCard(attacker, state);
    triggerVFX("neutralization"); // Mythic serpent clash
    return;
  }

  const damage = Math.max(0, attackPower - defensePower);
  // Apply damage, trigger onHit/onDestroy
  resolveAbility("onClash", { card: attacker, target: defender, state });
};