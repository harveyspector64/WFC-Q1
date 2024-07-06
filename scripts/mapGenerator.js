import { getTile } from './tileLoader.js';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from './utils/constants.js';
import { aStar, generateRoadNetwork } from './utils/aStar.js';

// Define more detailed patterns for different terrains
const terrainPatterns = {
    grass: ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
    trees: ['tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree'],
    bushes: ['bush', 'bush', 'bush', 'bush', 'bush', 'bush', 'bush', 'bush'],
    dirt: ['dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt'],
    hills: ['hill', 'hill', 'hill', 'hill', 'hill', 'hill', 'hill', 'hill']
};

export function generateMap(ctx) {
    console.log('Generating map...');
    const map = initializeMap();
    generateTerrain(map);
    generateRiversAndLakes(map);
    generateRoads(map);
    placeStructures(map);
    drawMap(ctx, map);
}

function initializeMap() {
    const map = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
        map[y] = [];
        for (let x = 0; x < MAP_WIDTH; x++) {
            map[y][x] = 'grass';
        }
    }
    return map;
}

function generateTerrain(map) {
    console.log('Generating base terrain...');
    // Improved pattern placement to ensure varied terrain
    placePattern(map, 'trees', 0.3);
    placePattern(map, 'bushes', 0.2);
    placePattern(map, 'dirt', 0.1);
    placePattern(map, 'hills', 0.1);
    console.log('Base terrain generation complete.');
}

function placePattern(map, patternName, frequency) {
    const pattern = terrainPatterns[patternName];
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            if (Math.random() < frequency) {
                for (let i = 0; i < pattern.length; i++) {
                    const offsetX = i % 2;
                    const offsetY = Math.floor(i / 2);
                    if (x + offsetX < MAP_WIDTH && y + offsetY < MAP_HEIGHT) {
                        map[y + offsetY][x + offsetX] = pattern[i];
                    }
                }
            }
        }
    }
}

function generateRiversAndLakes(map) {
    console.log('Generating rivers and lakes...');
    // Create rivers and lakes with more natural distribution
    generateRiver(map);
    generateLake(map);
    console.log('River and lake generation complete.');
}

function generateRiver(map) {
    const start = [0, Math.floor(Math.random() * MAP_HEIGHT)];
    const end = [MAP_WIDTH - 1, Math.floor(Math.random() * MAP_HEIGHT)];
    const path = createCurvedPath(start, end, map, 'water');
    for (const [x, y] of path) {
        map[y][x] = 'water';
    }
}

function generateLake(map) {
    const lakeSize = 10;
    const x = Math.floor(Math.random() * (MAP_WIDTH - lakeSize));
    const y = Math.floor(Math.random() * (MAP_HEIGHT - lakeSize));
    for (let i = 0; i < lakeSize; i++) {
        for (let j = 0; j < lakeSize; j++) {
            map[y + j][x + i] = 'water';
        }
    }
}

function generateRoads(map) {
    console.log('Generating roads...');
    // Generate a more realistic road network
    generateRoadNetwork(map, 10); // generate 10 road segments
    console.log('Road generation complete.');
}

function placeStructures(map) {
    console.log('Placing structures...');
    // Define rules for placing barns, silos, etc.
    placeStructure(map, 'barn');
    placeStructure(map, 'silo');
    console.log('Structure placement complete.');
}

function placeStructure(map, structure) {
    const x = Math.floor(Math.random() * MAP_WIDTH);
    const y = Math.floor(Math.random() * MAP_HEIGHT);
    map[y][x] = structure;
}

function drawMap(ctx, map) {
    console.log('Drawing map...');
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const tileType = getTile(map[y][x]);
            if (tileType) {
                ctx.drawImage(tileType, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
    console.log('Map generation complete.');
}
