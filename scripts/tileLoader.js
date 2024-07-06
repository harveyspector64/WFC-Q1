// tileLoader.js
const tileImages = {
    grass: 'assets/grass.png',
    water: 'assets/water.png',
    tree: 'assets/tree.png',
    bush: 'assets/bush.png',
    dirt: 'assets/dirt.png',
    road: 'assets/road.png',
    hill: 'assets/hill.png',
    barn: 'assets/barn.png',
    silo: 'assets/silo.png'
};

const tiles = {};

export function loadTiles() {
    const promises = Object.keys(tileImages).map(type => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = tileImages[type];
            img.onload = () => {
                tiles[type] = img;
                resolve();
            };
            img.onerror = () => {
                reject(new Error(`Failed to load ${type} tile.`));
            };
        });
    });

    return Promise.all(promises).then(() => {
        console.log('All tiles loaded successfully');
    });
}

export function getTile(type) {
    return tiles[type];
}
