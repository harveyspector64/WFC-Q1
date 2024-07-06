// mapGenerator.js

import { getTile } from './tileLoader.js';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from './utils/constants.js';
import { aStar, createCurvedPath } from './utils/aStar.js';

// Define more detailed patterns for different terrains
const terrainPatterns = {
    grass: ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
    trees: ['tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree'],
    bushes: ['bush', 'bush', 'bush', 'bush', 'bush', 'bush', 'bush', 'bush'],
    dirt: ['dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt'],
    hills: ['hill', 'hill', 'hill', 'hill', 'hill', 'hill', 'hill', 'hill'],
};

function generateMap(ctx) {
    console.log('Generating map...');
    const map = initializeMap();
    generateBaseTerrain(map);
    generateRiversAndLakes(map);
    generateRoads(map);
    placeStructures(map);
    drawMap(ctx, map);
    console.log('Map generation complete.');
}

function initializeMap() {
    const map = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
        const row = [];
        for (let x = 0; x < MAP_WIDTH; x++) {
            row.push('grass');  // Initialize with grass
        }
        map.push(row);
    }
    return map;
}

function generateBaseTerrain(map) {
    console.log('Generating base terrain...');
    // Use WFC or another method to generate terrain patterns
    // For simplicity, we'll fill in some areas with predefined patterns
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            if (Math.random() < 0.2) {
                map[y][x] = 'dirt';
            } else if (Math.random() < 0.2) {
                map[y][x] = 'tree';
            } else if (Math.random() < 0.1) {
                map[y][x] = 'bush';
            } else if (Math.random() < 0.05) {
                map[y][x] = 'hill';
            }
        }
    }
    console.log('Base terrain generation complete.');
}

function generateRiversAndLakes(map) {
    console.log('Generating rivers and lakes...');
    // Generate a river starting from a random point on one edge of the map
    const startY = Math.floor(Math.random() * MAP_HEIGHT);
    const endY = Math.floor(Math.random() * MAP_HEIGHT);
    const path = createCurvedPath([0, startY], [MAP_WIDTH - 1, endY], map);
    path.forEach(([x, y]) => {
        map[y][x] = 'water';
        if (Math.random() < 0.1) {
            // Create small lakes/ponds around the river
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (map[y + i] && map[y + i][x + j] === 'grass') {
                        map[y + i][x + j] = 'water';
                    }
                }
            }
        }
    });
    console.log('River and lake generation complete.');
}

function generateRoads(map) {
    console.log('Generating roads...');
    // Create roads with intersections and varied paths
    for (let i = 0; i < 3; i++) {
        const startY = Math.floor(Math.random() * MAP_HEIGHT);
        const endY = Math.floor(Math.random() * MAP_HEIGHT);
        const path = createCurvedPath([0, startY], [MAP_WIDTH - 1, endY], map, 'road');
        path.forEach(([x, y]) => {
            if (map[y][x] !== 'water' && map[y][x] !== 'dirt') {
                map[y][x] = 'road';
            }
        });
    }
    console.log('Road generation complete.');
}

function placeStructures(map) {
    console.log('Placing structures...');
    // Place barns, silos, and other farm structures
    for (let i = 0; i < 5; i++) {
        const x = Math.floor(Math.random() * MAP_WIDTH);
        const y = Math.floor(Math.random() * MAP_HEIGHT);
        if (map[y][x] === 'dirt') {
            map[y][x] = 'barn';
        }
    }
    console.log('Structure placement complete.');
}

function drawMap(ctx, map) {
    console.log('Drawing map...');
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const tile = getTile(map[y][x]);
            if (tile) {
                ctx.drawImage(tile, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else {
                console.error(`Tile ${map[y][x]} not found.`);
            }
        }
    }
}

export { generateMap };
