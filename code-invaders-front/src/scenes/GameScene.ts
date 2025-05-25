import Phaser from "phaser";
import programmer from "../images/programmer.png";
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
import background from "../images/background.png";
import red_bug_for_menu from "../images/red_bug_for_menu.png";
import blue_bug_1 from "../images/blue_bug1.png";
import blue_bug_2 from "../images/blue_bug2.png";
import blue_bug_3 from "../images/blue_bug3.png";
import explosion_1 from "../images/explosion1.png";
import explosion_2 from "../images/explosion2.png";
import explosion_3 from "../images/explosion3.png";
import explosion_4 from "../images/explosion4.png";

interface GameData {
    tournamentId: string;
    playerName: string;
}

export class GameScene extends Phaser.Scene
{
    programmer: Programmer | null;
    enemies: Enemy[];
    enemiesSpawnCount: number;
    enemiesSpeed: number;
    coinsCountText: Phaser.GameObjects.Text | null;
    score: number;
    tournamentId: string | null;
    playerName: string | null;
    isGameOver: boolean;

    constructor() {
        super({key: "GameScene"});
        this.enemies = [];
        this.programmer = null;
        this.enemiesSpawnCount = 5;
        this.enemiesSpeed = 100;
        this.coinsCountText = null;
        this.score = 0;
        this.tournamentId = null;
        this.playerName = null;
        this.isGameOver = false;
    }

    init(data: GameData) {
        this.tournamentId = data.tournamentId;
        this.playerName = data.playerName;
        this.score = 0;
        this.enemies = [];
        this.enemiesSpawnCount = 5;
        this.enemiesSpeed = 100;
        this.isGameOver = false;
    }

    preload ()
    {
        this.load.image('programmer', programmer);
        this.load.image('coin', coin);
        this.load.image('blue_bug', blue_bug);
        this.load.image('blue_bug1', blue_bug_1);
        this.load.image('blue_bug2', blue_bug_2);
        this.load.image('blue_bug3', blue_bug_3);
        this.load.image('bullet', bullet);
        this.load.image('enemy_bullet', enemy_bullet);
        this.load.image('memory_leak', memory_leak);
        this.load.image('unit_test_wave_icon', unit_test_wave_icon);
        this.load.image('unit_test_wave', unit_test_wave);
        this.load.image('background', background);
        this.load.image('red_bug_for_menu', red_bug_for_menu);
        this.load.image('explosion1', explosion_1);
        this.load.image('explosion2', explosion_2);
        this.load.image('explosion3', explosion_3);
        this.load.image('explosion4', explosion_4);
    }

    create ()
    {
        this.children.removeAll();
        this.physics.world.colliders.destroy();
        this.time.removeAllEvents();
        this.add.image(550, 900, "background").setScale(2, 2);
        this.coinsCountText = this.add.text(940, 235, this.score.toString(), {fontSize: 64, align: "right"})
            .setOrigin(1, 0.5).setDepth(1);
        this.add.image(980, 230, "coin").setScale(0.5).setDepth(1);

        this.programmer = new Programmer(this, this.scale.width / 2, this.scale.height - 100);


        this.time.addEvent({
            delay: 700,
            callback: () => {
                 if (this.isGameOver || !this.programmer || !this.programmer.active) return;

                const newBullet = new Bullet(this, this.programmer!.x, this.programmer!.y);
                this.physics.add.collider(newBullet, this.enemies.filter(e => e.active),
                    (bullet, enemy) => {
                        const bulletInstance = bullet as Bullet;
                        const enemyInstance = enemy as Enemy;
                        if (bulletInstance.active && enemyInstance.active) {
                           bulletInstance.destroy(true);
                           this.destroyEnemy(enemyInstance);
                        }
                });
            },
            loop: true
        });

        this.time.addEvent({
            delay: 3000,
            callback: () => {
                 if (this.isGameOver) return;

                const activeEnemies = this.enemies.filter(e => e.active && e.y > 0);
                if (activeEnemies.length > 0) {
                    const shooter = activeEnemies[Math.floor(Math.random() * activeEnemies.length)];
                     if (shooter && this.programmer && this.programmer.active) { 
                       const newEnemyBullet = new EnemyBullet(this, shooter.x, shooter.y);
                       this.physics.add.collider(newEnemyBullet, this.programmer!,
                           (bullet, programmer) => {
                                const bulletInstance = bullet as EnemyBullet;
                                const programmerInstance = programmer as Programmer;
                               if (bulletInstance.active && programmerInstance.active) {
                                 bulletInstance.destroy(true);
                                 this.gameOver();
                               }
                           });
                     }
                }
            },
            loop: true
        });

        this.time.addEvent({
            delay: 30000,
            callback: () => {
                if (this.isGameOver) return;

                const randomBonusNumber = Math.floor(Math.random() * 2);
                if (randomBonusNumber === 0){
                    const leak = new MemoryLeak(this);
                    this.physics.add.collider(leak, this.programmer!,
                        (leakBonus, programmer) => {
                             const leakInstance = leakBonus as MemoryLeak;
                             const programmerInstance = programmer as Programmer;
                             if (leakInstance.active && programmerInstance.active) {
                                leakInstance.destroy(true);
                                this.enemies.filter(x => x.active && x.y > 0).forEach(x => {
                                    if (x.body instanceof Phaser.Physics.Arcade.Body) {
                                        x.body.setVelocityY(0);
                                    }
                                });
                             }
                    });
                }
                if (randomBonusNumber === 1){
                    const bonus = new UnitTestWaveBonus(this);
                    this.physics.add.collider(bonus, this.programmer!,
                        (waveBonus, programmer) => {
                            const bonusInstance = waveBonus as UnitTestWaveBonus;
                            const programmerInstance = programmer as Programmer;
                            if (bonusInstance.active && programmerInstance.active) {
                               bonusInstance.destroy(true);
                               const wave = new UnitTestWave(this);
                               this.physics.add.collider(wave, this.enemies.filter(e => e.active),
                                   (waveInstance, enemy) => {
                                        const waveObj = waveInstance as UnitTestWave;
                                        const enemyInstance = enemy as Enemy;
                                       if (waveObj.active && enemyInstance.active) {
                                        this.destroyEnemy(enemyInstance);
                                       }
                               });
                            }
                    });
                }
            },
            loop: true
        });

        this.addEnemies(this.enemiesSpawnCount);

    this.anims.create({
        key: 'explode_anim',
        frames: [
            { key: 'explosion1' },
            { key: 'explosion2' },
            { key: 'explosion3' },
            { key: 'explosion4' },
        ],
        frameRate: 12,
        repeat: 0
    });
    }

    addEnemies(count: number) {
        if (this.isGameOver) return;

        for(let i = 0; i < count; i++) {
            let newEnemy: Enemy | null = null;
            if (this.enemies.length > 0){
                const lastEnemy = this.getLastEnemy();
                if (lastEnemy) {
                    if (lastEnemy.x + 200 > this.scale.width - 100) {
                        newEnemy = new Enemy(this, 150, lastEnemy.y - 200, this.enemiesSpeed);
                    } else {
                        newEnemy = new Enemy(this, lastEnemy.x + 200, lastEnemy.y, this.enemiesSpeed);
                    }
                 } else {
                     newEnemy = new Enemy(this, 150, -50, this.enemiesSpeed);
                 }
            }
            else{
                 newEnemy = new Enemy(this, 150, -50, this.enemiesSpeed);
            }

             if (newEnemy) {
                this.enemies.push(newEnemy);
                this.physics.add.collider(this.programmer!, newEnemy, (programmer, enemy) => {
                     const programmerInstance = programmer as Programmer;
                     const enemyInstance = enemy as Enemy;
                     if (programmerInstance.active && enemyInstance.active) {
                        this.gameOver();
                     }
                });
             }
        }

        const waves = this.children.list.filter(x => x.active && x instanceof UnitTestWave);
        this.physics.add.collider(waves, this.enemies.filter(e => e.active),
            (waveInstance, enemy) => {
                const waveObj = waveInstance as UnitTestWave;
                const enemyInstance = enemy as Enemy;
                if (waveObj.active && enemyInstance.active) {
                    this.destroyEnemy(enemyInstance);
                }
            });
        const bullets = this.children.list.filter(x => x.active && x instanceof Bullet);
        this.physics.add.collider(bullets, this.enemies.filter(e => e.active),
            (bullet, enemy) => {
                const bulletInstance = bullet as Bullet;
                const enemyInstance = enemy as Enemy;
                if (bulletInstance.active && enemyInstance.active) {
                    bulletInstance.destroy(true);
                    this.destroyEnemy(enemyInstance);
                }
            });
    }

    getLastEnemy(): Enemy | null {
        const activeEnemies = this.enemies.filter(e => e.active);
        if (activeEnemies.length === 0) return null;

        return activeEnemies.reduce((prev, curr) => {
            if (prev.y > curr.y) return curr;
            if (prev.y < curr.y) return prev;
            return prev.x > curr.x ? prev : curr;
        });
    }

    update(time: number, delta: number) {
         if (this.isGameOver) return;

        this.children.list.forEach(x => {
             if (typeof (x as any).update === 'function') {
                 (x as any).update(time);
             }
        });

         this.enemies.forEach(enemy => {
             if (enemy.active && enemy.y > this.scale.height - 50) {
                 this.gameOver();
             }
         });
    }

    destroyEnemy(enemy: Enemy){
         if (!enemy.active || this.isGameOver) return;

        enemy.destroy(true);
        this.createExplosion(enemy.x, enemy.y);
        this.score += 10;
        this.coinsCountText!.setText(this.score.toString());

        const activeEnemies = this.enemies.filter(e => e.active);
        if (activeEnemies.length === 0){
            this.enemiesSpeed += 10;
            this.enemiesSpawnCount += 1;
            this.addEnemies(this.enemiesSpawnCount);
        }
    }

    async gameOver() {
         if (this.isGameOver) return;

        this.isGameOver = true;
        this.physics.pause();
        if (this.programmer) this.programmer.setActive(false).setVisible(false);

        this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'Game Over', { fontSize: '96px', color: '#ff0000', align: 'center' }).setOrigin(0.5);
        this.add.text(this.scale.width / 2, this.scale.height / 2, `Ваш счет: ${this.score}`, { fontSize: '48px', color: '#ffffff', align: 'center' }).setOrigin(0.5);

        if (this.tournamentId && this.playerName) {
            try {
                const response = await fetch('http://84.201.156.127:5085/api/gameResults/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'text/plain',
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: JSON.stringify({
                        tournamentId: this.tournamentId,
                        playerName: this.playerName,
                        numberOfPoints: this.score,
                    }),
                });

                if (response.ok) {
                    this.add.text(this.scale.width / 2, this.scale.height / 2 + 150, 'Результат сохранен!', { fontSize: '24px', color: '#ccffcc', align: 'center' }).setOrigin(0.5);
                } else {
                    const errorText = await response.text();

                    this.add.text(this.scale.width / 2, this.scale.height / 2 + 150, 'Не удалось сохранить результат.', { fontSize: '24px', color: '#ffdddd', align: 'center' }).setOrigin(0.5);
                }
            } catch (error) {

                this.add.text(this.scale.width / 2, this.scale.height / 2 + 150, 'Ошибка сети при сохранении.', { fontSize: '24px', color: '#ffdddd', align: 'center' }).setOrigin(0.5);
            }
        } else {

             this.add.text(this.scale.width / 2, this.scale.height / 2 + 150, 'Ошибка: Не найдены данные турнира/игрока.', { fontSize: '24px', color: '#ffdddd', align: 'center' }).setOrigin(0.5);
        }

         const backButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 250, 'В главное меню', {
             fontSize: '40px',
             color: '#00ff00',
             backgroundColor: '#333333',
             padding: { x: 20, y: 10 },
             align: 'center'
         })
         .setOrigin(0.5)
         .setInteractive({ useHandCursor: true })
         .on('pointerdown', () => {
             this.scene.start('MainMenuScene');
         });
    }

    private createExplosion(x: number, y: number) {
        const explosion = this.add.sprite(x, y, 'programmer');
        
        explosion.play('explode_anim');
        
        explosion.once('animationcomplete', () => {
            explosion.destroy();
        });
    }
}