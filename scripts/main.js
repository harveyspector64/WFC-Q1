import { loadTiles } from './tileLoader.js';
import { generateMap } from './mapGenerator.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Failed to get canvas context');
        return;
    }

    loadTiles()
        .then(() => {
            console.log('All tiles loaded');
            generateMap(ctx);
        })
        .catch(error => {
            console.error('Failed to load tiles', error);
        });
});
