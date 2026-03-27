import Phaser from '../phaser-shim';

export class BattleScene extends Phaser.Scene {
    private prana: number = 0;
    private lastPranaTime: number = 0;
    private towers: any[] = [];
    private units: any[] = [];
    private projectiles: any[] = [];

    constructor() {
        super({ key: 'BattleScene' });
    }

    preload() {
        this.load.image('particle', 'https://labs.phaser.io/assets/particles/blue.png');
    }

    create() {
        this.matter.world.setBounds(0, 0, this.scale.width, this.scale.height);
        this.matter.world.setGravity(0, 0); // Ensure Zero G

        this.addDebris();

        // Towers
        this.createTower(50, this.scale.height / 2, 'player');
        this.createTower(this.scale.width - 50, this.scale.height / 2, 'enemy');

        this.game.events.on('spawn-unit', this.spawnUnit, this);

        // Collisions
        this.matter.world.on('collisionstart', (event: any) => {
            event.pairs.forEach((pair: any) => {
                this.handleCollision(pair.bodyA, pair.bodyB);
            });
        });
    }

    update(time: number, delta: number) {
        // Prana
        if (time > this.lastPranaTime + 1000) {
            if (this.prana < 10) {
                this.prana += 1;
                this.game.events.emit('prana-update', this.prana);
            }
            this.lastPranaTime = time;
        }

        // Unit Logic
        this.units.forEach(unit => {
            if (!unit.active) return;
            this.updateUnitBehavior(unit, time);
        });

        // Cleanup Projectiles
        this.projectiles.forEach((p, i) => {
            if (p.y < 0 || p.y > this.scale.height || p.x < 0 || p.x > this.scale.width) {
                p.destroy();
                this.projectiles.splice(i, 1);
            }
        });
    }

    private updateUnitBehavior(unit: any, time: number) {
        const body = unit.body;
        if (!body) return;

        const team = unit.getData('team');
        const range = unit.getData('range') || 150;
        const lastFire = unit.getData('lastFire') || 0;
        const fireRate = unit.getData('fireRate') || 1000;

        // 1. Find Target
        let target = this.findTarget(unit, range, team);

        // 2. Movement (Drift if no target or out of range)
        if (!target) {
            // Auto drift to enemy base
            const targetX = team === 'player' ? this.scale.width : 0;
            const targetY = this.scale.height / 2;

            if (body.speed < 1) {
                const angle = Phaser.Math.Angle.Between(unit.x, unit.y, targetX, targetY);
                this.matter.body.applyForce(body, body.position, {
                    x: Math.cos(angle) * 0.0002,
                    y: Math.sin(angle) * 0.0002
                });
            }
        }
        // 3. Combat
        else if (target) {
            // Face Target
            const angle = Phaser.Math.Angle.Between(unit.x, unit.y, target.x, target.y);

            // Fire
            if (time > lastFire + fireRate) {
                this.fireWeapon(unit, angle);
                unit.setData('lastFire', time);
            }
        }
    }

    private findTarget(self: any, range: number, myTeam: string) {
        let bestTarget = null;
        let minDist = range;

        // Check Units
        this.units.forEach(target => {
            if (target === self || target.getData('team') === myTeam || !target.active) return;
            const dist = Phaser.Math.Distance.Between(self.x, self.y, target.x, target.y);
            if (dist < minDist) {
                minDist = dist;
                bestTarget = target;
            }
        });

        // Check Towers (if no unit found closer)
        if (!bestTarget) {
            this.towers.forEach(tower => {
                if (tower.getData('team') === myTeam || !tower.active) return;
                const dist = Phaser.Math.Distance.Between(self.x, self.y, tower.x, tower.y);
                if (dist < minDist) {
                    minDist = dist;
                    bestTarget = tower;
                }
            });
        }

        return bestTarget;
    }

    private fireWeapon(unit: any, angle: number) {
        const type = unit.getData('type');
        const damage = unit.getData('damage');
        const recoil = unit.getData('recoil');
        const team = unit.getData('team');

        // 1. Spawn Projectile
        const projSpeed = type === 'sniper' ? 15 : 7;
        const color = team === 'player' ? 0xffff00 : 0xffaa00;

        const proj = this.add.circle(unit.x, unit.y, 4, color);
        this.matter.add.gameObject(proj, { label: 'projectile', frictionAir: 0, isSensor: true });

        proj.setData('damage', damage);
        proj.setData('team', team);

        this.projectiles.push(proj as any);

        const projBody = proj.body;
        this.matter.body.setVelocity(projBody, {
            x: Math.cos(angle) * projSpeed,
            y: Math.sin(angle) * projSpeed
        });

        // 2. Apply Recoil (Opposite to aim)
        const unitBody = unit.body;
        this.matter.body.applyForce(unitBody, unitBody.position, {
            x: -Math.cos(angle) * recoil,
            y: -Math.sin(angle) * recoil
        });
    }

    private handleCollision(bodyA: any, bodyB: any) {
        // Simple logic: Projectile hits Unit/Tower
        const goA = bodyA.gameObject;
        const goB = bodyB.gameObject;

        if (!goA || !goB) return;

        let projectile = null;
        let target = null;

        if (bodyA.label === 'projectile') { projectile = goA; target = goB; }
        else if (bodyB.label === 'projectile') { projectile = goB; target = goA; }

        if (projectile && target) {
            if (projectile.getData('team') !== target.getData('team')) {
                // Hit!
                const dmg = projectile.getData('damage');
                const hp = target.getData('hp') - dmg;
                target.setData('hp', hp);

                // Destroy Projectile
                projectile.destroy();
                // Remove from local list
                const idx = this.projectiles.indexOf(projectile);
                if (idx > -1) this.projectiles.splice(idx, 1);

                // Flash Feedback
                this.tweens.add({
                    targets: target,
                    alpha: 0.5,
                    duration: 50,
                    yoyo: true
                });

                if (hp <= 0) {
                    this.destroyEntity(target);
                }
            }
        }
    }

    private destroyEntity(entity: any) {
        if (this.towers.includes(entity)) {
            // Game Over Logic potentially
            entity.setAlpha(0.2); // Ruined
            entity.setActive(false);
        } else {
            entity.destroy();
            // Remove from list
            const idx = this.units.indexOf(entity);
            if (idx > -1) this.units.splice(idx, 1);
        }
    }

    private addDebris() {
        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(0, this.scale.width);
            const y = Phaser.Math.Between(0, this.scale.height);
            const size = Phaser.Math.Between(15, 40);
            const debris = this.add.rectangle(x, y, size, size, 0x334155);
            this.matter.add.gameObject(debris, { shape: 'rectangle', isStatic: true, angle: Phaser.Math.Between(0, 360) });
        }
    }

    private createTower(x: number, y: number, team: 'player' | 'enemy') {
        const color = team === 'player' ? 0x3b82f6 : 0xef4444;
        // Container for tower
        const shape = this.add.rectangle(0, 0, 60, 120, color);
        const container = this.add.container(x, y, [shape]);

        this.matter.add.gameObject(container, { isStatic: true, label: 'tower' });

        container.setData('team', team);
        container.setData('hp', 2000);
        this.towers.push(container);
    }

    private spawnUnit(data: { type: 'tank' | 'sniper' | 'swarm', x: number, y: number, team: 'player' | 'enemy' }) {
        const { type, x, y, team } = data;

        let stats = { hp: 100, damage: 20, range: 200, fireRate: 1000, recoil: 0.002, radius: 20, density: 0.001, color: 0xffffff };

        if (type === 'tank') {
            stats = { hp: 500, damage: 50, range: 100, fireRate: 2000, recoil: 0.01, radius: 30, density: 0.01, color: 0x3b82f6 };
        } else if (type === 'sniper') {
            stats = { hp: 80, damage: 80, range: 500, fireRate: 1500, recoil: 0.005, radius: 15, density: 0.001, color: 0x10b981 };
        } else if (type === 'swarm') {
            stats = { hp: 40, damage: 15, range: 150, fireRate: 800, recoil: 0.001, radius: 10, density: 0.0005, color: 0xf59e0b };
        }

        if (team === 'enemy') stats.color = 0xef4444;

        const shape = this.add.circle(0, 0, stats.radius, stats.color);
        const label = this.add.text(-5, -5, type ? type[0].toUpperCase() : 'U', { fontSize: '10px', color: '#000' });
        const container = this.add.container(x, y, [shape, label]);

        const body = this.matter.add.circle(x, y, stats.radius, {
            frictionAir: 0.1, // Space friction
            restitution: 0.6,
            density: stats.density,
            label: 'unit'
        });

        this.matter.add.gameObject(container, body);

        container.setData('type', type);
        container.setData('team', team);
        container.setData('hp', stats.hp);
        container.setData('damage', stats.damage);
        container.setData('range', stats.range);
        container.setData('fireRate', stats.fireRate);
        container.setData('recoil', stats.recoil);
        container.setData('lastFire', 0);

        this.units.push(container);
    }
}
