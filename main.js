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
    terrainTile("grass", "mapTile_022.png", ["grass", "grass", "grass", "grass"], TILE_TYPES.GRASS, 5),
    terrainTile("dirt", "mapTile_087.png", ["dirt", "dirt", "dirt", "dirt"], TILE_TYPES.DIRT, 2),

    terrainTile("grass-water-n", "mapTile_007.png", ["water", "grass", "grass", "grass"], TILE_TYPES.GRASS),
    terrainTile("grass-water-e", "mapTile_007.png", ["grass", "water", "grass", "grass"], TILE_TYPES.GRASS, 1, 90),
    terrainTile("grass-water-s", "mapTile_007.png", ["grass", "grass", "water", "grass"], TILE_TYPES.GRASS, 1, 180),
    terrainTile("grass-water-w", "mapTile_007.png", ["grass", "grass", "grass", "water"], TILE_TYPES.GRASS, 1, 270),

    terrainTile("grass-water-ne", "mapTile_008.png", ["water", "water", "grass", "grass"], TILE_TYPES.GRASS),
    terrainTile("grass-water-se", "mapTile_008.png", ["grass", "water", "water", "grass"], TILE_TYPES.GRASS, 1, 90),
    terrainTile("grass-water-sw", "mapTile_008.png", ["grass", "grass", "water", "water"], TILE_TYPES.GRASS, 1, 180),
    terrainTile("grass-water-nw", "mapTile_008.png", ["water", "grass", "grass", "water"], TILE_TYPES.GRASS, 1, 270),

    terrainTile("dirt-grass-n", "mapTile_067.png", ["grass", "dirt", "dirt", "dirt"], TILE_TYPES.DIRT),
    terrainTile("dirt-grass-e", "mapTile_083.png", ["dirt", "grass", "dirt", "dirt"], TILE_TYPES.DIRT),
    terrainTile("dirt-grass-s", "mapTile_097.png", ["dirt", "dirt", "grass", "dirt"], TILE_TYPES.DIRT),
    terrainTile("dirt-grass-w", "mapTile_081.png", ["dirt", "dirt", "dirt", "grass"], TILE_TYPES.DIRT),

    terrainTile("dirt-grass-ne", "mapTile_068.png", ["grass", "grass", "dirt", "dirt"], TILE_TYPES.DIRT),
    terrainTile("dirt-grass-se", "mapTile_098.png", ["dirt", "grass", "grass", "dirt"], TILE_TYPES.DIRT),
    terrainTile("dirt-grass-sw", "mapTile_096.png", ["dirt", "dirt", "grass", "grass"], TILE_TYPES.DIRT),
    terrainTile("dirt-grass-nw", "mapTile_066.png", ["grass", "dirt", "dirt", "grass"], TILE_TYPES.DIRT),

    // Grass variations (flowers, rocks, different blades)
    terrainTile("grass-flowers", "mapTile_022.png", ["grass", "grass", "grass", "grass"], TILE_TYPES.GRASS, 0.5),
    //terrainTile("grass-rocks", "mapTile_026.png", ["grass", "grass", "grass", "grass"], TILE_TYPES.GRASS, 0.2),

    // // Grass-Water Inner Corners (Concave)
    // terrainTile("grass-water-inner-nw", "mapTile_019.png", ["grass", "water", "water", "grass"], TILE_TYPES.GRASS),
    // terrainTile("grass-water-inner-ne", "mapTile_019.png", ["grass", "grass", "water", "water"], TILE_TYPES.GRASS, 1, 90),
    // terrainTile("grass-water-inner-se", "mapTile_019.png", ["water", "grass", "grass", "water"], TILE_TYPES.GRASS, 1, 180),
    // terrainTile("grass-water-inner-sw", "mapTile_019.png", ["water", "water", "grass", "grass"], TILE_TYPES.GRASS, 1, 270),

    // Dirt-Grass Inner Corners (Concave)
    // terrainTile("dirt-grass-inner-nw", "mapTile_066.png", ["dirt", "grass", "grass", "dirt"], TILE_TYPES.DIRT),
    // terrainTile("dirt-grass-inner-ne", "mapTile_066.png", ["dirt", "dirt", "grass", "grass"], TILE_TYPES.DIRT),
    // terrainTile("dirt-grass-inner-se", "mapTile_066.png", ["grass", "dirt", "dirt", "grass"], TILE_TYPES.DIRT),
    // terrainTile("dirt-grass-inner-sw", "mapTile_066.png", ["grass", "grass", "dirt", "dirt"], TILE_TYPES.DIRT),
];

const DECORATIONS = [
    { name: "pine", frame: "mapTile_060.png", terrains: [TILE_TYPES.GRASS], chance: 0.09 },
    { name: "cactus", frame: "mapTile_035.png", terrains: [TILE_TYPES.GRASS], chance: 0.05 },
    { name: "tower", frame: "mapTile_099.png", terrains: [TILE_TYPES.GRASS, TILE_TYPES.DIRT], chance: 0.025 },
    { name: "castle", frame: "mapTile_100.png", terrains: [TILE_TYPES.DIRT], chance: 0.04 },
    { name: "pyramid", frame: "mapTile_050.png", terrains: [TILE_TYPES.GRASS], chance: 0.035 },
];  

// const ROAD_TILES = {
//     HORIZONTAL: "mapTile_127.png",
//     VERTICAL: "mapTile_128.png", // Find the vertical frame
//     CORNER_NE: "mapTile_129.png"  // Find the corner frame
// };

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

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createTerrainPlan() {
    const islandLeft = randomInteger(3, 5);
    const islandRight = randomInteger(MAP_WIDTH - 7, MAP_WIDTH - 4);
    const islandTop = randomInteger(2, 4);
    const islandBottom = randomInteger(MAP_HEIGHT - 5, MAP_HEIGHT - 3);
    const dirtWidth = randomInteger(5, 8);
    const dirtHeight = randomInteger(4, 6);
    const dirtLeft = randomInteger(islandLeft + 3, islandRight - dirtWidth - 2);
    const dirtRight = dirtLeft + dirtWidth;
    const dirtTop = randomInteger(islandTop + 3, islandBottom - dirtHeight - 2);
    const dirtBottom = dirtTop + dirtHeight;

    return Array.from({ length: MAP_HEIGHT }, (_, y) => {
        return Array.from({ length: MAP_WIDTH }, (_, x) => {
            const onIsland = x >= islandLeft && x <= islandRight && y >= islandTop && y <= islandBottom;
            const inDirtPatch = x >= dirtLeft && x <= dirtRight && y >= dirtTop && y <= dirtBottom;

            if (!onIsland) {
                return TILE_TYPES.WATER;
            }

            if (inDirtPatch) {
                return TILE_TYPES.DIRT;
            }

            return TILE_TYPES.GRASS;
        });
    });
}

function getPlannedTerrain(plan, x, y) {
    if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) {
        return TILE_TYPES.WATER;
    }

    return plan[y][x];
}

function getExpectedEdgeTerrain(plannedTerrain, neighborTerrain) {
    if (plannedTerrain === TILE_TYPES.WATER) {
        return TILE_TYPES.WATER;
    }

    if (plannedTerrain === TILE_TYPES.GRASS) {
        return neighborTerrain === TILE_TYPES.WATER ? TILE_TYPES.WATER : TILE_TYPES.GRASS;
    }

    if (plannedTerrain === TILE_TYPES.DIRT) {
        return neighborTerrain === TILE_TYPES.DIRT ? TILE_TYPES.DIRT : TILE_TYPES.GRASS;
    }

    return plannedTerrain;
}

function tileFitsTerrainPlan(tile, plan, x, y) {
    const plannedTerrain = getPlannedTerrain(plan, x, y);

    if (plannedTerrain === TILE_TYPES.WATER) {
        return tile.terrain === TILE_TYPES.WATER;
    }

    if (tile.terrain !== plannedTerrain) {
        return false;
    }

    return DIRECTIONS.every((direction) => {
        const neighborTerrain = getPlannedTerrain(plan, x + direction.dx, y + direction.dy);
        const expectedEdgeTerrain = getExpectedEdgeTerrain(plannedTerrain, neighborTerrain);
        return tile.edges[direction.name] === expectedEdgeTerrain;
    });
}

function createCell(x, y, terrainPlan) {
    const options = TILES.filter((tile) => {
        return tileFitsTerrainPlan(tile, terrainPlan, x, y);
    });

    // If no tiles fully match the terrain+edge constraints, prefer tiles that at least match the planned terrain.
    // This prevents completely unrelated corner/dirt tiles from being used as a blind fallback.
    const plannedTerrain = getPlannedTerrain(terrainPlan, x, y);

    const fallbackOptions = options.length > 0
        ? options
        : TILES.filter(tile => tile.terrain === plannedTerrain);

    return {
        x,
        y,
        collapsed: false,
        options: fallbackOptions.length > 0 ? fallbackOptions : [...TILES],
    };
}

function createWaveGrid() {
    const terrainPlan = createTerrainPlan();
    const grid = [];

    for (let y = 0; y < MAP_HEIGHT; y += 1) {
        const row = [];

        for (let x = 0; x < MAP_WIDTH; x += 1) {
            row.push(createCell(x, y, terrainPlan));
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

function gridIsCollapsed(grid) {
    return grid.every((row) => {
        return row.every((cell) => cell.collapsed);
    });
}

function pickWeightedTile(tileOptions) {
    const totalWeight = tileOptions.reduce((sum, tile) => sum + tile.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const tile of tileOptions) {
        roll -= tile.weight;

        if (roll <= 0) {
            return tile;
        }
    }

    return tileOptions[tileOptions.length - 1];
}

function collapseCell(cell) {
    const chosenTile = pickWeightedTile(cell.options);

    cell.collapsed = true;
    cell.options = [chosenTile];

    return chosenTile;
}

function tilesAreCompatible(tile, otherTile, direction) {
    return tile.edges[direction.name] === otherTile.edges[direction.opposite];
}

function getNeighborCell(grid, cell, direction) {
    const neighborX = cell.x + direction.dx;
    const neighborY = cell.y + direction.dy;

    if (neighborX < 0 || neighborY < 0 || neighborX >= MAP_WIDTH || neighborY >= MAP_HEIGHT) {
        return null;
    }

    return grid[neighborY][neighborX];
}

function getCompatibleOptions(sourceOptions, neighborOptions, direction) {
    return neighborOptions.filter((neighborTile) => {
        return sourceOptions.some((sourceTile) => {
            return tilesAreCompatible(sourceTile, neighborTile, direction);
        });
    });
}

function propagateFromCell(grid, cell) {
    const queue = [cell];

    while (queue.length > 0) {
        const currentCell = queue.shift();

        for (const direction of DIRECTIONS) {
            const neighbor = getNeighborCell(grid, currentCell, direction);

            if (!neighbor || neighbor.collapsed) {
                continue;
            }

            const nextOptions = getCompatibleOptions(currentCell.options, neighbor.options, direction);

            if (nextOptions.length === 0) {
                return false;
            }

            if (nextOptions.length < neighbor.options.length) {
                neighbor.options = nextOptions;
                queue.push(neighbor);
            }
        }
    }

    return true;
}

function generateCollapsedGrid() {
    const maxAttempts = 20;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const grid = createWaveGrid();
        let generationFailed = false;

        while (!gridIsCollapsed(grid)) {
            const cell = findLowestEntropyCell(grid);

            if (!cell) {
                generationFailed = true;
                break;
            }

            collapseCell(cell);

            if (!propagateFromCell(grid, cell)) {
                generationFailed = true;
                break;
            }
        }

        if (!generationFailed) {
            return grid;
        }
    }

    return createWaveGrid();
}

function preload() {
    this.load.atlasXML("mapPack", "assets/Spritesheet/mapPack_spritesheet.png", "assets/Spritesheet/mapPack_spritesheet.xml");
}

function create() {
    this.mapLayer = this.add.container(0, 0);

    this.add.text(16, 14, "WFC map | R regenerates", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "rgba(0, 0, 0, 0.48)",
        padding: { x: 10, y: 7 },
    }).setDepth(10);

    this.input.keyboard.on("keydown-R", () => {
        regenerateMap(this);
    });

    regenerateMap(this);
}

function update() {
}

function getBaseFrame(tile) {
    if (tile.name.includes("water")) {
        return "mapTile_188.png";
    }

    if (tile.name.includes("dirt-grass")) {
        return "mapTile_022.png";
    }

    return null;
}

function regenerateMap(scene) {
    scene.waveGrid = generateCollapsedGrid();
    drawGeneratedMap(scene, scene.waveGrid);
    console.log("Generated grid:", scene.waveGrid);
}

function drawGeneratedMap(scene, grid) {
    scene.mapLayer.removeAll(true);
    const roadCells = createRoadPath(grid);

    for (const row of grid) {
        for (const cell of row) {
            const tile = cell.options[0];
            const pixelX = cell.x * TILE_SIZE + TILE_SIZE / 2;
            const pixelY = cell.y * TILE_SIZE + TILE_SIZE / 2;
            const baseFrame = getBaseFrame(tile);

            if (baseFrame) {
                scene.mapLayer.add(scene.add.image(pixelX, pixelY, "mapPack", baseFrame));
            }

            scene.mapLayer.add(
                scene.add.image(pixelX, pixelY, "mapPack", tile.frame).setAngle(tile.rotation)
            );

            const decoration = roadCells.has(getCellKey(cell)) ? null : pickDecorationForTile(tile);

            if (decoration) {
                scene.mapLayer.add(scene.add.image(pixelX, pixelY, "mapPack", decoration.frame).setOrigin(0.5, 0.72));
            }
        }
    }

    drawRoadPath(scene, roadCells);
}

function pickDecorationForTile(tile) {
    if (tile.terrain === TILE_TYPES.WATER || tile.name.includes("water") || tile.name.includes("grass-")) {
        return null;
    }

    for (const decoration of DECORATIONS) {
        if (!decoration.terrains.includes(tile.terrain)) {
            continue;
        }

        if (Math.random() < decoration.chance) {
            return decoration;
        }
    }

    return null;
}

function createRoadPath(grid) {
    const roadCells = new Set();
    let dirtCells = [];
    
    // Find all dirt cells
    for (const row of grid) {
        for (const cell of row) {
            if (cell.options[0].terrain === TILE_TYPES.DIRT) {
                dirtCells.push(cell);
            }
        }
    }

    if (dirtCells.length === 0) return roadCells;

    // Get the boundaries of our dirt patch
    const minX = Math.min(...dirtCells.map(c => c.x));
    const maxX = Math.max(...dirtCells.map(c => c.x));
    const minY = Math.min(...dirtCells.map(c => c.y));
    const maxY = Math.max(...dirtCells.map(c => c.y));
    
    // Start in the middle of the left edge of the dirt
    const startY = Math.floor(dirtCells.reduce((sum, c) => sum + c.y, 0) / dirtCells.length);

    let currX = minX;
    let currY = startY;
    roadCells.add(`${currX},${currY}`);

    // Simple Random Walk to the right side
    while (currX < maxX) {
        const roll = Math.random();
        
        // 50% chance to move Right, 25% Up, 25% Down
        if (roll < 0.50) {
            currX++; 
        } else if (roll < 0.75) {
            currY--; 
        } else {
            currY++; 
        }
        
        // Keep the road confined inside the dirt patch vertically
        currY = Math.max(minY, Math.min(maxY, currY));
        
        roadCells.add(`${currX},${currY}`);
    }

    return roadCells;
}

function drawRoadPath(scene, roadCells) {
    for (const cellKey of roadCells) {
        const [x, y] = cellKey.split(",").map(Number);
        const pixelX = x * TILE_SIZE + TILE_SIZE / 2;
        const pixelY = y * TILE_SIZE + TILE_SIZE / 2;

        // 1. Check which surrounding tiles also have a road
        const n = roadCells.has(`${x},${y-1}`);
        const s = roadCells.has(`${x},${y+1}`);
        const e = roadCells.has(`${x+1},${y}`);
        const w = roadCells.has(`${x-1},${y}`);

        let frame = ROAD_TILES.HORIZONTAL;
        let angle = 0;

        // 2. Auto-Tiling Logic: Pick the frame & rotation based on neighbors
        if (n && s) { frame = ROAD_TILES.VERTICAL; }
        else if (e && w) { frame = ROAD_TILES.HORIZONTAL; }
        else if (n && e) { frame = ROAD_TILES.CORNER_NE; angle = 0; }
        else if (s && e) { frame = ROAD_TILES.CORNER_NE; angle = 90; }
        else if (s && w) { frame = ROAD_TILES.CORNER_NE; angle = 180; }
        else if (n && w) { frame = ROAD_TILES.CORNER_NE; angle = 270; }
        // Fallback for dead ends (start/end points)
        else if (n || s) { frame = ROAD_TILES.VERTICAL; }
        else { frame = ROAD_TILES.HORIZONTAL; }

        scene.mapLayer.add(
            scene.add.image(pixelX, pixelY, "mapPack", frame).setAngle(angle)
        );
    }
}

function getCellKey(cell) {
    return `${cell.x},${cell.y}`;
}

const config = {
    type: Phaser.AUTO,
    width: MAP_WIDTH * TILE_SIZE,
    height: MAP_HEIGHT * TILE_SIZE,
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
