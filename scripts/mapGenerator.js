// mapGenerator.js
import { getTile } from './tileLoader.js';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from './utils/constants.js';
import { aStar, createCurvedPath } from './utils/aStar.js';

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
    placeStructures(map);
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
    console.log('Generating rivers and lakes...');
    const riverPaths = [];
    const riverCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < riverCount; i++) {
        const startY = Math.floor(Math.random() * MAP_HEIGHT);
        const endY = Math.floor(Math.random() * MAP_HEIGHT);
        const start = [0, startY];
        const goal = [MAP_WIDTH - 1, endY];
        const riverPath = createCurvedPath(start, goal, map);

        if (riverPath) {
            riverPaths.push(riverPath);
            for (const [x, y] of riverPath) {
                if (map[y][x] !== 'road' && map[y][x] !== 'dirt') {
                    map[y][x] = 'water';
                }
            }
        }
    }

    const lakeCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < lakeCount; i++) {
        const lakeX = Math.floor(Math.random() * MAP_WIDTH);
        const lakeY = Math.floor(Math.random() * MAP_HEIGHT);
        const lakeWidth = Math.floor(Math.random() * 5) + 3;
        const lakeHeight = Math.floor(Math.random() * 5) + 3;
        createLake(map, lakeX, lakeY, lakeWidth, lakeHeight);
    }
}

function createLake(map, startX, startY, width, height) {
    for (let y = startY; y < startY + height; y++) {
        for (let x = startX; x < startX + width; x++) {
            if (y < MAP_HEIGHT && x < MAP_WIDTH) {
                map[y][x] = 'water';
            }
        }
    }
}

function generateRoads(map) {
    console.log('Generating roads...');
    const roadPaths = [];
    const roadCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < roadCount; i++) {
        const startX = Math.floor(Math.random() * MAP_WIDTH);
        const startY = 0;
        const goalY = MAP_HEIGHT - 1;
        const roadPath = aStar([startX, startY], [startX, goalY], map);

        if (roadPath) {
            roadPaths.push(roadPath);
            for (const [x, y] of roadPath) {
                if (map[y][x] !== 'water' && map[y][x] !== 'dirt') {
                    map[y][x] = 'road';
                }
            }
        }
    }

    createIntersections(map, roadPaths);
}

function createIntersections(map, roadPaths) {
    for (let i = 0; i < roadPaths.length; i++) {
        for (let j = i + 1; j < roadPaths.length; j++) {
            for (const [x, y] of roadPaths[i]) {
                if (roadPaths[j].some(([rx, ry]) => rx === x && ry === y)) {
                    map[y][x] = 'road';
                }
            }
        }
    }
}

function placeStructures(map) {
    console.log('Placing structures...');
    placeBarn(map);
    placeSilo(map);
}

function placeBarn(map) {
    const barnX = Math.floor(Math.random() * MAP_WIDTH);
    const barnY = Math.floor(Math.random() * MAP_HEIGHT);

    if (map[barnY][barnX] === 'grass') {
        map[barnY][barnX] = 'barn';
    }
}

function placeSilo(map) {
    const siloX = Math.floor(Math.random() * MAP_WIDTH);
    const siloY = Math.floor(Math.random() * MAP_HEIGHT);

    if (map[siloY][siloX] === 'grass') {
        map[siloY][siloX] = 'silo';
    }
}

function drawMap(ctx, map) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const tileType = map[y][x] || 'grass';
            const tile = getTile(tileType);
            if (tile) {
                ctx.drawImage(tile, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}
