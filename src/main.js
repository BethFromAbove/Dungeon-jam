const screenWidth = 800;
const screenHeight = 600;

const config = {
    type: Phaser.AUTO,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'rgb(20,20,20)',
    parent: 'container',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var playerDirection;
var walls;
var rocks;

var cursors;

var game = new Phaser.Game(config);

/**
 * Load up our image assets.
 */
function preload () {
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('rock', 'assets/rock.png');
    this.load.image('tiles', 'assets/tiletest3.png')
    this.load.image('asteroid', 'assets/tiles/Asteroid/basic_asteroid_up.png' )
    this.load.tilemapTiledJSON("mymap", 'assets/testmap4.json');
    this.load.multiatlas('spaceman', '/assets/tiles/Character/spacesprite1.json', 'assets/tiles/Character');

}

function create () {

    //-- MAP LOADING --
    const map = this.make.tilemap({ key: "mymap" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage("tiletest3", "tiles");
    const tileset2 = map.addTilesetImage("asteroid", "asteroid");
    
    // Parameters: layer name (or index) from Tiled, tileset, x, y
    //background layer (no collisions)
    const bg = map.createStaticLayer("background", tileset, 0, 0);
    //world layer  (collisions enabled)
    const layer = map.createStaticLayer("world", tileset,0,0);
    layer.setCollisionBetween(0,230, true); 


    // -- PLAYER LOADING --
    player = this.physics.add.sprite(100, 100, 'spaceman');

    //player anims
    var confusedframes = this.anims.generateFrameNames('spaceman', {
        start: 1, end: 4, zeroPad: 3,
        prefix: 'astropantsed', suffix: '.png'
    });
    this.anims.create({ key: 'confused', frames: confusedframes, frameRate: 4, repeat: -1 });

    //start player
    player.anims.play('confused', true);            

    player.setCollideWorldBounds(false);
    player.setBounce(0);
    player.setData('sticking', 'INITIAL');
    playerDirection = 'UP';


    //-- PHYSICS RULES --
    rocks = this.physics.add.group();
    this.physics.add.collider(player, layer, function(){console.log("COLLIDING WITH TILEMAP");});

    //this.physics.add.collider(player, walls, stickToWall);
    //this.physics.add.collider(rocks, walls, destroyRock);

    //-- INPUT CONTROLS --
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', attemptJumpThrow, null);
      
    //-- CAMERA SETTINGS --
    this.cameras.main.setSize(screenWidth, screenHeight);
    this.cameras.main.startFollow(player, 1, 0.04, 0.04);
  
}

function stickToWall() {
    var touching = player.body.touching;

    if (touching.none) {
        player.setData('sticking', null);
        return;
    }

    if (touching.up) direction = 'UP';
    if (touching.down) direction = 'DOWN';
    if (touching.left) direction = 'LEFT';
    if (touching.right) direction = 'RIGHT';

    player.setData('sticking', direction);
}

function destroyRock(rock, wall) {
    rock.destroy();
}

function currentDirection() {
    if (cursors.up.isDown) return 'UP';
    if (cursors.down.isDown) return 'DOWN';
    if (cursors.left.isDown) return 'LEFT';
    if (cursors.right.isDown) return 'RIGHT';
    return playerDirection;
}

function anyCursorHeld() {
    return cursors.up.isDown || cursors.down.isDown || cursors.left.isDown || cursors.right.isDown;
}

function attemptJumpThrow(context) {

    if (anyCursorHeld()) {
        direction = playerDirection

        var r = rocks.create(player.x, player.y, 'rock').setScale(0.05);

        switch (playerDirection) {
            case 'UP':
                player.setVelocityY(300);
                player.setVelocityX(0);
                r.setVelocityY(-600);
                break;
            case 'DOWN':
                player.setVelocityY(-300);
                player.setVelocityX(0);
                r.setVelocityY(600);
                break;
            case 'LEFT':
                player.setVelocityY(0);
                player.setVelocityX(300);
                r.setVelocityX(-600);
                break;
            case 'RIGHT':
                player.setVelocityY(0);
                player.setVelocityX(-300);
                r.setVelocityX(600);
                break;
        }

        player.setData('sticking', null);
    }
}

function update () {

    playerDirection = currentDirection();

    switch (playerDirection) {
        // case 'UP':
        //     player.angle = 0;
        //     break;
        // case 'DOWN':
        //     player.angle = 180;
        //     break;
        // case 'LEFT':
        //     player.angle = 270;
        //     break;
        // case 'RIGHT':
        //     player.angle = 90;
        //     break;
        default:
            break;
    }
}
