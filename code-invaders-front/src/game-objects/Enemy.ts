import {Events} from "matter";
import UPDATE = Phaser.Scenes.Events.UPDATE;

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    #inititalX: number;
    constructor(scene: Phaser.Scene, x: number, y: number, velocity: number) {
        super(scene, x, y, "blue_bug");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setVelocityY(velocity);
        this.#inititalX = x;
    }

    update(time: number, speed?: number) {
        const waveY = Math.sin(time * 0.002) * 50;
        this.x = this.#inititalX + waveY;
        if (speed !== undefined)
            this.setVelocity(speed);
    }
}