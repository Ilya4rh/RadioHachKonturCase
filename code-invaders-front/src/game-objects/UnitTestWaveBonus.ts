export class UnitTestWaveBonus extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene) {
        const x = Math.random() * 500 + 300;
        super(scene, x, 50, "unit_test_wave_icon");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setVelocityY(500);
    }
}