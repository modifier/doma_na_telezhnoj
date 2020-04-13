import 'phaser';

import LoadingScene from "./LoadingScene";
import StartScene from "./StartScene";
import GameScene from "./GameScene";


// @ts-ignore
const development = DEVELOPMENT_MODE
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    canvasStyle: development ? 'border: 1px solid red;' : '',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: development
        }
    },
    resolution: window.devicePixelRatio,
    scene: [
        LoadingScene,
        StartScene,
        GameScene
    ]
};

const game = new Phaser.Game(config);
