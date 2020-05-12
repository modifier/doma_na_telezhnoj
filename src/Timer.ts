import Text = Phaser.GameObjects.Text;
import TimerEvent = Phaser.Time.TimerEvent;

export default class Timer {
    timerValueInSeconds: number = 60 + 1
    scene: Phaser.Scene
    timer: TimerEvent
    timerText: Text

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        onTimeEnd: () => void
    ) {
        this.scene = scene

        this.scene.add.image(x, y + 17, 'timer');

        this.timerText = this.scene.add.text(
            x + 30,
            y,
            '0:00',
            {font: '40px Amatic SC'}
        )
        this.timer = this.scene.time.delayedCall((this.timerValueInSeconds) * 1000, onTimeEnd)
        this.timer.paused = true
    }

    start() {
        this.timer.paused = false
    }

    stop() {
        this.timer.paused = true
    }

    update() {
        if (this.timer) {
            this.timerText.setText(this._getTimerText())
            this.timerText.setShadow(1, 1, this._getTimerColor(), null, null, true);
            this.timerText.setColor(this._getTimerColor())
        }
    }

    _getTimerText(): string {
        let time = (this.timerValueInSeconds - Math.ceil(this.timer.getElapsedSeconds()))
        let minutes = Math.floor(time / 60)
        let seconds = time - minutes * 60
        return `${(minutes).toFixed(0).padStart(2, '0')} : ${(seconds).toFixed(0).padStart(2, '0')}`
    }

    _getTimerColor(): string {
        let time = (this.timerValueInSeconds - Math.ceil(this.timer.getElapsedSeconds()))
        let percents = time * 100 / this.timerValueInSeconds
        if (percents > 60) {
            return '#ff0909'
        } else if (percents > 30) {
            return '#FFAD32'
        } else {
            return '#41B619'
        }
    }
}
