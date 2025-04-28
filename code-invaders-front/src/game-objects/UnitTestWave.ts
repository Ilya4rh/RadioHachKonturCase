import {Projectile} from "./Projectile";

export class UnitTestWave extends Projectile {
    constructor(scene: Phaser.Scene) {
        super(scene, scene.scale.width / 2, scene.scale.height - 200, "unit_test_wave", -500);
        this.scaleX = 1.5;
    }
}