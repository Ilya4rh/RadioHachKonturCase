import Phaser from "phaser";
import programmer from "../images/programmer.png";
import code_title from "../images/code_title.png";
import invaders_title from "../images/invaders_title.png";
import moon from "../images/moon.png";
import start_button from "../images/start_button.png";
import blue_bug_for_menu from "../images/blue_bug_for_menu.png";
import red_bug_for_menu from "../images/red_bug_for_menu.png";
import star from "../images/star.png";

export class MainMenuScene extends Phaser.Scene
{
    constructor() {
        super({key: "MainMenuScene"});
    }

    preload ()
    {
        this.load.image('code_title', code_title);
        this.load.image('invaders_title', invaders_title);
        this.load.image('moon', moon);
        this.load.image('start_button', start_button);
        this.load.image('blue_bug_for_menu', blue_bug_for_menu);
        this.load.image('red_bug_for_menu', red_bug_for_menu);
        this.load.image('star', star);
    }

    create ()
    {
        this.add.image(550, 300, "code_title");
        this.add.image(550, 500, "invaders_title");
        this.add.image(500, 1650, "moon").setScale(1.5);
        this.add.image(660, 900, "blue_bug_for_menu");
        this.add.image(160, 1000, "red_bug_for_menu");
        this.add.image(100, 600, 'star');
        this.add.image(50, 1200, 'star');
        this.add.image(1020, 200, 'star');
        this.add.image(900, 1000, 'star');
        this.add.image(540, 1150, "start_button").setInteractive()
            .on('pointerdown', () => this.scene.start("GameScene"));
    }
}