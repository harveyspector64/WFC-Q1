const tileTypes = ['grass', 'water', 'tree', 'bush', 'dirt', 'road'];
const tiles = {};

export function loadTiles() {
    const promises = tileTypes.map(type => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                tiles[type] = img;
                resolve();
            };
            img.onerror = reject;
            img.src = `assets/${type}.png`;
        });
    });

    return Promise.all(promises);
}

export function getTile(type) {
    return tiles[type];
}
