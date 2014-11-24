EnemyTank = function (index, game, player, layer) {

    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.player = player;
    this.alive = true;

    this.tank = game.add.sprite(x, y, 'enemy', 1);
    this.tank.anchor.set(0.5, 0.5);
    //this.tank.name = index.toString();

    this.game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.tank.body.drag.set(0.2);
    this.tank.body.collideWorldBounds = true;
    this.tank.body.bounce.setTo(1, 1);
    //this.game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity);
};

EnemyTank.prototype.update = function () {
    
    
};

EnemyTank.prototype.damage = function () {

    this.health -= 1;

    if (this.health <= 0)
    {
        this.alive = false;
        this.tank.kill();
        return true;
    }

    return false;

};
