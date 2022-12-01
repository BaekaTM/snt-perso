var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

console.log(Phaser.Input.Keyboard.KeyCodes)

var game = new Phaser.Game(config);
var player;
var platforms;
var cursors;
var text;
var water;

let keyz;
let keyS;
let keyD;
let keyQ;
let score = 0;

function preload () {
    this.load.image('background', 'background.png');
    this.load.image('ground', 'bassin_bottom.png');
    this.load.image('star', 'star.png');
    this.load.image('bomb', 'bomb.png');
    this.load.image('gimp', 'test.png');
    this.load.image('bassin_bottom', 'bassin_bottom.png')
    this.load.image('limit', 'limit.png')
    this.load.image('water', 'water.png')
    this.load.spritesheet('dude', 
        'dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create () {
    background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
    let scaleX = this.cameras.main.width / background.width
    let scaleY = this.cameras.main.height / background.height
    let scale = Math.max(scaleX, scaleY)
    background.setScale(scale).setScrollFactor(0)

    platforms = this.physics.add.staticGroup();

    // platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(160, 570, 'ground').setScale(2).refreshBody();
    platforms.create(160, 590, 'ground').setScale(2).refreshBody();
    platforms.create(320, 590, 'ground').setScale(2).refreshBody();
    platforms.create(480, 590, 'ground').setScale(2).refreshBody();
    platforms.create(700, 590, 'ground').setScale(2).refreshBody();
    platforms.create(320, 545, 'limit').refreshBody();
    platforms.create((320 + 32), (545 + 20), 'limit').refreshBody();
    platforms.create((320 + 64), (545 + 40), 'limit').refreshBody();
    platforms.create((320 + 86), (545 + 60), 'limit').refreshBody();
    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(400, 100, 'ground');
    // platforms.create(750, 200, 'ground');
    // platforms.create(750, 220, 'ground');
    water = this.add.sprite(144, 538, 'water');

    player = this.physics.add.sprite(700, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    player.body.setGravityY(300)
    this.physics.add.collider(player, platforms);


    cursors = this.input.keyboard.createCursorKeys();
    keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    text = this.add.text(this.cameras.main.width / 2 - 137, 150, 'Les thermes (En vrai c pas ici)', { fontSize: '16px', fill: '#000' });
    this.physics.add.overlap(player, water, baisse_gravity, null, this);


//     stars = this.physics.add.group({
//         key: 'star',
//         repeat: 11,
//         setXY: { x: 12, y: 0, stepX: 70 }
//     });
//     stars.children.iterate(function (child) {
    
//         child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    
//     });
//     this.physics.add.collider(stars, platforms);
//     this.physics.add.overlap(player, stars, collectStar, null, this);
}

function update () {
    if (keyQ.isDown) {
        player.setVelocityX(-200);

        player.anims.play('left', true); 
    }
    else if (keyD.isDown) {
        player.setVelocityX(200);

        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);

        player.anims.play('turn', true)
    }

    if (keyZ.isDown && player.body.touching.down || keySpace.isDown && player.body.touching.down) {
        player.setVelocityY(-300);
    } else if (keyS.isDown && !player.body.touching.down) {
        player.setVelocityY(475);
    }
}

function collectStar (player, star) {
    score = score + 1;
    star.disableBody(true, true);
    text.setText('Stars: ' + score)
}

function baisse_gravity (player, water) {
    this.physics.arcade.gravity.y = 0;
}
