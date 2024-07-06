// mapGenerator.js
import { getTile } from './tileLoader.js';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from './utils/constants.js';
import { aStar } from './utils/aStar.js';

const patterns = [
    ['grass', 'grass', 'grass', 'tree', 'grass', 'tree', 'grass', 'grass', 'grass'],
    ['bush', 'bush', 'bush', 'dirt', 'bush', 'dirt', 'bush', 'bush', 'bush'],
    ['grass', 'grass', 'grass', 'grass', 'dirt', 'grass', 'grass', 'grass', 'grass'],
    ['grass', 'grass', 'grass', 'road', 'road', 'road', 'grass', 'grass', 'grass'],
    ['hill', 'hill', 'hill', 'hill', 'hill', 'hill', 'hill', 'hill', 'hill']
];

export function generateMap(ctx) {
    console.log('Generating map...');
    const map = initializeMap();
    generateBaseTerrain(map);
    generateWaterAndRoads(map);
    drawMap(ctx, map);
    console.log('Map generation complete.');
}

function initializeMap() {
    const map = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
        map[y] = [];
        for (let x = 0; x < MAP_WIDTH; x++) {
            map[y][x] = 'grass'; // Default to grass
        }
    }
    return map;
}

function generateBaseTerrain(map) {
    console.log('Generating base terrain...');
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const pattern = getMatchingPattern();
            map[y][x] = pattern[4];
        }
    }
    console.log('Base terrain generation complete.');
}

function getMatchingPattern() {
    const randomIndex = Math.floor(Math.random() * patterns.length);
    return patterns[randomIndex];
}

function generateWaterAndRoads(map) {
    console.log('Generating water and roads...');
    generateLakesAndRivers(map);
    generateRoads(map);
    console.log('Water and road generation complete.');
}

function generateLakesAndRivers(map) {
    const start = [0, Math.floor(MAP_HEIGHT / 2)];
    const goal = [MAP_WIDTH - 1, Math.floor(MAP_HEIGHT / 2)];
    const riverPath = aStar(start, goal, map);

    if (riverPath) {
        for (const [x, y] of riverPath) {
            map[y][x] = 'water';
        }
    }
}

function generateRoads(map) {
    const start = [Math.floor(MAP_WIDTH / 4), 0];
    const goal = [Math.floor(MAP_WIDTH / 4), MAP_HEIGHT - 1];
    const roadPath = aStar(start, goal, map);

    if (roadPath) {
        for (const [x, y] of roadPath) {
            map[y][x] = 'road';
        }
    }
}

function drawMap(ctx, map) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
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
