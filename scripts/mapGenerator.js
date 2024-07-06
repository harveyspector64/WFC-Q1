// mapGenerator.js
import { getTile } from './tileLoader.js';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from './utils/constants.js';

const patterns = [
    ['grass', 'grass', 'grass', 'tree', 'grass', 'tree', 'grass', 'grass', 'grass'],
    ['water', 'water', 'water', 'grass', 'water', 'grass', 'water', 'water', 'water'],
    ['bush', 'bush', 'bush', 'dirt', 'bush', 'dirt', 'bush', 'bush', 'bush'],
    ['grass', 'grass', 'grass', 'grass', 'dirt', 'grass', 'grass', 'grass', 'grass'], // Added dirt pattern
    ['grass', 'grass', 'grass', 'road', 'road', 'road', 'grass', 'grass', 'grass']   // Added road pattern
];

export function generateWFCTile(ctx) {
    console.log('Generating map with WFC...');
    const map = initializeMap();
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const pattern = getMatchingPattern(map, x, y);
            const tileType = pattern ? pattern[4] : 'grass';
            map[y][x] = tileType;
            console.log(`Selected pattern for (${x}, ${y}):`, pattern);
            console.log(`Drawing ${tileType} at (${x}, ${y})`);
            drawTile(ctx, tileType, x, y);
        }
    }
    console.log('Map generation complete.');
}

function initializeMap() {
    const map = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
        map[y] = [];
        for (let x = 0; x < MAP_WIDTH; x++) {
            map[y][x] = null;
        }
    }
    return map;
}

function getMatchingPattern(map, x, y) {
    // For simplicity, just return a random pattern for now
    const randomIndex = Math.floor(Math.random() * patterns.length);
    console.log(`Randomly selected pattern index: ${randomIndex}`);
    return patterns[randomIndex];
}

function drawTile(ctx, tileType, x, y) {
    const tile = getTile(tileType);
    if (tile) {
        ctx.drawImage(tile, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    } else {
        console.error(`Tile ${tileType} not found.`);
    }
}
