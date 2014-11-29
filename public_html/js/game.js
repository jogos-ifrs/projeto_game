
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'Projeto_game', {preload: preload, create: create, update: update, render: render});
var logoInicio;
var logo;
var land;
var map;
var layer;
var player;
var currentSpeed = 0;
var cursors;
var bullets;
var fireRate = 100;
var nextFire = 0;
var facing = 'down';
var health = 3;
var alive = true;
var nivel = 0;
var arbusto;
//inimigos
var enemies;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;


//text
var content = [
    " teste",
    "Clique para começar"
];

var introText = 0;
var index = 0;
var line = '';
var textGameOver;


function preload() {
    game.load.tilemap('map', 'textures/features.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ground_1x1', 'textures/ground_1x1.png');
    game.load.image('grass2', 'textures/grass2.png');//textura do campo
    game.load.spritesheet('player', 'textures/players.png', 80, 80);
    game.load.image('bullet', 'textures/bullet.png');
    game.load.spritesheet('enemy1', 'textures/enemy1.png', 48, 64);
    game.load.spritesheet('enemy2', 'textures/enemy2.png', 96, 96);
    game.load.spritesheet('urso', 'textures/urso.png', 56, 56);
    game.load.spritesheet('kaboom', 'textures/explosion.png', 64, 64, 23);
    game.load.image('logo', 'textures/logo.png');
    game.load.image('arbusto', 'textures/arbusto.png');
    game.load.audio('sfx', 'audio/lazer.wav');
    game.load.audio('sfx2', 'audio/explode1.wav');
    game.load.audio('sfx3', 'audio/perdeu.mp3');
    game.load.image('cod', 'textures/moonseaj.jpg');
}

function nextLine() {

    index++;

    if (index < content.length)
    {
        line = '';
        game.time.events.repeat(80, content[index].length + 1, updateLine, this);
    }

}

function updateLine() {

    if (line.length < content[index].length) {
        line = content[index].substr(0, line.length + 1);
        // text.text = line;
        introText.setText(line);
    }
    else {
        //  Wait 2 seconds then start a new line
        game.time.events.add(Phaser.Timer.SECOND * 2, nextLine, this);
    }

}


function create() {
    //audio
    fx = game.add.audio('sfx');
    fx.allowMultiple = true;
    fx.addMarker('tiro', 1, 0.1);

    fx2 = game.add.audio('sfx2');
    fx2.allowMultiple = true;
    fx2.addMarker('explosion', 1, 0.1);

    fx3 = game.add.audio('sfx3');
    



    // mapa
    game.world.setBounds(0, 0, 800, 600);
    land = game.add.tileSprite(0, 0, 800, 600, 'grass2');
    land.fixedToCamera = true;
    map = game.add.tilemap('map');
    map.addTilesetImage('ground_1x1');
    map.setCollisionBetween(1, 12);
    layer = map.createLayer('Tile Layer 1');
    var arbustos = 45;
    for (var i = 0; i <= 5; i++) {
        arbusto = game.add.sprite(100, arbustos, 'arbusto');

        arbusto = game.add.sprite(300, arbustos + 150, 'arbusto');

        arbusto = game.add.sprite(500, arbustos + 100, 'arbusto');
        arbustos += 10;
    }


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
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);




    explosions = game.add.group();
    for (var i = 0; i < 10; i++) {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }


    //inimigos
    //enemies = [];
    enemiesTotal = 2;
    enemiesAlive = 2;
    criarInimigos();

    //insere no topo
    player.bringToTop();
    cursors = game.input.keyboard.createCursorKeys();

    logoInicio = game.add.sprite(0, 0, 'cod');
    //texto
    introText = game.add.text(game.world.centerX, 380, '', {font: "30pt Courier", fill: "#19cb65", stroke: "#119f4e", strokeThickness: 2});
    //introText = game.add.text(game.world.centerX, 565, '- click to start -', {font: "40px Arial", fill: "#ffffff", align: "center"});
    introText.anchor.setTo(0.5, 0.5);

    nextLine();



}

function criarInimigos() {
    enemies = [];
    for (var i = 0; i < enemiesTotal; i++) {
        enemies.push(new EnemyMonster(i, game, player, coordenada(), nivel, health));
    }

}

function update() {


    game.input.onDown.add(removeLogo, this);

    game.physics.arcade.overlap(layer, bullets, bulletHitWall, null, this); //tiros não passam das paredes
    game.physics.arcade.collide(player, layer);

    //faz o player não ficar "flutuando"
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    enemiesAlive = 0;


    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].alive) {
            enemiesAlive++;
            game.physics.arcade.overlap(enemies[i].monster, player, monsterAttack, null, this);
            game.physics.arcade.overlap(enemies[i].monster, bullets, bulletHitEnemy, null, this);
            game.physics.arcade.collide(enemies[i].monster, layer); //colisão entre inimigo e paredes
            enemies[i].update();
        }
    }

    //movimentos do player
    if (cursors.left.isDown || game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        player.body.velocity.x = -150;
        if (facing !== 'left') {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown || game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        player.body.velocity.x = 150;

        if (facing !== 'right') {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else if (cursors.up.isDown || game.input.keyboard.isDown(Phaser.Keyboard.W)) {
        player.body.velocity.y = -150;

        if (facing !== 'up') {
            player.animations.play('up');
            facing = 'up';
        }
    }
    else if (cursors.down.isDown || game.input.keyboard.isDown(Phaser.Keyboard.S)) {
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

    //player só atira se clicar no mouse e possuir vida
    if (game.input.activePointer.isDown && health > 0 && line.length === 19) {
        introText.visible = false;
        
        logoInicio.visible = false;

        if (nivel === 0) {
            nivel = 1;
            create();
        }

        fire();
    }
    if (enemiesAlive === 0) {
        enemiesAlive = enemiesTotal + 1;
        enemiesTotal = enemiesAlive;
        nivel++;
        criarInimigos();

    }





    if (game.input.activePointer.isDown) {
        fx.play('tiro');
    }




}

//quando atira na parede o fogo não a ultrapassa
function bulletHitWall(bullet) {
    bullet.kill();
}

//destroi inimigo com tiro
function bulletHitEnemy(monster, bullet) {

    bullet.kill();
    var destroyed = enemies[monster.name].damage();
    if (destroyed) {
        var explosionAnimation = explosions.getFirstExists(false);
        explosionAnimation.reset(monster.x, monster.y);
        explosionAnimation.play('kaboom', 30, false, true);
        fx2.play('explosion');
    }
}

function monsterAttack(monster, player) {
    health -= 1;

    if (health <= 0) {
        alive = false;
        player.kill();
        var explosionAnimation = explosions.getFirstExists(false);
        explosionAnimation.reset(player.x, player.y);
        explosionAnimation.play('kaboom', 30, false, true);
        fx2.play('explosion');
        gameOver();
    }
    var destroyed = enemies[monster.name].damage();
    if (destroyed) {
        var explosionAnimation = explosions.getFirstExists(false);
        explosionAnimation.reset(monster.x, monster.y);
        explosionAnimation.play('kaboom', 30, false, true);
        fx2.play('explosion');
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

function render() {
    game.debug.text('Disparos: ' + bullets.countLiving() + ' / ' + bullets.length, 340, 592);
    game.debug.text('Enemies: ' + enemiesAlive + '/' + enemiesTotal, 260, 22);
    game.debug.text('Health: ' + health + '/' + 3, 430, 22);

    game.debug.text('Nivel: ' + nivel, 20, 22);
}

function coordenada() {

    var enemyInitialCoordinate = new Object();

    var sorteio = Math.floor((Math.random() * 6) + 1);

    switch (sorteio) {
        case 1:
            //entrada esquerda
            enemyInitialCoordinate.x = -23;
            enemyInitialCoordinate.y = 300;
            break;
        case 2:
            //entrada direita
            enemyInitialCoordinate.x = 823;
            enemyInitialCoordinate.y = 300;
            break;
        case 3:
            //entrada superior esquerda
            enemyInitialCoordinate.x = 210;
            enemyInitialCoordinate.y = -25;
            break;
        case 4:
            //entrada superior direita
            enemyInitialCoordinate.x = 594;
            enemyInitialCoordinate.y = -25;
            break;
        case 5:
            //entrada inferior esquerda
            enemyInitialCoordinate.x = 210;
            enemyInitialCoordinate.y = 623;
            break;
        case 6:
            //entrada inferior direita
            enemyInitialCoordinate.x = 594;
            enemyInitialCoordinate.y = 623;
            break;
    }

    return enemyInitialCoordinate;
}


function removeLogo() {
    game.input.onDown.remove(removeLogo, this);
}

function gameOver() {

    logo = game.add.sprite(100, 0, 'logo');


    textGameOver = game.add.text(game.world.centerX, game.world.centerY, "Jogar Novamente", {font: "65px Arial", fill: "green", align: "center"});
    textGameOver.anchor.set(0.5);
    textGameOver.inputEnabled = true;
    textGameOver.events.onInputOver.add(over, this);

    textGameOver.events.onInputDown.add(down, this);
    textGameOver.events.onInputOut.add(out, this);
    
    fx3.play();
    //game.input.onTap.addOnce(restart, this);


}

function over(item) {
    item.fill = "red";
    item.text = "Jogar Novamente";
}

function down(item) {
    item.text = "Jogar Novamente";
    restart();
}

function out(item) {

    item.fill = "green";
    item.text = "Jogar Novamente";

}


function restart() {

    //  And brings the aliens back from the dead :)
    health = 3;
    nivel = 1;
    create();
    //revives the player
    player.revive();

    //hides the text
    //introText.visible = false;
    textGameOver.inputEnabled = false;
    
    

}