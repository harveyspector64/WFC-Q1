import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from './utils/constants.js';

const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

canvas.width = MAP_WIDTH * TILE_SIZE;
canvas.height = MAP_HEIGHT * TILE_SIZE;

const terrainTypes = ['grass', 'dirt', 'trees', 'bushes', 'water'];
const terrainColors = {
    'grass': '#7CFC00',
    'dirt': '#8B4513',
    'trees': '#228B22',
    'bushes': '#32CD32',
    'water': '#4169E1'
};

function generateMap() {
    const map = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
        map[y] = [];
        for (let x = 0; x < MAP_WIDTH; x++) {
            map[y][x] = terrainTypes[Math.floor(Math.random() * (terrainTypes.length - 1))]; // Exclude water
        }
    }
    addRiver(map);
    addLakes(map);
    return map;
}

function addRiver(map) {
    let x = Math.floor(Math.random() * MAP_WIDTH);
    let y = 0;
    while (y < MAP_HEIGHT) {
        map[y][x] = 'water';
        if (Math.random() < 0.7) {
            y++;
        } else {
            x += Math.random() < 0.5 ? 1 : -1;
            x = Math.max(0, Math.min(x, MAP_WIDTH - 1));
        }
    }
}

function addLakes(map) {
    const lakeCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < lakeCount; i++) {
        const centerX = Math.floor(Math.random() * MAP_WIDTH);
        const centerY = Math.floor(Math.random() * MAP_HEIGHT);
        const radius = Math.floor(Math.random() * 3) + 2;

        for (let y = centerY - radius; y <= centerY + radius; y++) {
            for (let x = centerX - radius; x <= centerX + radius; x++) {
                if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
                    if (Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)) <= radius) {
                        map[y][x] = 'water';
                    }
                }
            }
        }
    }
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
