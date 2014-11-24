
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'Projeto_game', {preload: preload, create: create, update: update});

var land;
var player;
var currentSpeed = 0;
var cursors;
var bullets;
var fireRate = 100;
var nextFire = 0;
var map;
var layer;
var facing = 'down';

//inimigos
var enemies;
var enemiesTotal = 0;
var enemiesAlive = 0;

function preload() {
    game.load.tilemap('map', 'textures/features.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ground_1x1', 'textures/ground_1x1.png');
    game.load.image('earth', 'textures/earth.png');//textura do campo
    game.load.spritesheet('player', 'textures/players.png', 80, 80);
    game.load.image('bullet', 'textures/bullet.png');
    game.load.spritesheet('enemy', 'textures/players.png', 80, 80);
}

function create() {
    // mapa
    game.world.setBounds(0, 0, 800, 600);
    land = game.add.tileSprite(0, 0, 800, 600, 'earth');
    land.fixedToCamera = true;
    map = game.add.tilemap('map');
    map.addTilesetImage('ground_1x1');
    map.setCollisionBetween(1, 12);
    layer = map.createLayer('Tile Layer 1');
   

    //inserir player com animação
    player = game.add.sprite(400, 300, 'player');
    player.anchor.setTo(0.5, 0.5);
    player.animations.add('down', [0, 1, 2, 3], 10, true);
    player.animations.add('left', [4, 5, 6, 7], 10, true);
    player.animations.add('right', [8, 9, 10, 11], 10, true);
    player.animations.add('up', [12, 13, 14, 15], 10, true);


    //  Isso vai forçá-lo a desacelerar e limitar sua velocidade
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.drag.set(0.2);
    player.body.maxVelocity.setTo(400, 400);
    player.body.collideWorldBounds = true;

    /*  tiros */
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(3, 'bullet', 0, false);//dispara 3 tiros por vez
    bullets.setAll('anchor.x', -0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    //inimigos
    enemies = [];
    enemiesTotal = 1;
    enemiesAlive = 1;

    for (var i = 0; i < enemiesTotal; i++) {
        enemies.push(new EnemyMonster(i, game, player, layer));
        
    }

    //insere no topo
    player.bringToTop();
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    game.physics.arcade.collide(player, layer);
    
    //faz o player não ficar "flutuando"
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    //game.physics.arcade.overlap(player, null, this);
    enemiesAlive = 0;

    for (var i = 0; i < enemies.length; i++)
    {
        if (enemies[i].alive)
        {
            enemiesAlive++;
            game.physics.arcade.collide(player, enemies[i].monster); //colisão entre inimigo e player
            game.physics.arcade.collide(enemies[i].monster, layer); //colisão entre inimigo e paredes
        }
    }

    //movimentos do player
    if (cursors.left.isDown) {
        player.body.velocity.x = -150;
        if (facing !== 'left') {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = 150;

        if (facing !== 'right') {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else if (cursors.up.isDown) {
        player.body.velocity.y = -150;

        if (facing !== 'up') {
            player.animations.play('up');
            facing = 'up';
        }
    }
    else if (cursors.down.isDown) {
        player.body.velocity.y = 150;

        if (facing !== 'down') {
            player.animations.play('down');
            facing = 'down';
        }
    } else {
        if (facing !== 'idle') {
            player.animations.stop();

            if (facing === 'left') {
                player.frame = 4;
            }
            else if (facing === 'right') {
                player.frame = 8;
            }
            else if (facing === 'down') {
                player.frame = 0;
            } else {
                player.frame = 12;
            }

            facing = 'idle';
        }
    }

    if (game.input.activePointer.isDown) {
        fire();
    }
}


function fire() {
    if (game.time.now > nextFire && bullets.countDead() > 0) {
        nextFire = game.time.now + fireRate;
        var bullet = bullets.getFirstExists(false);
        bullet.reset(player.x, player.y);
        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 400);
    }

}

