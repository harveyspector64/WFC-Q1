// mapGenerator.js
import { getTile } from './tileLoader.js';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from './utils/constants.js';

const patterns = [
    // Existing patterns
    ['grass', 'grass', 'grass', 'tree', 'grass', 'tree', 'grass', 'grass', 'grass'],
    ['water', 'water', 'water', 'grass', 'water', 'grass', 'water', 'water', 'water'],
    ['bush', 'bush', 'bush', 'dirt', 'bush', 'dirt', 'bush', 'bush', 'bush'],
    ['grass', 'grass', 'grass', 'grass', 'dirt', 'grass', 'grass', 'grass', 'grass'],
    ['grass', 'grass', 'grass', 'road', 'road', 'road', 'grass', 'grass', 'grass'],
    // New lake pattern (simplified)
    ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water'],
    // New river pattern (simplified)
    ['water', 'grass', 'grass', 'water', 'grass', 'grass', 'water', 'grass', 'grass']
];

export function generateWFCTile(ctx) {
    console.log('Generating map with WFC...');
    const map = initializeMap();
    generateLakesAndRivers(map);
    generateTerrain(map, ctx);
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
    const randomIndex = Math.floor(Math.random() * patterns.length);
    return patterns[randomIndex];
}

function generateLakesAndRivers(map) {
    // Simplified logic for generating a lake in the middle of the map
    const lakeStartX = Math.floor(MAP_WIDTH / 4);
    const lakeStartY = Math.floor(MAP_HEIGHT / 4);
    const lakeEndX = lakeStartX + 5; // Arbitrary lake size
    const lakeEndY = lakeStartY + 5;

    for (let y = lakeStartY; y < lakeEndY; y++) {
        for (let x = lakeStartX; x < lakeEndX; x++) {
            map[y][x] = 'water';
        }
    }

    // Simplified logic for generating a vertical river
    const riverX = Math.floor(MAP_WIDTH / 2);
    for (let y = 0; y < MAP_HEIGHT; y++) {
        map[y][riverX] = 'water';
    }
}

function generateTerrain(map, ctx) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            if (!map[y][x]) {
                const pattern = getMatchingPattern(map, x, y);
                const tileType = pattern ? pattern[4] : 'grass';
                map[y][x] = tileType;
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
