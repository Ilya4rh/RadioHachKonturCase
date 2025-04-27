import Phaser from "phaser";
import {useEffect} from "react";
import {config} from "../PhaserConfig";
import {GameScene} from "../scenes/GameScene";

export function Game(){
    useEffect(() => {
        const game = new Phaser.Game(config)
        game.scene.add("GameScene", GameScene, false);

        return () => {
            game.destroy(true);
        }
    })
    return (
        <div id="phaser-container"/>
    );
}