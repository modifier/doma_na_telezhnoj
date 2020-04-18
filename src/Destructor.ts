import TAU = Phaser.Math.TAU;
import Point = Phaser.Geom.Point;
import TimerEvent = Phaser.Time.TimerEvent;

const TextureToScale = {
    'destructor1': 0.3,
    'destructor2': 0.3,
    'destructor3': 0.3,
}

const TextureToYBodyOffset = {
    'destructor1': 40,
    'destructor2': 10,
    'destructor3': 45,
}

export default class Destructor extends Phaser.Physics.Arcade.Sprite {
    _initVelocity: number;
    _initialX: number;
    _initialY: number;
    _velocityAngleDiff: number = null;
    _moveBack: boolean = false;
    _targetHouse: Phaser.GameObjects.GameObject;
    _moveBackTimer: TimerEvent;

    _moveBackTimeConfig = null

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        initVelocity: number,
        frame?: string | number,
        flipX: boolean = false
    ) {
        super(scene, x, y, texture, frame);
        this._initialX = x;
        this._initialY = y;
        this._initVelocity = initVelocity;

        this.scene.add.existing(this);
        this.flipX = flipX
        this.scene.physics.add.existing(this);
        const bodyYOffset = TextureToYBodyOffset[texture]
        this.body
            .setSize(this.body.width, this.body.height - bodyYOffset)
            .setOffset(0, bodyYOffset);

        this.setScale(TextureToScale[texture]);
        this.setCollideWorldBounds(false);

        this.scene.time.addEvent({
            delay: 800,
            callback: () => {
                const dir = (Math.random() > 0.5 ? -1 : 1);
                this._velocityAngleDiff = dir * Math.random() * TAU / 2;
            },
            repeat: -1
        })

        this._moveBackTimeConfig = {
            delay: 1500,
            callback: () => {
                this.cancelMovingBack()
            }
        }
    }

    static initAnimations(anims: any) {
        anims.create({
            key: 'destructor1_move',
            frames: anims.generateFrameNumbers('destructor1', {start: 0, end: 2}),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'destructor2_move',
            frames: anims.generateFrameNumbers('destructor2', {start: 0, end: 1}),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'destructor3_move',
            frames: anims.generateFrameNumbers('destructor3', {start: 0, end: 1}),
            frameRate: 5,
            repeat: -1
        });
    }

    getTargetHouse(): Phaser.GameObjects.GameObject {
        return this._targetHouse
    }

    startMovingBack() {
        this._moveBack = true
        this._targetHouse = null
        this._resetMoveBackTimer()
    }

    cancelMovingBack() {
        this._moveBack = false
    }

    stop() {
        this.setVelocity(0, 0)
    }

    startMovingToHouse(house: Phaser.GameObjects.GameObject) {
        this._moveBack = false;
        this._targetHouse = house;
    }

    _moveToStartPosition() {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this._initialX, this._initialY);
        const velocity = this.scene.physics.velocityFromRotation(angle + this._velocityAngleDiff, this._initVelocity);
        this.setVelocity(velocity.x, velocity.y)
    }

    _moveToHouse() {
        if (this._targetHouse) {
            const houseBody = <Phaser.Physics.Arcade.Body>this._targetHouse.body;
            const angle = Phaser.Math.Angle.Between(this.x, this.y, houseBody.x, houseBody.y);
            // this.destructor.setFlipX(angle < 0);
            const velocity = this.scene.physics.velocityFromRotation(angle + this._velocityAngleDiff, this._initVelocity);
            this.setVelocity(velocity.x, velocity.y);
        } else {
            this.setVelocity(0, 0)
        }
    }

    update(aliveHouses, ...args): void {
        super.update(...args);

        if (aliveHouses.length == 0) {
            this.startMovingToHouse(null)
            return
        }

        if (this._moveBack) {
            if (Phaser.Geom.Rectangle.ContainsPoint(this.getBounds(), new Point(this._initialX, this._initialY))) {
                this.cancelMovingBack()
            }
            this._moveToStartPosition();
        } else {
            if (!this._isTargetHouseAlive()) {
                let index = Math.ceil(Math.random() * (aliveHouses.length - 1));
                this.startMovingToHouse(aliveHouses[index]);
            }
            this._moveToHouse();
        }

        this.play(`${this.texture.key}_move`, true);
    }

    _isTargetHouseAlive(): boolean {
        return this._targetHouse && this._targetHouse.active;
    }

    _resetMoveBackTimer() {
        if (this._moveBackTimer) {
            this._moveBackTimer.destroy()
        }
        this._moveBackTimer = this.scene.time.addEvent(this._moveBackTimeConfig)
    }
}
