EnemyMonster = function (index, game, player) {

    //var x = game.world.randomX;
    //var y = game.world.randomY;
    
    var x = 100;
    var y = 300;

    this.game = game;
    this.player = player;
    this.alive = true;

    this.monster = game.add.sprite(x, y, 'enemy', 1);
    this.monster.anchor.set(0.5, 0.5);
    //this.monster.name = index.toString();

    this.game.physics.enable(this.monster, Phaser.Physics.ARCADE);
    this.monster.body.drag.set(0.2);
    this.monster.body.bounce.setTo(1, 1);
    this.game.physics.arcade.velocityFromRotation(this.monster.rotation, 100, this.monster.body.velocity);
    
  
};

EnemyMonster.prototype.update = function () {
    
    
};

EnemyMonster.prototype.damage = function () {


};
