// tileLoader.js
export const TILE_SIZE = 32;
export const TILE_NAMES = ['grass', 'water', 'tree', 'bush', 'dirt', 'road', 'hill'];
const tiles = {};

function loadTile(name) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = `./assets/${name}.png`;
        img.onload = () => {
            tiles[name] = img;
            console.log(`${name} tile loaded.`);
            resolve();
        };
        img.onerror = () => {
            console.error(`Failed to load ${name} tile.`);
            reject(new Error(`Failed to load ${name} tile.`));
        };
    });
}

export function loadTiles() {
    return Promise.all(TILE_NAMES.map(loadTile)).then(() => {
        console.log('All tiles loaded successfully');
    }).catch((error) => {
        console.error('Error loading tiles:', error);
    });
}

export function getTile(name) {
    return tiles[name];
}
