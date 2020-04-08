export default class LoadingScene extends Phaser.Scene {
    loaderText: Phaser.GameObjects.Text

    constructor() {
        super('loading_scene');
    }

    create() {
        this.loaderText = this.add.text(5, 10, '', {font: '20px Amatic SC', fill: '#00ff00'})
        this.load.image('background', 'assets/v1/background.png');

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

        // houses
        this.load.image('house1', 'assets/v2/house1.png');
        this.load.image('house2', 'assets/v2/house2.png');
        this.load.image('house3', 'assets/v2/house3.png');
        this.load.image('house4', 'assets/v2/house4.png');

        this.load.image('key_up', 'assets/v2/up.png');
        this.load.image('key_down', 'assets/v2/down.png');
        this.load.image('key_left', 'assets/v2/left.png');
        this.load.image('key_right', 'assets/v2/right.png');

        this.load.start()
    }

    update() {
        if (this.load.isLoading()) {
            this.loaderText.setText(`Loading: ${Math.ceil(this.load.progress * 100)}%`)
        } else {
            this.loaderText.setText('Loading: 100%')
            this.scene.launch('start_scene')
        }
    }
}
