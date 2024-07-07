// main.js
import { generateMap } from './mapGenerator.js';
import { loadTiles } from './tileLoader.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

loadTiles()
    .then(() => {
        console.log('All tiles loaded');
        generateMap(ctx);
    })
    .catch(error => {
        console.error('Failed to load tiles:', error);
    });
