import { getTile } from './tileLoader.js';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from './utils/constants.js';
import { generateRoadNetwork } from './utils/aStar.js';

const terrainPatterns = {
    grass: ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
    trees: ['tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree'],
    bushes: ['bush', 'bush', 'bush', 'bush', 'bush', 'bush', 'bush', 'bush', 'bush'],
    water: ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water'],
    dirt: ['dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt'],
    hills: ['hill', 'hill', 'hill', 'hill', 'hill', 'hill', 'hill', 'hill', 'hill']
};

export function generateMap(ctx) {
    console.log('Generating map...');
    const map = initializeMap();
    generateBaseTerrain(map);
    generateRiversAndLakes(map);
    generateRoads(map);
    drawMap(ctx, map);
}

function initializeMap() {
    const map = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
        const row = [];
        for (let x = 0; x < MAP_WIDTH; x++) {
            row.push('grass');
        }
        map.push(row);
    }
    return map;
}

function generateBaseTerrain(map) {
    console.log('Generating base terrain...');
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const pattern = Math.random();
            if (pattern < 0.1) {
                map[y][x] = terrainPatterns.trees[Math.floor(Math.random() * terrainPatterns.trees.length)];
            } else if (pattern < 0.2) {
                map[y][x] = terrainPatterns.bushes[Math.floor(Math.random() * terrainPatterns.bushes.length)];
            } else if (pattern < 0.3) {
                map[y][x] = terrainPatterns.dirt[Math.floor(Math.random() * terrainPatterns.dirt.length)];
            } else if (pattern < 0.4) {
                map[y][x] = terrainPatterns.hills[Math.floor(Math.random() * terrainPatterns.hills.length)];
            } else {
                map[y][x] = terrainPatterns.grass[Math.floor(Math.random() * terrainPatterns.grass.length)];
            }
        }
    }
    console.log('Base terrain generation complete.');
}

function generateRiversAndLakes(map) {
    console.log('Generating rivers and lakes...');
    // Rivers and lakes generation logic here
    console.log('River and lake generation complete.');
}

function generateRoads(map) {
    console.log('Generating roads...');
    generateRoadNetwork(map, 5);  // Adjust the number of roads as needed
    console.log('Road generation complete.');
}

function drawMap(ctx, map) {
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
