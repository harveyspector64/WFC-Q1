// mapGenerator.js
import { getTile } from './tileLoader.js';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from './utils/constants.js';

export function generateRandomMap(ctx) {
    console.log('Generating random map...');
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const tileType = getRandomTileType();
            console.log(`Drawing ${tileType} at (${x}, ${y})`);
            drawTile(ctx, tileType, x, y);
        }
    }
}

function getRandomTileType() {
    const types = ['grass', 'water', 'tree', 'bush', 'dirt', 'road'];
    const randomIndex = Math.floor(Math.random() * types.length);
    return types[randomIndex];
}

function drawTile(ctx, tileType, x, y) {
    const tile = getTile(tileType);
    if (tile) {
        ctx.drawImage(tile, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    } else {
        console.error(`Tile ${tileType} not found.`);
    }
}
