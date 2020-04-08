import 'phaser';

import LoadingScene from "./LoadingScene";
import StartScene from "./StartScene";
import GameScene from "./GameScene";

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    canvasStyle: 'border: 1px solid red;',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: true
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
