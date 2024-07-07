import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from './utils/constants.js';

const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

canvas.width = MAP_WIDTH * TILE_SIZE;
canvas.height = MAP_HEIGHT * TILE_SIZE;

const terrainTypes = ['grass', 'dirt', 'trees', 'bushes'];
const terrainColors = {
    'grass': '#7CFC00',
    'dirt': '#8B4513',
    'trees': '#228B22',
    'bushes': '#32CD32'
};

function generateMap() {
    const map = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
        map[y] = [];
        for (let x = 0; x < MAP_WIDTH; x++) {
            map[y][x] = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
        }
    }
    return map;
}

function drawMap(map) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const terrainType = map[y][x];
            ctx.fillStyle = terrainColors[terrainType];
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}

const map = generateMap();
drawMap(map);
