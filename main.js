const config = {
    type: Phaser.AUTO,
    width: 640, // 20 tiles * 32px
    height: 480, // 15 tiles * 32px
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    // This is where you will load your Kenney Map Kit assets later
    // Example: this.load.image('tiles', 'assets/terrain_tiles.png');
}

function create() {
    console.log("Phaser is running!");
    this.add.text(100, 100, 'WFC Map Generator', { fill: '#0f0' });
}

function update() {
    // This runs every frame
}