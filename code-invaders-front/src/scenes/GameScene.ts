import Phaser from "phaser";
import programmer from "../images/programmer.png";
import moon from "../images/moon.png";
import coin from "../images/coin.png";
import blue_bug from "../images/blue_bug.png";
import {Enemy} from "../game-objects/Enemy";
import {Programmer} from "../game-objects/Programmer";
import bullet from "../images/bullet.png";
import enemy_bullet from "../images/enemy_bullet.png";
import {Bullet} from "../game-objects/Bullet";
import memory_leak from "../images/memory_leak.png";
import {MemoryLeak} from "../game-objects/MemoryLeak";
import unit_test_wave_icon from "../images/unit_test_wave_icon.png";
import {UnitTestWaveBonus} from "../game-objects/UnitTestWaveBonus";
import unit_test_wave from "../images/unit_test_wave.png";
import {UnitTestWave} from "../game-objects/UnitTestWave";
import {EnemyBullet} from "../game-objects/EnemyBullet";
import {Projectile} from "../game-objects/Projectile";

export class GameScene extends Phaser.Scene
{
    programmer: Programmer | null;
    enemies: Enemy[];
    enemiesSpawnCount: number;
    enemiesSpeed: number;
    coinsCountText: Phaser.GameObjects.Text | null;

    constructor() {
        super({key: "GameScene"});
        this.enemies = [];
        this.programmer = null;
        this.enemiesSpawnCount = 5;
        this.enemiesSpeed = 50;
        this.coinsCountText = null;
    }

    preload ()
    {
        this.load.image('programmer', programmer);
        this.load.image('moon', moon);
        this.load.image('coin', coin);
        this.load.image('blue_bug', blue_bug);
        this.load.image('bullet', bullet);
        this.load.image('enemy_bullet', enemy_bullet);
        this.load.image('memory_leak', memory_leak);
        this.load.image('unit_test_wave_icon', unit_test_wave_icon);
        this.load.image('unit_test_wave', unit_test_wave);
    }

    create ()
    {
         this.coinsCountText = this.add.text(940, 235, "0", {fontSize: 64, align: "right"})
            .setOrigin(1, 0.5).setDepth(1);
        this.add.image(980, 230, "coin").setScale(0.5).setDepth(1);
        this.add.image(500, 1650, "moon").setScale(1.5);

        this.programmer = new Programmer(this, this.scale.width / 2, this.scale.height - 100);
        this.time.addEvent({
            delay: 700,
            callback: () => {
                const newBullet = new Bullet(this, this.programmer!.x, this.programmer!.y);
                this.physics.add.collider(newBullet, this.enemies,
                    (bullet, enemy) => {
                    bullet.destroy(true);
                    this.destroyEnemy(enemy);
                });
            },
            loop: true
        });
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                if (this.enemies.length > 0) {
                    const shooter = this.enemies[Math.floor(Math.random() * this.enemies.length)];
                    const newEnemyBullet = new EnemyBullet(this, shooter.x, shooter.y);
                    this.physics.add.collider(newEnemyBullet, this.programmer!,
                        (bullet, enemy) => {
                            bullet.destroy(true);
                            window.location.reload();
                        });
                }
            },
            loop: true
        });
        this.time.addEvent({
            delay: 6000,
            callback: () => {
                const randomBonusNumber = Math.floor(Math.random() * 2);
                if (randomBonusNumber === 0){
                    const leak = new MemoryLeak(this);
                    this.physics.add.collider(leak, this.programmer!,
                        (a, b) => {
                            a.destroy(true);
                            this.enemies.forEach(x => x.update(this.time.now, 0));
                    });
                }
                if (randomBonusNumber === 1){
                    const leak = new UnitTestWaveBonus(this);
                    this.physics.add.collider(leak, this.programmer!,
                        (a, b) => {
                            a.destroy(true);
                            const wave = new UnitTestWave(this);
                            this.physics.add.collider(wave, this.enemies,
                                (_, enemy) => {
                                    this.destroyEnemy(enemy);
                            });
                    });
                }
            },
            loop: true
        });
        this.addEnemies(this.enemiesSpawnCount);
    }

    addEnemies(count: number) {
        for(let i = 0; i < count; i++) {
            if (this.enemies.length > 0){
                const lastEnemy = this.getLastEnemy();
                if (lastEnemy.x + 30 > this.scale.width - 300)
                    this.enemies.push(new Enemy(this, 150, lastEnemy.y + 200, this.enemiesSpeed))
                else
                    this.enemies.push(new Enemy(this, lastEnemy.x + 200, lastEnemy.y, this.enemiesSpeed))
            }
            else{
                this.enemies.push(new Enemy(this, 150, 50, this.enemiesSpeed))
            }
        }
        const bullets = this.children.list
            .filter(obj => obj instanceof Bullet);
        this.physics.add.collider(bullets, this.enemies,
            (bullet, enemy) => {
                bullet.destroy(true);
                this.destroyEnemy(enemy);
            });
        const waves = this.children.list
            .filter(obj => obj instanceof UnitTestWave);
        this.physics.add.collider(waves, this.enemies,
            (_, enemy) => {
                this.destroyEnemy(enemy);
            });
        this.physics.add.collider(this.programmer!, this.enemies, () => window.location.reload());
    }

    getLastEnemy(): Enemy {
        return this.enemies.reduce(function(prev, curr) {
            if (prev.y < curr.y)
                return curr;
            if (prev.y > curr.y)
                return prev;
            return prev.x > curr.x ? prev : curr;
        });
    }

    update(time: number, delta: number) {
        this.children.list.forEach(x => x.update(time));
    }

    destroyEnemy(enemy:  Phaser.Physics.Arcade.Body |
        Phaser.Physics.Arcade.StaticBody |
        Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody){
        enemy.destroy(true);
        this.coinsCountText!.setText((parseInt(this.coinsCountText!.text) + 10).toString());
        this.enemies = this.enemies.filter(x => x !== enemy);
        if (this.enemies.length === 0){
            this.enemiesSpeed += 10;
            this.enemiesSpawnCount += 1;
            this.addEnemies(this.enemiesSpawnCount);
        }
    }
}