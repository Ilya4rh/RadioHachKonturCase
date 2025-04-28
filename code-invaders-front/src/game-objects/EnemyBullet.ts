import {Projectile} from "./Projectile";

export class EnemyBullet extends Projectile {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "enemy_bullet", 800);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}