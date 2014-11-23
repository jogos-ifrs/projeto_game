
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'Projeto_game', {preload: preload, create: create });

function preload() {

    //textura do campo
    game.load.image('earth', 'textures/earth.png');
    game.load.atlas('tank', 'assets/games/tanks/tanks.png', 'assets/games/tanks/tanks.json');

}


var land;

function create() {
   
    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 800, 600, 'earth');
    //land.fixedToCamera = true;

    

}

function changeTexture() {

    

}

