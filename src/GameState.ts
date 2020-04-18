import EventEmitter = Phaser.Events.EventEmitter;

class GameState extends EventEmitter {
    constructor() {
        super();

        this._soundOn = localStorage.getItem('game:sound_on') == '1'
    }

    private _gameFinish: boolean = false
    private _aliveHouses: number = 4
    private _soundOn: boolean = true

    resetGame() {
        this.gameFinish = false;
        this.aliveHouses = 4;
    }

    get soundOn(): boolean {
        return this._soundOn;
    }

    set soundOn(value: boolean) {
        localStorage.setItem('game:sound_on', value ? '1' : '-1')
        this._soundOn = value;
    }

    get aliveHouses(): number {
        return this._aliveHouses;
    }

    set aliveHouses(value: number) {
        this._aliveHouses = value;
    }

    get gameFinish(): boolean {
        return this._gameFinish;
    }

    set gameFinish(value: boolean) {
        this._gameFinish = value;
    }
}

const state = new GameState()
export default state
