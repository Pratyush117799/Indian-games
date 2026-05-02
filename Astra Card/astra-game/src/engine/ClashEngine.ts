import { ClashEntity, Projectile } from '../types';

export const TICK_RATE = 60; // Updates per second
export const LANE_WIDTH = 100;

// Helper to calculate distance between two entities
export const getDistance = (a: ClashEntity | Projectile, b: ClashEntity) => {
    // Basic Pythogoras for 2D field, normalized to X/Y percent
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    // We treat Y slightly more valuable in distance for lane logic, but for simple combat:
    return Math.sqrt(dx * dx + dy * dy);
};

interface GameStateResult {
    entities: ClashEntity[];
    projectiles: Projectile[];
    combatEvents: { type: 'hit', x: number, y: number }[];
}

export const updateGameState = (
    entities: ClashEntity[],
    projectiles: Projectile[],
    timestamp: number
): GameStateResult => {
    const newProjectiles: Projectile[] = [];
    const combatEvents: { type: 'hit', x: number, y: number }[] = [];

    // --- 1. Entity Logic (Move & Attack) ---
    const nextEntities = entities.map(entity => {
        // Dead Check
        if (entity.health <= 0) return entity;

        // Target Acquisition (Naive: closest enemy in range)
        let target: ClashEntity | null = null;
        let minDist = entity.range;

        // Optimization: Pre-filter enemies
        const enemies = entities.filter(e => e.team !== entity.team && e.health > 0);

        let closestDist = 999;

        enemies.forEach(enemy => {
            const dist = getDistance(entity, enemy);
            // Valid target if close enough AND (in same lane OR is tower/flying)
            // For simplicity, towers range everything, units stick to lane
            if (dist < closestDist) {
                if (entity.type === 'tower' || enemy.type === 'tower' || Math.abs(entity.x - enemy.x) < 20) {
                    closestDist = dist;
                    target = enemy;
                }
            }
        });

        const newEntity = { ...entity };

        // Attack Logic
        if (target && closestDist <= entity.range) {
            newEntity.isMoving = false;
            newEntity.targetId = (target as ClashEntity).id;

            // Attack Cooldown
            if (timestamp - entity.lastAttackTime >= entity.attackSpeed) {
                newEntity.lastAttackTime = timestamp;

                // Spawn Projectile
                newProjectiles.push({
                    id: `proj-${entity.id}-${timestamp}`,
                    ownerId: entity.id,
                    targetId: (target as ClashEntity).id,
                    x: entity.x,
                    y: entity.y,
                    damage: entity.damage,
                    speed: 30, // Units per second
                    visual: entity.templateId.includes('Brahmastra') ? 'vajra' : 'arrow',
                    team: entity.team
                });
            }
        }
        // Movement Logic
        else if (entity.type === 'unit') {
            newEntity.isMoving = true;
            newEntity.targetId = null;

            // Move towards enemy base
            const direction = entity.team === 'player' ? 1 : -1;

            // Simple Pathfinding: Move Y towards goal, Move X towards lane center (25 or 75)
            const targetX = entity.lane === 'left' ? 25 : 75;
            const moveSpeedTick = entity.movementSpeed / TICK_RATE;

            newEntity.y += moveSpeedTick * direction;

            // X correction
            if (Math.abs(newEntity.x - targetX) > 1) {
                newEntity.x += (targetX > newEntity.x ? 1 : -1) * (moveSpeedTick * 0.5);
            }

            // Clamp
            newEntity.y = Math.max(0, Math.min(100, newEntity.y));
        }

        return newEntity;
    });

    // --- 2. Projectile Logic (Move & Hit) ---
    const activeProjectiles: Projectile[] = [];
    const damageMap = new Map<string, number>();

    [...projectiles, ...newProjectiles].forEach(proj => {
        const target = entities.find(e => e.id === proj.targetId);

        // If target dead/gone, remove projectile (or loop to generic loc)
        if (!target || target.health <= 0) return;

        const dist = getDistance(proj, target);
        const moveAmt = proj.speed / TICK_RATE;

        if (dist <= moveAmt) {
            // HIT!
            const currentDmg = damageMap.get(target.id) || 0;
            damageMap.set(target.id, currentDmg + proj.damage);
            combatEvents.push({ type: 'hit', x: target.x, y: target.y });
        } else {
            // Move towards target
            const dx = target.x - proj.x;
            const dy = target.y - proj.y;
            const angle = Math.atan2(dy, dx);

            proj.x += Math.cos(angle) * moveAmt;
            proj.y += Math.sin(angle) * moveAmt;
            activeProjectiles.push(proj);
        }
    });

    // --- 3. Apply Damage ---
    const finalEntities = nextEntities.map(e => {
        const dmg = damageMap.get(e.id);
        if (dmg) {
            return { ...e, health: e.health - dmg };
        }
        return e;
    }).filter(e => e.health > 0);

    return {
        entities: finalEntities,
        projectiles: activeProjectiles,
        combatEvents
    };
};
