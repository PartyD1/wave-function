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
    terrainTile("water", "mapTile_188.png", ["water", "water", "water", "water"], TILE_TYPES.WATER, 5),
    terrainTile("grass", "mapTile_024.png", ["grass", "grass", "grass", "grass"], TILE_TYPES.GRASS, 5),
    terrainTile("dirt", "mapTile_087.png", ["dirt", "dirt", "dirt", "dirt"], TILE_TYPES.DIRT, 2),

    terrainTile("grass-water-n", "mapTile_007.png", ["water", "grass", "grass", "grass"], TILE_TYPES.GRASS),
    terrainTile("grass-water-e", "mapTile_007.png", ["grass", "water", "grass", "grass"], TILE_TYPES.GRASS, 1, 90),
    terrainTile("grass-water-s", "mapTile_007.png", ["grass", "grass", "water", "grass"], TILE_TYPES.GRASS, 1, 180),
    terrainTile("grass-water-w", "mapTile_007.png", ["grass", "grass", "grass", "water"], TILE_TYPES.GRASS, 1, 270),

    terrainTile("grass-water-ne", "mapTile_008.png", ["water", "water", "grass", "grass"], TILE_TYPES.GRASS),
    terrainTile("grass-water-se", "mapTile_008.png", ["grass", "water", "water", "grass"], TILE_TYPES.GRASS, 1, 90),
    terrainTile("grass-water-sw", "mapTile_008.png", ["grass", "grass", "water", "water"], TILE_TYPES.GRASS, 1, 180),
    terrainTile("grass-water-nw", "mapTile_008.png", ["water", "grass", "grass", "water"], TILE_TYPES.GRASS, 1, 270),

    terrainTile("dirt-grass-n", "mapTile_097.png", ["grass", "dirt", "dirt", "dirt"], TILE_TYPES.DIRT),
    terrainTile("dirt-grass-e", "mapTile_097.png", ["dirt", "grass", "dirt", "dirt"], TILE_TYPES.DIRT, 1, 90),
    terrainTile("dirt-grass-s", "mapTile_097.png", ["dirt", "dirt", "grass", "dirt"], TILE_TYPES.DIRT, 1, 180),
    terrainTile("dirt-grass-w", "mapTile_097.png", ["dirt", "dirt", "dirt", "grass"], TILE_TYPES.DIRT, 1, 270),

    terrainTile("dirt-grass-ne", "mapTile_098.png", ["grass", "grass", "dirt", "dirt"], TILE_TYPES.DIRT),
    terrainTile("dirt-grass-se", "mapTile_098.png", ["dirt", "grass", "grass", "dirt"], TILE_TYPES.DIRT, 1, 90),
    terrainTile("dirt-grass-sw", "mapTile_098.png", ["dirt", "dirt", "grass", "grass"], TILE_TYPES.DIRT, 1, 180),
    terrainTile("dirt-grass-nw", "mapTile_098.png", ["grass", "dirt", "dirt", "grass"], TILE_TYPES.DIRT, 1, 270),
];

const DECORATIONS = [
    { name: "pine", frame: "mapTile_060.png", terrains: [TILE_TYPES.GRASS] },
    { name: "roundTree", frame: "mapTile_071.png", terrains: [TILE_TYPES.GRASS] },
    { name: "tower", frame: "mapTile_099.png", terrains: [TILE_TYPES.GRASS, TILE_TYPES.DIRT] },
    { name: "castle", frame: "mapTile_100.png", terrains: [TILE_TYPES.DIRT] },
    { name: "mushroom", frame: "mapTile_103.png", terrains: [TILE_TYPES.GRASS] },
];

function terrainTile(name, frame, edges, terrain, weight = 1, rotation = 0) {
    const [north, east, south, west] = edges;

    return {
        name,
        frame,
        terrain,
        weight,
        rotation,
        edges: { north, east, south, west },
    };
}

function getEntropy(tileOptions) {
    const totalWeight = tileOptions.reduce((sum, tile) => sum + tile.weight, 0);
    let weightedLogSum = 0;

    for (const tile of tileOptions) {
        weightedLogSum += tile.weight * Math.log(tile.weight);
    }

    return Math.log(totalWeight) - weightedLogSum / totalWeight;
}

function createCell(x, y) {
    return {
        x,
        y,
        collapsed: false,
        options: [...TILES],
    };
}

function createWaveGrid() {
    const grid = [];

    for (let y = 0; y < MAP_HEIGHT; y += 1) {
        const row = [];

        for (let x = 0; x < MAP_WIDTH; x += 1) {
            row.push(createCell(x, y));
        }

        grid.push(row);
    }

    return grid;
}

function findLowestEntropyCell(grid) {
    let lowestEntropyCell = null;
    let lowestEntropy = Infinity;

    for (const row of grid) {
        for (const cell of row) {
            if (cell.collapsed) {
                continue;
            }

            const entropy = getEntropy(cell.options);

            if (entropy < lowestEntropy) {
                lowestEntropy = entropy;
                lowestEntropyCell = cell;
            }
        }
    }

    return lowestEntropyCell;
}

function collapseCell(cell) {
    const randomIndex = Math.floor(Math.random() * cell.options.length);
    const chosenTile = cell.options[randomIndex];

    cell.collapsed = true;
    cell.options = [chosenTile];

    return chosenTile;
}

function preload() {
    this.load.atlasXML("mapPack", "assets/Spritesheet/mapPack_spritesheet.png", "assets/Spritesheet/mapPack_spritesheet.xml");
}

function create() {
    this.waveGrid = createWaveGrid();
    const lowestEntropyCell = findLowestEntropyCell(this.waveGrid);
    const chosenTile = collapseCell(lowestEntropyCell);

    console.log("Starting entropy:", getEntropy(TILES));
    console.log("Sample cell:", this.waveGrid[0][0]);
    console.log("Lowest entropy cell:", lowestEntropyCell);
    console.log("Collapsed tile:", chosenTile);

    this.add.text(16, 14, "Step 4: collapse one cell", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "rgba(0, 0, 0, 0.48)",
        padding: { x: 10, y: 7 },
    }).setDepth(10);

    drawPlaceholderMap(this);
}

function update() {
}

function drawPlaceholderMap(scene) {
    const waterTile = TILES.find((tile) => tile.name === "water");

    for (let y = 0; y < MAP_HEIGHT; y += 1) {
        for (let x = 0; x < MAP_WIDTH; x += 1) {
            scene.add.image(
                x * TILE_SIZE + TILE_SIZE / 2,
                y * TILE_SIZE + TILE_SIZE / 2,
                "mapPack",
                waterTile.frame
            );
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 860,
    parent: "phaser-game",
    backgroundColor: "#19202a",
    pixelArt: true,
    scene: {
        preload,
        create,
        update,
    },
};

new Phaser.Game(config);
