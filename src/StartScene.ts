import GAMEOBJECT_POINTER_UP = Phaser.Input.Events.GAMEOBJECT_POINTER_UP;
import GAMEOBJECT_POINTER_OVER = Phaser.Input.Events.GAMEOBJECT_POINTER_OVER;
import GAMEOBJECT_POINTER_OUT = Phaser.Input.Events.GAMEOBJECT_POINTER_OUT;

export default class StartScene extends Phaser.Scene {
    constructor(props) {
        super("start_scene")
    }

    create() {
        this.add
            .image(400, 300, 'background')
            .setScale(0.5)

        const centerY = this.cameras.main.centerY
        const rightCorner = this.cameras.main.width

        this.add.text(
            100,
            centerY - 150,
            ['Защищай дома, не давай пройти технике.', 'Тебе необходимо продержаться 1 минуту'],
            {font: '25px Amatic SC', fill: '#000000', align: 'left'})


        const startGameText = this.add.text(
            this.cameras.main.centerX,
            centerY,
            'Начать игру',
            {
                font: '40px Amatic SC', fill: '#000000'
            })
            .setOrigin(0.5)
            .setInteractive()

        startGameText.on(GAMEOBJECT_POINTER_UP, () => {
            this.scene.launch('game_scene')
        })
        this.input.keyboard.on('keyup-ENTER', () => {
            this.scene.launch('game_scene')
        })

        startGameText.on(GAMEOBJECT_POINTER_OVER, () => {
            this.input.setDefaultCursor('pointer')
        })

        startGameText.on(GAMEOBJECT_POINTER_OUT, () => {
            this.input.setDefaultCursor('default')
        })

        this.add.text(
            rightCorner - 50,
            centerY + 55,
            'Используй для движения:',
            {font: '25px Amatic SC', fill: '#000000'})
            .setOrigin(1, 0)


        this.add.image(rightCorner - 150, centerY + 120, 'key_up').setScale(0.9)
        this.add.image(rightCorner - 200, centerY + 170, 'key_left').setScale(0.9)
        this.add.image(rightCorner - 100, centerY + 170, 'key_right').setScale(0.9)
        this.add.image(rightCorner - 150, centerY + 220, 'key_down').setScale(0.9)

    }
}
