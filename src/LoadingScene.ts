export default class LoadingScene extends Phaser.Scene {
    loaderText: Phaser.GameObjects.Text

    constructor() {
        super('loading_scene');
    }

    create() {
        this.loaderText = this.add.text(5, 10, '', {font: '20px Amatic SC', fill: '#00ff00'})
        this.load.image('background', 'assets/v1/background.png');

        this.load.spritesheet('person', 'assets/v1/person-animated.png', {
            frameWidth: 127, frameHeight: 220
        });
        this.load.spritesheet('destructor', 'assets/v1/destructor-animated.png', {
            frameWidth: 352, frameHeight: 203
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
