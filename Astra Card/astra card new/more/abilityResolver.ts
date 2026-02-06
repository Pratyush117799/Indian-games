// abilityResolver.ts
import { Weapon, AbilityKeyword, GameEvent } from './types';
import { ClassicGameState } from './classicState'; // Define your states
import { ClashGameState, ClashEntity } from './clashState';

type ResolverContext = {
  card: Weapon;
  owner: 'player' | 'opponent';
  target?: Weapon | ClashEntity; // Flexible for modes
  state: ClassicGameState | ClashGameState;
};

export const resolveAbility = (event: GameEvent, context: ResolverContext): void => {
  if (!context.card.ability) return;

  const abilities = context.card.ability.split(';').map(a => a.trim()); // Multi-ability support

  abilities.forEach(ability => {
    const keyword = ability.split(' - ')[0] as AbilityKeyword;

    switch (keyword) {
      case "Eternal":
        if (event === "onDestroy") {
          // Return to hand (Classic) or deck (Clash balance)
          if ('hand' in context.state) { // Classic
            (context.state as ClassicGameState).players[context.owner].hand.push(context.card);
          }
          console.log(`${context.card.name} returns eternally!`);
          // VFX hook: Golden bounce back with serpent particles
        }
        break;

      case "Stun":
        if (event === "onHit" && context.target) {
          // Skip next action/attack
          if ('entities' in context.state) { // Clash
            const entity = context.target as ClashEntity;
            entity.attackSpeed *= 2; // Double cooldown temporary
            entity.status = "Stunned"; // For UI icon
          }
          // VFX: Lightning freeze frame
        }
        break;

      case "Return":
        if (event === "onHit") {
          // Sudarshana-style return
          (context.state as ClassicGameState).players[context.owner].hand.push(context.card);
          // VFX: Boomerang spin trail
        }
        break;

      case "Cataclysm":
        if (event === "onPlay" && !hasCounter(context)) { // Custom counter check
          // Field wipe (Clash) or direct life drain (Classic)
          if ('entities' in context.state) {
            (context.state as ClashGameState).entities = [];
          }
          // VFX: Apocalyptic explosion particles
        }
        break;

      case "Unstoppable": // Narayanastra nuance
        if (event === "onClash") {
          // Prompt surrender or grow stronger
          // In digital: Opponent choice modal
        }
        break;

      // Add more keywords easily...
    }
  });
};

// Helper for supreme counters
const hasCounter = (context: ResolverContext): boolean => {
  // Scan opponent hand/field for counteredBy match
  return false; // Placeholder logic
};