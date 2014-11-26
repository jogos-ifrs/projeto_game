EnemyMonster = function (index, game, player, coordenada) {

    this.x = coordenada.x;
    this.y = coordenada.y;

    this.game = game;
    this.player = player;
    this.alive = true;
    

    this.monster = game.add.sprite(this.x, this.y, 'enemy', 1);
    this.monster.anchor.set(0.5, 0.5);
    this.monster.name = index.toString();
    

    this.game.physics.enable(this.monster, Phaser.Physics.ARCADE);
    this.monster.body.drag.set(0.2);
    this.monster.body.bounce.setTo(1, 1);
    //this.monster.body.collideWorldBounds = true; //impedir saída dos monster pelas entradas
    this.game.physics.arcade.velocityFromRotation(this.monster.rotation, 100, this.monster.body.velocity);
    
   
  
};

EnemyMonster.prototype.update = function () {
     //this.game.physics.arcade.moveToObject(this.monster, this.player, 100);
     this.game.physics.arcade.moveToXY(this.monster, this.player.x, this.player.y, 120) ;
};

EnemyMonster.prototype.damage = function () {
    this.alive = false;
    this.monster.kill();
    return true;
};
