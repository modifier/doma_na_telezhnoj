import GameState from "./GameState";

export default class GameScene extends Phaser.Scene {
    constructor(props) {
        super('game_end_scene');

    }

    create({person, houses}) {
        if (GameState.aliveHouses > 0) {
            person.setFrame(6)
        } else {
            person.setFrame(5)
        }
        this.add.existing(person)

        houses.forEach(h => this.add.existing(h))

        this.cameras.main.setBackgroundColor('rgba(255, 255, 255, 0.5)')
        const centerY = this.cameras.main.centerY
        const centerX = this.cameras.main.centerX

        this.add.text(
            centerX,
            centerY,
            this._getTextAboutHouses(),
            {font: '40px Amatic SC', fill: '#000000', align: 'left'}
        ).setOrigin(0.5)
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
}
