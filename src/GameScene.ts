import Destructor from "./Destructor";

const PERSON_VELOCITY = 260;
const DESTRUCTOR_VELOCITY = 70;
export default class GameScene extends Phaser.Scene {
    person = null;
    destructors: Destructor[];
    houses: Phaser.Physics.Arcade.StaticGroup = null;
    cursorKeys = null;
    moveKeys = null;

    constructor() {
        super('game_scene');
    }

    create() {
        this.add
            .image(400, 300, 'background')
            .setScale(0.5);

        this.person = this.physics.add
            .sprite(700, 300, 'person')
            .setScale(0.4)
            .setCollideWorldBounds(true);

        this.destructors = [
            new Destructor(this, 100, 650, 'destructor', DESTRUCTOR_VELOCITY - 10),
            new Destructor(this, 300, 650, 'destructor', DESTRUCTOR_VELOCITY),
            new Destructor(this, 800, 750, 'destructor', DESTRUCTOR_VELOCITY + 40)
        ];

        this.physics.world.on('worldbounds', () => {
            console.log('bum')
        });

        this.houses = this.physics.add.staticGroup();
        const housesYOffset = 50;
        const h1 = this.houses
            .create(220, 95 + housesYOffset, 'house1').setScale(0.2).refreshBody();
        const h2 = this.houses
            .create(h1.x + h1.displayWidth - 42, 126.5 + housesYOffset, 'house2').setScale(0.2).refreshBody();
        const h3 = this.houses
            .create(h2.x + h2.displayWidth - 22, 104 + housesYOffset, 'house3').setScale(0.2).refreshBody();
        const h4 = this.houses
            .create(h3.x + h3.displayWidth - 57, 113 + housesYOffset, 'house4')
            .setScale(0.2)
            .refreshBody();
        h4.body
            .setSize(h4.body.width - 40, h4.body.height)
            .setOffset(0, 0);


        // interactions of game objects
        this.physics.add.collider(this.person, this.houses, this.personOverlapHouse);
        this.destructors.forEach(d => {
            this.physics.add.collider(d, this.houses, this.destructorOverlapHouse);
            this.physics.add.collider(this.person, d, this.personOverlapDestructor);
        });


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

        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.moveKeys = this.input.keyboard.addKeys('W,A,S,D')
    }

    update(time: number, delta: number): void {
        const person = this.person;

        if (this._isPersonWalk()) {
            person.anims.play('person_walk', true);
        } else {
            person.anims.play('person_stay', true);
        }
        let velocityX = 0;
        if (this._isPersonWalk_left()) {
            velocityX = -1 * PERSON_VELOCITY
        } else if (this._isPersonWalk_right()) {
            velocityX = PERSON_VELOCITY
        }

        let velocityY = 0;
        if (this._isPersonWalk_up()) {
            velocityY = -1 * PERSON_VELOCITY
        } else if (this._isPersonWalk_down()) {
            velocityY = PERSON_VELOCITY
        }

        person.setVelocity(velocityX, velocityY);

        const aliveHouses = this.houses.children.entries.filter(h => h.active);

        this.destructors.forEach(d => d.update(aliveHouses))
    }

    personOverlapHouse(person, house) {
    }

    personOverlapDestructor(person, destructor: Destructor) {
        destructor.startMovingBack();
    }

    destructorOverlapHouse(destructor: Destructor, house: Phaser.Physics.Arcade.Sprite) {
        house.disableBody(true, true);
        destructor.startMovingBack();
        // TODO disable only target house
        // TODO only for one destructor should call (need to use texture key)
    }

    _isPersonWalk_left() {
        return this.cursorKeys.left.isDown || this.moveKeys.A.isDown
    }

    _isPersonWalk_right() {
        return this.cursorKeys.right.isDown || this.moveKeys.D.isDown
    }

    _isPersonWalk_up() {
        return this.cursorKeys.up.isDown || this.moveKeys.W.isDown
    }

    _isPersonWalk_down() {
        return this.cursorKeys.down.isDown || this.moveKeys.S.isDown
    }

    _isPersonWalk() {
        return this._isPersonWalk_left() ||
            this._isPersonWalk_right() ||
            this._isPersonWalk_up() ||
            this._isPersonWalk_down()
    }
}
