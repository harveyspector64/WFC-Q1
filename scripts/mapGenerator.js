// mapGenerator.js
import { getTile } from './tileLoader.js';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from './utils/constants.js';
import { aStar } from './utils/aStar.js';

// Define more detailed patterns for different terrains
const terrainPatterns = {
    grass: ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
    trees: ['tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree'],
    bushes: ['bush', 'bush', 'bush', 'bush', 'bush', 'bush', 'bush', 'bush', 'bush'],
    dirt: ['dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt'],
    hills: ['hill', 'hill', 'hill', 'hill', 'hill', 'hill', 'hill', 'hill', 'hill']
};

export function generateMap(ctx) {
    console.log('Generating map...');
    const map = initializeMap();
    generateBaseTerrain(map);
    generateLakesAndRivers(map);
    generateRoads(map);
    drawMap(ctx, map);
    console.log('Map generation complete.');
}

function initializeMap() {
    const map = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
        map[y] = [];
        for (let x = 0; x < MAP_WIDTH; x++) {
            map[y][x] = null; // Initialize with null to differentiate unassigned tiles
        }
    }
    return map;
}

function generateBaseTerrain(map) {
    console.log('Generating base terrain...');

    // Create regions for different terrains with random positions and sizes
    createRandomTerrainRegions(map, 'grass', 3);
    createRandomTerrainRegions(map, 'trees', 2);
    createRandomTerrainRegions(map, 'bushes', 2);
    createRandomTerrainRegions(map, 'dirt', 1);
    createRandomTerrainRegions(map, 'hills', 1);

    console.log('Base terrain generation complete.');
}

function createRandomTerrainRegions(map, terrainType, count) {
    const pattern = terrainPatterns[terrainType];
    for (let i = 0; i < count; i++) {
        const startX = Math.floor(Math.random() * MAP_WIDTH);
        const startY = Math.floor(Math.random() * MAP_HEIGHT);
        const width = Math.floor(Math.random() * (MAP_WIDTH / 2)) + 1;
        const height = Math.floor(Math.random() * (MAP_HEIGHT / 2)) + 1;

        for (let y = startY; y < startY + height; y++) {
            for (let x = startX; x < startX + width; x++) {
                if (y < MAP_HEIGHT && x < MAP_WIDTH) {
                    map[y][x] = pattern[Math.floor(Math.random() * pattern.length)];
                }
            }
        }
    }
}

function generateLakesAndRivers(map) {
    console.log('Generating river...');
    // Randomize the river start and end points
    const startY = Math.floor(Math.random() * MAP_HEIGHT);
    const endY = Math.floor(Math.random() * MAP_HEIGHT);
    const start = [0, startY];
    const goal = [MAP_WIDTH - 1, endY];
    const riverPath = aStar(start, goal, map);

    if (riverPath) {
        for (const [x, y] of riverPath) {
            if (map[y][x] !== 'road') {
                map[y][x] = 'water';
            }
        }
    }
}

function generateRoads(map) {
    console.log('Generating roads...');
    // Randomize road paths
    const roadPaths = [];
    const roadCount = Math.floor(Math.random() * 3) + 1; // Random number of roads between 1 and 3

    for (let i = 0; i < roadCount; i++) {
        const startX = Math.floor(Math.random() * MAP_WIDTH);
        const startY = 0;
        const goalY = MAP_HEIGHT - 1;
        roadPaths.push(aStar([startX, startY], [startX, goalY], map));
    }

    for (const roadPath of roadPaths) {
        if (roadPath) {
            for (const [x, y] of roadPath) {
                if (map[y][x] !== 'water') {
                    map[y][x] = 'road';
                }
            }
        }
    }
}

function drawMap(ctx, map) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            if (!map[y][x]) {
                map[y][x] = 'grass'; // Default to grass if no tile assigned
            }
            drawTile(ctx, map[y][x], x, y);
        }
    }
}

function drawTile(ctx, tileType, x, y) {
    const tile = getTile(tileType);
    if (tile) {
        ctx.drawImage(tile, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    } else {
        console.error(`Tile ${tileType} not found.`);
    }
}
