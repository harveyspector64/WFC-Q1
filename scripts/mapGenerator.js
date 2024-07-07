// mapGenerator.js
import { getTile } from './tileLoader.js';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from './utils/constants.js';
import { aStar, createCurvedPath, generateRoadNetwork } from './utils/aStar.js';

// Define more detailed patterns for different terrains
const terrainPatterns = {
    grass: ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
    tree: ['tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree'],
    bush: ['bush', 'bush', 'bush', 'bush', 'bush', 'bush', 'bush', 'bush', 'bush'],
    dirt: ['dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt'],
    hills: ['hill', 'hill', 'hill', 'hill', 'hill', 'hill', 'hill', 'hill', 'hill'],
};

export function generateMap(ctx) {
    console.log('Generating map...');
    const map = initializeMap();
    generateBaseTerrain(map);
    generateWaterAndLakes(map);
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
            map[y][x] = null;
        }
    }
    return map;
}

function generateBaseTerrain(map) {
    console.log('Generating base terrain...');
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const pattern = terrainPatterns.grass;
            const tileType = pattern[Math.floor(Math.random() * pattern.length)];
            map[y][x] = tileType;
        }
    }

    const terrainAreas = [
        { type: 'tree', x: 2, y: 2, width: 10, height: 10 },
        { type: 'bush', x: 20, y: 5, width: 15, height: 15 },
        { type: 'dirt', x: 40, y: 10, width: 20, height: 20 },
        { type: 'hill', x: 60, y: 15, width: 10, height: 10 },
    ];

    terrainAreas.forEach(area => {
        for (let y = area.y; y < area.y + area.height; y++) {
            for (let x = area.x; x < area.x + area.width; x++) {
                if (y < MAP_HEIGHT && x < MAP_WIDTH) {
                    const pattern = terrainPatterns[area.type];
                    const tileType = pattern[Math.floor(Math.random() * pattern.length)];
                    map[y][x] = tileType;
                }
            }
        }
    });

    console.log('Base terrain generation complete.');
}

function generateWaterAndLakes(map) {
    console.log('Generating rivers and lakes...');
    const startX = Math.floor(Math.random() * MAP_WIDTH);
    const startY = 0;
    const endX = Math.floor(Math.random() * MAP_WIDTH);
    const endY = MAP_HEIGHT - 1;
    const riverPath = createCurvedPath([startX, startY], [endX, endY], map);

    riverPath.forEach(([x, y]) => {
        if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
            map[y][x] = 'water';
            if (Math.random() < 0.1) {
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (y + i < MAP_HEIGHT && x + j < MAP_WIDTH && Math.random() < 0.5) {
                            map[y + i][x + j] = 'water';
                        }
                    }
                }
            }
        }
    });

    for (let i = 0; i < 3; i++) {
        const lakeX = Math.floor(Math.random() * MAP_WIDTH);
        const lakeY = Math.floor(Math.random() * MAP_HEIGHT);
        for (let y = lakeY - 1; y <= lakeY + 1; y++) {
            for (let x = lakeX - 1; x <= lakeX + 1; x++) {
                if (y >= 0 && y < MAP_HEIGHT && x >= 0 && x < MAP_WIDTH) {
                    map[y][x] = 'water';
                }
            }
        }
    }

    console.log('River and lake generation complete.');
}

function generateRoads(map) {
    console.log('Generating roads...');
    const roads = generateRoadNetwork(map, 10);
    for (const road of roads) {
        for (const [x, y] of road) {
            if (map[y][x] !== 'water') {
                map[y][x] = 'road';
            }
        }
    }
    console.log('Road generation complete.');
}

function placeStructures(map) {
    console.log('Placing structures...');
    const structures = [
        { type: 'barn', x: 10, y: 10 },
        { type: 'silo', x: 15, y: 15 },
    ];

    structures.forEach(structure => {
        if (structure.y < MAP_HEIGHT && structure.x < MAP_WIDTH) {
            map[structure.y][structure.x] = structure.type;
        }
    });
    console.log('Structure placement complete.');
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
    console.log('Drawing map...');
}
