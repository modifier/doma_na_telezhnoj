export default class LoadingScene extends Phaser.Scene {
    loaderText: Phaser.GameObjects.Text

    constructor() {
        super('loading_scene');
    }

    create() {
        this.loaderText = this.add.text(5, 10, '', {font: '20px Amatic SC', fill: '#00ff00'})

        this.load.image('background', 'assets/v2/background.png');

        // controls
        this.load.image('nav_buttons', 'assets/v2/nav-buttons.png');

        this.load.spritesheet('person', 'assets/v2/person-animated.png', {
            frameWidth: 194, frameHeight: 348
        });
        this.load.spritesheet('destructor1', 'assets/v2/destructor1-animated.png', {
            frameWidth: 473, frameHeight: 280
        });
        this.load.spritesheet('destructor2', 'assets/v2/destructor2-animated.png', {
            frameWidth: 363, frameHeight: 269
        });
        this.load.spritesheet('destructor3', 'assets/v2/destructor3-animated.png', {
            frameWidth: 424, frameHeight: 361
        });

        this.load.image('timer', 'assets/v2/timer.png')

        // houses
        this.load.image('house1', 'assets/v2/house1.png');
        this.load.image('house2', 'assets/v2/house2.png');
        this.load.image('house3', 'assets/v2/house3.png');
        this.load.image('house4', 'assets/v2/house4.png');

        //sound
        this.load.image('music_on', 'assets/v2/music-on.png');
        this.load.image('music_off', 'assets/v2/music-off.png');

        this.load.audio('music', 'assets/music.mp3');

        this.load.start()
    }

    update() {
        if (this.load.isLoading()) {
            this.loaderText.setText(`Loading: ${Math.ceil(this.load.progress * 100)}%`)
        } else {
            this.loaderText.setText('Loading: 100%')
            this.scene.start('start_scene')
        }
    }
}
