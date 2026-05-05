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
    this.load.spritesheet('tiles', 'assets/tilesheet.png', { 
        frameWidth: 64, 
        frameHeight: 64 
    });
}

function create() {
    console.log("Phaser is running!");
    this.add.text(100, 100, 'WFC Map Generator', { fill: '#0f0' });
}

function update() {
    // This runs every frame
}


const TILE_SIZE = 64;
const MAP_WIDTH = 24;
const MAP_HEIGHT = 18;

const DIRECTIONS = [
    { name: "north", dx: 0, dy: -1, opposite: "south" },
    { name: "east", dx: 1, dy: 0, opposite: "west" },
    { name: "south", dx: 0, dy: 1, opposite: "north" },
    { name: "west", dx: -1, dy: 0, opposite: "east" },
];

const TILE_TYPES = {
    WATER: "water",
    GRASS: "grass",
    DIRT: "dirt",
};

const TILES = [
    terrainTile("water", "mapTile_188.png", ["water", "water", "water", "water"], TILE_TYPES.WATER),
    terrainTile("grass", "mapTile_024.png", ["grass", "grass", "grass", "grass"], TILE_TYPES.GRASS),
    terrainTile("dirt", "mapTile_087.png", ["dirt", "dirt", "dirt", "dirt"], TILE_TYPES.DIRT),

    terrainTile("grass-water-n", "mapTile_007.png", ["water", "grass", "grass", "grass"], TILE_TYPES.GRASS),
    terrainTile("grass-water-e", "mapTile_007.png", ["grass", "water", "grass", "grass"], TILE_TYPES.GRASS, 90),
    terrainTile("grass-water-s", "mapTile_007.png", ["grass", "grass", "water", "grass"], TILE_TYPES.GRASS, 180),
    terrainTile("grass-water-w", "mapTile_007.png", ["grass", "grass", "grass", "water"], TILE_TYPES.GRASS, 270),

    terrainTile("grass-water-ne", "mapTile_008.png", ["water", "water", "grass", "grass"], TILE_TYPES.GRASS),
    terrainTile("grass-water-se", "mapTile_008.png", ["grass", "water", "water", "grass"], TILE_TYPES.GRASS, 90),
    terrainTile("grass-water-sw", "mapTile_008.png", ["grass", "grass", "water", "water"], TILE_TYPES.GRASS, 180),
    terrainTile("grass-water-nw", "mapTile_008.png", ["water", "grass", "grass", "water"], TILE_TYPES.GRASS, 270),

    terrainTile("dirt-grass-n", "mapTile_097.png", ["grass", "dirt", "dirt", "dirt"], TILE_TYPES.DIRT),
    terrainTile("dirt-grass-e", "mapTile_097.png", ["dirt", "grass", "dirt", "dirt"], TILE_TYPES.DIRT, 90),
    terrainTile("dirt-grass-s", "mapTile_097.png", ["dirt", "dirt", "grass", "dirt"], TILE_TYPES.DIRT, 180),
    terrainTile("dirt-grass-w", "mapTile_097.png", ["dirt", "dirt", "dirt", "grass"], TILE_TYPES.DIRT, 270),

    terrainTile("dirt-grass-ne", "mapTile_098.png", ["grass", "grass", "dirt", "dirt"], TILE_TYPES.DIRT),
    terrainTile("dirt-grass-se", "mapTile_098.png", ["dirt", "grass", "grass", "dirt"], TILE_TYPES.DIRT, 90),
    terrainTile("dirt-grass-sw", "mapTile_098.png", ["dirt", "dirt", "grass", "grass"], TILE_TYPES.DIRT, 180),
    terrainTile("dirt-grass-nw", "mapTile_098.png", ["grass", "dirt", "dirt", "grass"], TILE_TYPES.DIRT, 270),
];

const DECORATIONS = [
    { name: "pine", frame: "mapTile_060.png", terrains: [TILE_TYPES.GRASS] },
    { name: "roundTree", frame: "mapTile_071.png", terrains: [TILE_TYPES.GRASS] },
    { name: "tower", frame: "mapTile_099.png", terrains: [TILE_TYPES.GRASS, TILE_TYPES.DIRT] },
    { name: "castle", frame: "mapTile_100.png", terrains: [TILE_TYPES.DIRT] },
    { name: "mushroom", frame: "mapTile_103.png", terrains: [TILE_TYPES.GRASS] },
];
