// main.js
import { loadTiles } from './tileLoader.js';
import { generateMap } from './mapGenerator.js';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from './utils/constants.js';

const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

// Adjust canvas size
canvas.width = MAP_WIDTH * TILE_SIZE;
canvas.height = MAP_HEIGHT * TILE_SIZE;

// Load tiles and generate the map
loadTiles().then(() => {
    console.log('All tiles loaded');
    generateMap(ctx);
}).catch(err => {
    console.error('Failed to load tiles:', err);
});
