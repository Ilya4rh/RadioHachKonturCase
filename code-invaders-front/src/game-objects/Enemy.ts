export class Enemy extends Phaser.Physics.Arcade.Sprite {
    #inititalX: number;
    private frames: string[];
    private currentFrameIndex: number;
    private startTime: number;

    constructor(scene: Phaser.Scene, x: number, y: number, velocity: number) {
        const frames = ["blue_bug", "blue_bug1","blue_bug2","blue_bug3",];
        super(scene, x, y, frames[0]);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setVelocityY(velocity);
        this.#inititalX = x;

        this.frames = frames;
        this.currentFrameIndex = 0;
        this.startTime = scene.time.now;
    }

    update(time: number, speed?: number) {
        
        const waveY = Math.sin(time * 0.002) * 50;
        this.x = this.#inititalX + waveY;
        
        if (speed !== undefined) {
            this.setVelocity(speed);
        }

        const currentTime = this.scene.time.now;
        const elapsedTime = currentTime - this.startTime;
        const newFrameIndex = Math.floor(elapsedTime / 700) % this.frames.length;
        
        if (newFrameIndex !== this.currentFrameIndex) {
            this.currentFrameIndex = newFrameIndex;
            this.setTexture(this.frames[this.currentFrameIndex]);
        }
    }
}