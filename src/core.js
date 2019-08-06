const screenWidth = 800;
const screenHeight = 600;

const config = {
    type: Phaser.AUTO,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'rgb(255, 255, 255)',
    parent: "container",
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
var walls;
var rocks;

var cursors;

var game = new Phaser.Game(config);

function preload () {
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.image('rock', 'assets/rock.png');
}

function create () {

    this.add.image(400, 300, 'background');

    player = this.physics.add.sprite(100, 100, 'player').setScale(0.5);
    player.setCollideWorldBounds(true);
    player.setBounce(0);
    player.setData("sticking", "INITIAL");

    walls = this.physics.add.staticGroup();
    walls.create(0, 0, 'wall').setScale(10, 0.1).refreshBody();
    walls.create(0, 0, 'wall').setScale(0.1, 10).refreshBody();
    walls.create(screenWidth, screenHeight, 'wall').setScale(10, 0.1).refreshBody();
    walls.create(screenWidth, screenHeight, 'wall').setScale(0.1, 10).refreshBody();

    rocks = this.physics.add.group();

    this.physics.add.collider(player, walls, stickToWall);
    this.physics.add.collider(rocks, walls, destroyRock, null, this);

    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', attemptJumpThrow, null);
}

function stickToWall() {

    var touching = player.body.touching;

    if (touching.none) {
        player.setData("sticking", null);
        return;
    }

    if (touching.up) direction = "up";
    if (touching.down) direction = "down";
    if (touching.left) direction = "left";
    if (touching.right) direction = "right";

    player.setData("sticking", direction);
}

function destroyRock(rock, wall) {
    rock.destroy();
}

function getDirection() {
    if (cursors.up.isDown) {
        return "up";
    } else if (cursors.down.isDown) {
        return "down";
    } else if (cursors.left.isDown) {
        return "left";
    } else if (cursors.right.isDown) {
        return "right";
    }
}

function attemptJumpThrow(context) {

    direction = getDirection();

    // Do a jump if you're stuck to a wall
    if (player.getData("sticking")) {
        switch (direction) {
            case "up":
                player.setVelocityY(-300);
                player.setVelocityX(0);
                break;
            case "down":
                player.setVelocityY(300);
                player.setVelocityX(0);
                break;
            case "left":
                player.setVelocityY(0);
                player.setVelocityX(-300);
                break;
            case "right":
                player.setVelocityY(0);
                player.setVelocityX(300);
                break;
        }
        player.setData("sticking", null);
    }
    // Do a throw if you're in mid air
    else {
        switch (direction) {
            case "up":
                player.setVelocityY(300);
                player.setVelocityX(0);
                break;
            case "down":
                player.setVelocityY(-300);
                player.setVelocityX(0);
                break;
            case "left":
                player.setVelocityY(0);
                player.setVelocityX(300);
                break;
            case "right":
                player.setVelocityY(0);
                player.setVelocityX(-300);
                break;
        }
        throwRock(player.x, player.y, direction);
    }
}

function throwRock(x, y, direction) {

    var r = rocks.create(x, y, 'rock').setScale(0.1);

    switch (direction) {
        case "up":
            r.setVelocityY(-600);
            break;
        case "down":
            r.setVelocityY(600);
            break;
        case "left":
            r.setVelocityX(-600);
            break;
        case "right":
            r.setVelocityX(600);
            break;
    }
}

function update () {
    if (cursors.up.isDown) {
        player.angle = 0;
    } else if (cursors.down.isDown) {
        player.angle = 180;
    } else if (cursors.left.isDown) {
        player.angle = 270;
    } else if (cursors.right.isDown) {
        player.angle = 90;
    }
}

