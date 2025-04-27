import Phaser from "phaser";
import programmer from "../images/programmer.png";
import moon from "../images/moon.png";
import coin from "../images/coin.png";

export class GameScene extends Phaser.Scene
{
    constructor() {
        super({key: "GameScene"});
    }

    preload ()
    {
        this.load.image('programmer', programmer);
        this.load.image('moon', moon);
    }

    create ()
    {
        let coinsCount = 0;
        const coinsCountText = this.add.text(100, 200, '');
        this.add.image(500, 1650, "moon").setScale(1.5);

        const programmer = this.add.image(540, 1650, "programmer");
        programmer.setInteractive({
            draggable: true
        })

        programmer.on("drag", (pointer: any, x: number, y: number) => {
            programmer.x = x;
            programmer.y = y;
        })
    }
}