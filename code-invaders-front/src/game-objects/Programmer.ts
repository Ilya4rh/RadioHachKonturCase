export class Programmer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "programmer");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body!.pushable = false;
        this.setInteractive({
            draggable: true
        });
        this.scene.input.on('pointermove', (pointer: any) => {
            this.x = pointer.x;
            this.y = pointer.y;
        })
    }
}