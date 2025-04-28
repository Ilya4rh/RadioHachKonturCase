export abstract class Projectile extends Phaser.Physics.Arcade.Sprite {
    protected constructor(scene: Phaser.Scene, x: number, y: number, image: string, velocity: number) {
        super(scene, x, y, image);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setVelocityY(velocity);
        this.body!.pushable = false;
    }

    update(time: number, delta: number) {
        if (this.y < 0 || this.y > this.scene.scale.height) {
            this.destroy(true);
        }
    }
}