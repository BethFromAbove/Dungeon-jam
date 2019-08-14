const screenWidth = 800;
const screenHeight = 600;

const config = {
    type: Phaser.AUTO,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'rgb(255, 255, 255)',
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
    this.load.image('wall', 'assets/wall.png');
    this.load.image('rock', 'assets/rock.png');
}

function create () {

    this.add.image(400, 300, 'background');

    player = this.physics.add.sprite(100, 100, 'player').setScale(0.25);
    player.setCollideWorldBounds(true);
    player.setBounce(0);
    player.setData('sticking', 'INITIAL');
    playerDirection = 'UP';

    walls = this.physics.add.staticGroup();
    walls.create(0, 0, 'wall').setScale(10, 0.1).refreshBody();
    walls.create(0, 0, 'wall').setScale(0.1, 10).refreshBody();
    walls.create(screenWidth, screenHeight, 'wall').setScale(10, 0.1).refreshBody();
    walls.create(screenWidth, screenHeight, 'wall').setScale(0.1, 10).refreshBody();

    rocks = this.physics.add.group();

    this.physics.add.collider(player, walls, stickToWall);
    this.physics.add.collider(rocks, walls, destroyRock);

    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', attemptJumpThrow, null);

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
        case 'UP':
            player.angle = 0;
            break;
        case 'DOWN':
            player.angle = 180;
            break;
        case 'LEFT':
            player.angle = 270;
            break;
        case 'RIGHT':
            player.angle = 90;
            break;
    }
}
