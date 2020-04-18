import GAMEOBJECT_POINTER_UP = Phaser.Input.Events.GAMEOBJECT_POINTER_UP;
import GAMEOBJECT_OVER = Phaser.Input.Events.GAMEOBJECT_OVER;
import GAMEOBJECT_OUT = Phaser.Input.Events.GAMEOBJECT_OUT;
import GameState from "./GameState";

export default class StartScene extends Phaser.Scene {
    constructor() {
        super("start_scene")
    }

    create() {
        this.cameras.main.setBackgroundColor(0xFFFFFF)

        this.add.image(400, 300, 'background')
            .setAlpha(0.5)

        const centerY = this.cameras.main.centerY
        const centerX = this.cameras.main.centerX
        const rightCorner = this.cameras.main.width

        this.add.text(
            160,
            centerY - 150,
            ['Защищай дома, не давай пройти технике.', 'Тебе необходимо продержаться 1 минуту'],
            {font: '25px Amatic SC', fill: '#000000', align: 'left'})


        const startGameText = this.add.text(
            centerX,
            centerY - 35,
            'Начать игру',
            {
                font: '50px Amatic SC', fill: '#000000'
            })
            .setOrigin(0.5)
            .setInteractive()

        startGameText.setShadow(1, 1, '#000000', null, null, true);
        startGameText.on(GAMEOBJECT_POINTER_UP, () => {
            this._startGame()
        })
        this.input.keyboard.on('keyup-ENTER', () => {
            this._startGame()
        })

        const person = this.add.image(centerX, centerY + 70, 'person', 4)
            .setScale(0.3)

        this.input.setPollAlways()
        this.input.setPollRate(500)
        this.input.on(GAMEOBJECT_OVER, () => {
            this.input.setDefaultCursor('pointer')
            person.setFrame(6)
        })

        this.input.on(GAMEOBJECT_OUT, () => {
            this.input.setDefaultCursor('default')
            person.setFrame(4)
        })

        this.add.text(
            rightCorner - 50,
            centerY + 105,
            'Используй для движения:',
            {font: '28px Amatic SC', fill: '#000000'})
            .setOrigin(1, 0)


        this.add.image(rightCorner - 150, centerY + 200, 'nav_buttons').setScale(0.25)
    }

    _startGame() {
        GameState.resetGame()
        this.scene.get('game_scene').scene.restart()
        this.scene.start('game_scene')
    }
}
