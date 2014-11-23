
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'Projeto_game', {preload: preload, create: create, update: update});

var land;
var tank;
//var turret;
var currentSpeed = 0;
var cursors;
var bullets;
var fireRate = 100;
var nextFire = 0;
var map;
var layer;


function preload() {
    game.load.tilemap('map', 'textures/features.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ground_1x1', 'textures/ground_1x1.png');
    game.load.image('earth', 'textures/earth.png');//textura do campo
    game.load.atlas('tank', 'textures/tanks.png', 'textures/tanks.json');
    game.load.image('bullet', 'textures/bullet.png');
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
    //layer.resizeWorld();

    //tank
    tank = game.add.sprite(400, 300, 'tank', 'tank1');
    tank.anchor.setTo(0.5, 0.5);
    //tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

    //  Isso vai forçá-lo a desacelerar e limitar sua velocidade
    game.physics.enable(tank, Phaser.Physics.ARCADE);
    tank.body.drag.set(0.2);
    tank.body.maxVelocity.setTo(400, 400);
    tank.body.collideWorldBounds = true;

    //canhão
    //turret = game.add.sprite(50, 50, 'tank', 'turret');
    //turret.anchor.setTo(0.3, 0.5);

    /*  tiros */
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(3, 'bullet', 0, false);//dispara 3 tiros por vez
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    //insere no topo
    tank.bringToTop();
    //turret.bringToTop();
    
    cursors = game.input.keyboard.createCursorKeys();
   
}

function update() {
    game.physics.arcade.collide(tank, layer);
    
    //movimentos do tank
    if (cursors.left.isDown) {
        tank.angle -= 4;
    }
    else if (cursors.right.isDown) {
        tank.angle += 4;
    }

    if (cursors.up.isDown) {
        //  The speed we'll travel at
        currentSpeed = 300;
        
    }
    else {
        if (currentSpeed > 0) {
            currentSpeed -= 4;
        }
    }

    if (currentSpeed > 0)
    {
        game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
    }

    //turret.x = tank.x;
    //turret.y = tank.y;

    //turret.rotation = game.physics.arcade.angleToPointer(turret);

    if (game.input.activePointer.isDown)
    {
        fire();
    }

}

function fire() {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;
        var bullet = bullets.getFirstExists(false);
        //bullet.reset(turret.x, turret.y);
        bullet.reset(tank.x, tank.y);
        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 400);
    }

}

