import {Projectile} from "./Projectile";

export class Bullet extends Projectile {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "bullet", -800);
    }
}