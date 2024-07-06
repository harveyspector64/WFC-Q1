// tileLoader.js
const TILE_SIZE = 32;
const TILE_NAMES = ['grass', 'water', 'tree', 'bush', 'dirt', 'road'];
const tiles = {};

function loadTile(name) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = `../assets/${name}.png`;
        img.onload = () => {
            tiles[name] = img;
            resolve();
        };
        img.onerror = reject;
    });
}

export function loadTiles() {
    return Promise.all(TILE_NAMES.map(loadTile));
}

export function getTile(name) {
    return tiles[name];
}
