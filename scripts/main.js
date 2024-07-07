import { loadTiles } from './tileLoader.js';
import { generateMap } from './mapGenerator.js';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from './utils/constants.js';

const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

canvas.width = MAP_WIDTH * TILE_SIZE;
canvas.height = MAP_HEIGHT * TILE_SIZE;

loadTiles().then(() => {
    const map = generateMap();
    drawMap(ctx, map);
});

function drawMap(ctx, map) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const tile = map[y][x];
            ctx.drawImage(tile, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}
