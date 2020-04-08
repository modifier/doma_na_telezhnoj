import TAU = Phaser.Math.TAU;
import Point = Phaser.Geom.Point;

const TextureToScale = {
    'destructor1': 0.3,
    'destructor2': 0.3,
    'destructor3': 0.3,
}

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

        // TODO update target only if not moving back
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

        this.play(`${this.texture.key}_move`, true);
    }
}
