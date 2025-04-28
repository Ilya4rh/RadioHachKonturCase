export class MemoryLeak extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene) {
        const x = Math.random() * 500 + 300;
        super(scene, x, 50, "memory_leak");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setVelocityY(500);
    }
}