export type Tier = "Supreme" | "Celestial" | "Elemental" | "Conventional";
export type Rarity = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";
export type ElementType = "Divine" | "Fire" | "Water" | "Wind" | "Earth" | "Thunder" | "Serpent" | "Physical";

export interface Weapon {
    id: number;
    name: string;
    tier: Tier;
    power: number;
    mantraCost: number;
    element: string; // Keeping as string to allow for "Divine/Fire" composites
    counters: string[];
    counteredBy: string[];
    rarity: Rarity;
    description: string;
    ability?: {
        name?: string;
        effect: string;
    };
    image?: string; // Placeholder for asset path
}

export interface PlayerStats {
    life: number;
    mantra: number;
    deck: Weapon[];
    hand: Weapon[];
    graveyard: Weapon[];
}

// --- CLASH MODE TYPES ---

export type Team = 'player' | 'enemy';
export type EntityType = 'tower' | 'unit' | 'spell' | 'projectile';

export interface Projectile {
    id: string;
    ownerId: string;
    targetId: string;
    x: number;
    y: number;
    damage: number;
    speed: number;
    visual: 'arrow' | 'vajra' | 'fireball';
    team: Team;
}

export interface ClashEntity {
    id: string;
    templateId: string; // Refers to the Card ID if spawned from card
    team: Team;
    type: EntityType;

    // Position
    x: number; // 0-100 (Lane width)
    y: number; // 0-100 (Field length, 0=Player Base, 100=Enemy Base)
    lane: 'left' | 'right';

    // Stats
    health: number;
    maxHealth: number;
    damage: number;
    range: number; // 0-100 scale generally
    attackSpeed: number; // Cooldown in ms
    movementSpeed: number; // Units per tick

    // State
    targetId?: string | null;
    lastAttackTime: number;
    isMoving: boolean;

    // Visuals
    name: string;
    avatar?: string;
}

export interface DeploymentCard {
    id: string;
    weaponId: number;
    cost: number;
    cooldown: number; // Time until playable again
    type: 'unit' | 'spell';
}
