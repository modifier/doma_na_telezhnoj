import 'phaser';
import TAU = Phaser.Math.TAU;
import Point = Phaser.Geom.Point;

const PERSON_VELOCITY = 260;
const DESTRUCTOR_VELOCITY = 100;
export default class Game extends Phaser.Scene {
    person = null;
    destructor: Phaser.Physics.Arcade.Sprite = null;
    houses: Phaser.Physics.Arcade.StaticGroup = null;
    cursors = null;

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
        this.add
            .image(400, 300, 'background')
            .setScale(0.5);

        this.person = this.physics.add
            .sprite(700, 100, 'person')
            .setScale(0.4)
            .setCollideWorldBounds(true);

        this.destructor = this.physics.add
            .sprite(200, 550, 'destructor')
            .setScale(0.3)
            .setCollideWorldBounds(false);

        this.destructor.setData('last_changed_time', 0);
        this.physics.world.on('worldbounds', () => {
            console.log('bum')
        });

        this.houses = this.physics.add.staticGroup();
        this.houses.create(300, 100, 'house1').setScale(0.3).refreshBody();
        this.houses.create(395, 105, 'house2').setScale(0.3).refreshBody();
        this.houses.create(475, 115, 'house3').setScale(0.3).refreshBody();

        // interactions of game objects
        this.physics.add.collider(this.person, this.houses, this.personOverlapHouse);
        this.physics.add.collider(this.destructor, this.houses, this.destructorOverlapHouse);
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
            person.anims.play('person_walk', true);
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

        // destructor path
        this.destructor.play('destructor_move', true);
        const house1 = <Phaser.Physics.Arcade.Body>this.houses.children.entries[0].body;
        const angle = Phaser.Math.Angle.Between(this.destructor.x, this.destructor.y, house1.x, house1.y);
        this.destructor.setFlipX(angle < 0);
        if (!Phaser.Geom.Rectangle.ContainsPoint(this.physics.world.bounds, new Point(this.destructor.x, this.destructor.y))) {
            this.destructor.setData('move_back', false);
        }

        if (this.destructor.getData('move_back')) {
            const velocity = this.physics.velocityFromRotation(angle, DESTRUCTOR_VELOCITY);
            this.destructor.setVelocity(-1 * velocity.x, -1 * velocity.y)
        } else if (time - this.destructor.getData('last_changed_time') > 1200) {
            this.destructor.setData('last_changed_time', time);
            const velocity = this.physics.velocityFromRotation(angle + (Math.random() > 0.5 ? -1 : 1) * Math.random() * TAU / 2, DESTRUCTOR_VELOCITY);
            this.destructor.setVelocity(velocity.x, velocity.y);
        }
    }

    personOverlapHouse(person, house) {
    }

    personOverlapDestructor(person, destructor: Phaser.Physics.Arcade.Sprite) {
        destructor.setData('move_back', true);
    }

    destructorOverlapHouse(destructor, house) {
        house.setVisible(false);
        destructor.setData('move_back', true);
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
