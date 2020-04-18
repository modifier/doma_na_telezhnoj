import GameState from "./GameState";
import POINTER_UP = Phaser.Input.Events.POINTER_UP;

export default class GameEndScene extends Phaser.Scene {
    constructor(props) {
        super('game_end_scene');

    }

    create({person, houses, destructors, additionalObjects}) {
        if (GameState.aliveHouses > 0) {
            person.setFrame(6)
            this.sound.removeByKey('destructor_sound')
        } else {
            person.setFrame(5)
            this.sound.removeByKey('music');
        }
        this.add.existing(person)
        houses.forEach(h => this.add.existing(h))
        additionalObjects.forEach(o => this.add.existing(o))

        this.cameras.main.setBackgroundColor('rgba(255, 255, 255, 0.5)')
        const centerY = this.cameras.main.centerY
        const centerX = this.cameras.main.centerX

        this.add.text(
            centerX,
            centerY,
            this._getTextAboutHouses(),
            {font: '40px Amatic SC', fill: '#000000', align: 'left', backgroundColor: '#FFFFFF'}
        ).setOrigin(0.5)

        const resetIcon = this.add.image(773, 75, 'reset')
            .setScale(0.22)
            .setInteractive();
        resetIcon.on(POINTER_UP, () => {
            this._restartGame()
        })
    }

    _getTextAboutHouses() {
        console.log(GameState.aliveHouses)
        switch (GameState.aliveHouses) {
            case 4:
                return 'Вы смогли спасти ВСЕ дома!'
            case 3:
                return 'Вы смогли спасти ТРИ дома!'
            case 2:
                return 'Вы смогли спасти ПОЛОВИНУ домов.'
            case 1:
                return 'Вы смогли спасти только ОДИН дом.'
            default:
                return 'Вы не спасли ни одного дома :('
        }
    }

    _restartGame() {
        this.scene.stop('game_scene');
        this.scene.start('start_scene');

        this.sound.removeByKey('destructor_sound');
        this.sound.removeByKey('music');
    }
}
