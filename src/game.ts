import 'phaser';
import Path = Phaser.Curves.Path;
import Graphics = Phaser.GameObjects.Graphics;
import PathFollower = Phaser.GameObjects.PathFollower;

const PERSON_VELOCITY = 260;
const DESTRUCTOR_VELOCITY = 100;
export default class Game extends Phaser.Scene {
    person = null;
    destructor: Phaser.Physics.Arcade.Sprite = null;
    cursors = null;

    _graphics: Graphics = null;
    _pathToHouse1: Path = null;
    _follower = null;

    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('background', 'assets/v1/background.png');

        this.load.spritesheet('person', 'assets/v1/person-animated.png', {
            frameWidth: 127, frameHeight: 220
        });
        this.load.spritesheet('destructor', 'assets/v1/destructor-animated.png', {
            frameWidth: 352, frameHeight: 203
        });

        // houses
        this.load.image('house1', 'assets/v1/house1.png');
        this.load.image('house2', 'assets/v1/house2.png');
        this.load.image('house3', 'assets/v1/house3.png');

    }

    create() {
        this._graphics = this.add.graphics();
        this.add
            .image(400, 300, 'background')
            .setScale(0.5);

        this.person = this.physics.add
            .sprite(400, 300, 'person')
            .setScale(0.4)
            .setCollideWorldBounds(true);

        this.destructor = this.physics.add
            .sprite(600, 650, 'destructor')
            .setScale(0.4)
            .setCollideWorldBounds(false);

        const houses = this.physics.add.staticGroup();
        houses.create(300, 100, 'house1').setScale(0.3).refreshBody();
        houses.create(395, 105, 'house2').setScale(0.3).refreshBody();
        houses.create(475, 115, 'house3').setScale(0.3).refreshBody();

        const house1 = <Phaser.Physics.Arcade.Body>houses.children.entries[0].body;
        this._pathToHouse1 = new Phaser.Curves.Path(600, 650).lineTo(house1.x, house1.y +  house1.height);

        this._follower = {t: 0, vec: new Phaser.Math.Vector2()};
        this.tweens.add({
            targets: this._follower,
            t: 1,
            ease: 'Linear',
            duration: 5000,
            repeat: -1
        });

        // interactions of game objects
        this.physics.add.collider(this.person, houses, this.personOverlapHouse);
        this.physics.add.collider(this.destructor, houses, this.destructorOverlapHouse);
        this.physics.add.collider(this.person, this.destructor, this.personOverlapDestructor);

        this.anims.create({
            key: 'person_stay',
            frames: [{key: 'person', frame: 0}],
            frameRate: 20
        });

        this.anims.create({
            key: 'person_walk',
            frames: this.anims.generateFrameNumbers('person', {start: 0, end: 1}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'destructor_move',
            frames: this.anims.generateFrameNumbers('destructor', {start: 0, end: 1}),
            frameRate: 10,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(time: number, delta: number): void {
        const cursors = this.cursors;
        const person = this.person;

        if (
            cursors.left.isDown ||
            cursors.right.isDown ||
            cursors.up.isDown ||
            cursors.down.isDown
        ) {
            person.anims.play('person_stay', true);
        } else {
            person.anims.play('person_stay', true);
        }
        let velocityX = 0;
        if (cursors.left.isDown) {
            velocityX = -1 * PERSON_VELOCITY
        } else if (cursors.right.isDown) {
            velocityX = PERSON_VELOCITY
        }

        let velocityY = 0;
        if (cursors.up.isDown) {
            velocityY = -1 * PERSON_VELOCITY
        } else if (cursors.down.isDown) {
            velocityY = PERSON_VELOCITY
        }

        person.setVelocity(velocityX, velocityY);

        // destructor paths
        this._pathToHouse1.getPoint(this._follower.t, this._follower.vec);
        this.destructor.setPosition(this._follower.vec.x, this._follower.vec.y);
        this.destructor.play('destructor_move', true);

        this._graphics.clear();
        this._graphics.lineStyle(2, 0x000000, 1);
        this._pathToHouse1.draw(this._graphics);
    }

    personOverlapHouse(person, house) {
        // house.setVisible(false);
        // console.log(house)
    }

    personOverlapDestructor(person, destructor) {
    }

    destructorOverlapHouse(destructor, house) {
        // house.setVisible(false);
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
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
    scene: Game
};

const game = new Phaser.Game(config);
