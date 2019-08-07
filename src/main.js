 var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

var game = new Phaser.Game(config);
var score = 0;
var scoreText;
var spaceKey;
var onWall = false;

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('walls', 'assets/sides.png');
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
        );
}

function create ()
{
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(400, 30, 'ground').setScale(2).refreshBody();


    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
    platforms.create(25, 300, 'walls');
    platforms.create(775, 300, 'walls');
    //platforms.create(0, 0, 'walls').setOrigin(0, 0);

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setData("directionTouching", "up");

    // player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    player.body.setGravityY(300)

    this.physics.add.collider(player, platforms, stickToWalls);

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

    cursors = this.input.keyboard.createCursorKeys();

    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    player.body.allowGravity = false;



    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this);


}

function stickToWalls ()
{
    onWall = true;
    console.log(onWall);
    if (player.body.touching.up) {player.setData("directionTouching", "up");}
    if (player.body.touching.down) {player.setData("directionTouching", "down");}
    if (player.body.touching.left) {player.setData("directionTouching", "left");}
    if (player.body.touching.right) {player.setData("directionTouching", "right");}
}

    function collectStar (player, star)
    {
        star.disableBody(true, true);

        score += 10;
        scoreText.setText('Score: ' + score);

        if (stars.countActive(true) === 0)
        {
            stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        }
    }

    function hitBomb (player, bomb)
    {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        gameOver = true;
    }


    function update ()
    {
    
        if (cursors.left.isDown && (player.getData("directionTouching") != "right"))
        {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown && (player.getData("directionTouching") != "left"))
        {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else if (cursors.up.isDown && (player.getData("directionTouching") != "down"))
        {
            player.setVelocityY(-160);
        }
        else if (cursors.down.isDown && (player.getData("directionTouching") != "up"))
        {
            player.setVelocityY(160);
        }
        else
        {
            // player.setVelocityX(0);
            // player.setVelocityY(0);

            player.anims.play('turn');
        }
    

        

        if (spaceKey.isDown)
        {
            if (player.getData("directionTouching") === "up")
            {
                player.setVelocityY(500);
            }
            else if (player.getData("directionTouching") === "down")
            {
                player.setVelocityY(-500);
            }
            else if (player.getData("directionTouching") === "left")
            {
                player.setVelocityX(500);
            }
            else if (player.getData("directionTouching") === "right")
            {
                player.setVelocityX(-500);
            }
            onWall = false;
            player.setData("directionTouching", null);

        }
    }
