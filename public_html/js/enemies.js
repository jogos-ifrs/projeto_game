EnemyMonster = function (index, game, player, coordenada, nivel, health) {

    this.inicio = true;
    this.health = health;
    this.x = coordenada.x;
    this.y = coordenada.y;
    this.nivel = nivel;
    this.nivelVelocidade =70;
    this.game = game;
    this.player = player;
    this.alive = true;

if(this.nivel >0){
    if(this.nivel >=4 && this.nivel <10){
        
        this.monster = game.add.sprite(this.x, this.y, 'enemy1', 1);
        this.monster.animations.add('down', [0, 1, 2, 3], 10, true);
        this.monster.animations.add('left', [4, 5, 6, 7], 10, true);
        this.monster.animations.add('right', [8, 9, 10, 11], 10, true);
        this.monster.animations.add('up', [12, 13, 14, 15], 10, true);
        this.nivelVelocidade = 110;
        
    }else if(this.nivel >=10){
        
        this.monster = game.add.sprite(this.x, this.y, 'enemy2', 1);
        this.monster.animations.add('down', [0, 1, 2], 10, true);
        this.monster.animations.add('left', [3, 4, 5], 10, true);
        this.monster.animations.add('right', [6, 7, 8], 10, true);
        this.monster.animations.add('up', [9, 10, 11], 10, true);
        this.nivelVelocidade = 130;
        
    }else{

    
        this.monster = game.add.sprite(this.x, this.y, 'urso', 1);
        this.monster.animations.add('down', [0, 1, 2, 3], 10, true);
        this.monster.animations.add('left', [4, 5, 6, 7], 10, true);
        this.monster.animations.add('right', [8, 9, 10, 11], 10, true);
        this.monster.animations.add('up', [12, 13, 14, 15], 10, true);
    
    }
    
    this.monster.anchor.set(0.5, 0.5);
    this.monster.name = index.toString();

    this.game.physics.enable(this.monster, Phaser.Physics.ARCADE);
    this.monster.body.drag.set(0.2);
    this.monster.body.bounce.setTo(1, 1);
    this.monster.body.immovable = false;
    this.monster.body.velocity.x = 0;
    this.monster.body.velocity.y = 0;
    this.monster.body.collideWorldBounds = true; //impedir saída dos monster pelas entradas
    this.game.physics.arcade.velocityFromRotation(this.monster.rotation, 100, this.monster.body.velocity);
    }
};

EnemyMonster.prototype.update = function () {
    
    if(this.health >0 && this.nivel >=1){

    if (this.monster.y < this.player.y + 15 && this.monster.y > this.player.y - 15) { //quando o monster estiver perto da altura do player ele persegue no eixo x
        this.game.physics.arcade.moveToXY(this.monster, this.player.x, this.monster.y, this.nivelVelocidade);


        if (this.monster.x >= this.player.x) {
            this.monster.animations.play('left');
        } else {
            this.monster.animations.play('right');
        }

    } else {

        if (this.monster.x > 80 && this.monster.x < 720) {//evitar que o monster fique preso nas paredes da esquerda e direita
            this.game.physics.arcade.moveToXY(this.monster, this.monster.x, this.player.y, this.nivelVelocidade);//monster vai na altura do player

            if (this.monster.y >= this.player.y) {
                this.monster.animations.play('up');
            } else {
                this.monster.animations.play('down');
            }

        }else{
            if (this.monster.x >= this.player.x) {
            this.monster.animations.play('left');
        } else {
            this.monster.animations.play('right');
        }
        }


    }}

};

EnemyMonster.prototype.damage = function () {
    this.alive = false;
    this.monster.kill();

    return true;
};


