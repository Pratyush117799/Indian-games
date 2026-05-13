import { Weapon, ElementType, Tier } from '../types';

// The Counter Matrix - Defines what beats what
const ELEMENTAL_CHART: Record<string, string[]> = {
    'Fire': ['Wind', 'Ice', 'Wood', 'Physical'],
    'Water': ['Fire', 'Heat', 'Earth'], // Wait, Earth beats Water in some myths, this chart says Water beats Fire
    'Wind': ['Water', 'Cloud', 'Earth'], // Dispersal
    'Earth': ['Thunder', 'Wind'], // Grounding
    'Thunder': ['Water', 'Metal'],
    'Serpent': ['Wind', 'Physical'],
    'Divine': ['Fire', 'Water', 'Wind', 'Earth', 'Thunder', 'Serpent', 'Physical'],
};

// Tier Hierarchy
const TIER_VALUE: Record<Tier, number> = {
    'Supreme': 4,
    'Celestial': 3,
    'Elemental': 2,
    'Conventional': 1,
};

export const calculateCombatResult = (attacker: Weapon, defender: Weapon) => {
    let attackPower = attacker.power;
    let defensePower = defender.power;
    const log: string[] = [];

    // 1. Check Tiers
    if (TIER_VALUE[attacker.tier] > TIER_VALUE[defender.tier]) {
        attackPower += 2;
        log.push(`${attacker.name} overpowers ${defender.name} due to higher Tier! (+2 Power)`);
    }

    // 2. Check Elemental Counters
    const attackerElements = attacker.element.split('/');
    const defenderElements = defender.element.split('/');

    let counterBonus = 0;
    attackerElements.forEach(aEl => {
        if (ELEMENTAL_CHART[aEl]) {
            defenderElements.forEach(dEl => {
                if (ELEMENTAL_CHART[aEl].includes(dEl)) {
                    counterBonus += 3; // +3 as per manual
                    log.push(`${aEl} counters ${dEl}! (+3 Power)`);
                }
            });
        }
    });

    // 3. Explicit Counters (Mythological Override)
    // If matched, the attacker automatically wins the clash.
    const isSpecificCounter = attacker.counters.some(c => 
        defender.name.toLowerCase().includes(c.toLowerCase()) || 
        defender.element.toLowerCase().includes(c.toLowerCase())
    );

    if (isSpecificCounter) {
        log.push(`${attacker.name} specifically counters ${defender.name}! Mythological Neutralization (Auto-win)!`);
        return {
            winner: 'attacker',
            damageDealt: attacker.power, // Deals full power as damage in case of auto-win? 
            // Or difference? Manual says "Countering card wins the clash automatically".
            // I'll assume it bypasses defense.
            log,
            neutralized: true
        };
    }

    const totalAttack = attackPower + counterBonus;

    // Determine Winner
    const damage = Math.max(0, totalAttack - defensePower);

    return {
        winner: totalAttack >= defensePower ? 'attacker' : 'defender',
        damageDealt: damage,
        log,
        neutralized: false
    };
};
