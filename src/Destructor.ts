import TAU = Phaser.Math.TAU;
import Point = Phaser.Geom.Point;

export default class Destructor extends Phaser.Physics.Arcade.Sprite {
    _initVelocity: number;
    _initialX: number;
    _initialY: number;
    _velocityAngleDiff: number = null;
    _moveBack: boolean = false;
    _targetHouse: Phaser.GameObjects.GameObject;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        initVelocity: number,
        frame?: string | number,
    ) {
        super(scene, x, y, texture, frame);
        this._initialX = x;
        this._initialY = y;
        this._initVelocity = initVelocity;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setScale(0.3);
        this.setCollideWorldBounds(false);

        this.scene.time.addEvent({
            delay: 800,
            callback: () => {
                const dir = (Math.random() > 0.5 ? -1 : 1);
                this._velocityAngleDiff = dir * Math.random() * TAU / 2;
            },
            repeat: -1
        })
    }

    getTargetHouse(): Phaser.GameObjects.GameObject {
        return this._targetHouse
    }

    startMovingBack() {
        this._moveBack = true
    }

    cancelMovingBack() {
        this._moveBack = false
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
        let targetHouseActive = this._targetHouse && this._targetHouse.active;

        if (!targetHouseActive || Phaser.Geom.Rectangle.ContainsPoint(this.getBounds(), new Point(this._initialX, this._initialY))) {
            if (aliveHouses.length > 0) {
                let index = Math.ceil(Math.random() * (aliveHouses.length - 1));
                this.startMovingToHouse(aliveHouses[index]);
            } else {
                this.startMovingToHouse(null);
            }
        }

        if (this._moveBack) {
            this._moveToStartPosition();
        } else {
            this._moveToHouse();
        }

        this.play('destructor_move', true);
    }
}
