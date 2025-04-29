import Phaser from "phaser";
import {MainMenuScene} from "./scenes/MainMenuScene";

export const config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 1820,
    parent: "phaser-container",
    backgroundColor: "#07002F",
    dom: {
        createContainer: true
    },
    scene: MainMenuScene,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }
        }
    }
};