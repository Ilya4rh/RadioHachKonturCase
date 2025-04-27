import Phaser from "phaser";
import programmer from "../images/programmer.png";
import moon from "../images/moon.png";
import coin from "../images/coin.png";
import blue_bug from "../images/blue_bug.png";
import {Enemy} from "../game-objects/Enemy";
import {Programmer} from "../game-objects/Programmer";
import bullet from "../images/bullet.png";
import {Bullet} from "../game-objects/Bullet";

export class GameScene extends Phaser.Scene
{
    programmer: Programmer | null;
    enemies: Enemy[];
    enemiesSpawnCount: number;
    enemiesSpeed: number;

    constructor() {
        super({key: "GameScene"});
        this.enemies = [];
        this.programmer = null;
        this.enemiesSpawnCount = 5;
        this.enemiesSpeed = 50;
    }

    preload ()
    {
        this.load.image('programmer', programmer);
        this.load.image('moon', moon);
        this.load.image('coin', coin);
        this.load.image('blue_bug', blue_bug);
        this.load.image('bullet', bullet);
    }

    create ()
    {
        const coinsCountText = this.add.text(940, 235, "0", {fontSize: 64, align: "right"})
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
                    enemy.destroy(true);
                    this.enemies = this.enemies.filter(x => x != enemy);
                    coinsCountText.setText((parseInt(coinsCountText.text) + 10).toString());
                    if (this.enemies.length === 0){
                        this.enemiesSpeed += 20;
                        this.enemiesSpawnCount += 2;
                        this.addEnemies(this.enemiesSpawnCount);
                    }
                });
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
                this.enemies.push(new Enemy(this, 150, 100, this.enemiesSpeed))
            }
        }
        this.physics.add.collider(this.programmer!, this.enemies, () => this.programmer!.destroy(true));
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
        this.enemies.forEach(x => x.update(time, delta));
    }
}