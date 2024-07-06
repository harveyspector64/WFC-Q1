export function generateRoadNetwork(map, roadCount) {
    for (let i = 0; i < roadCount; i++) {
        const start = [Math.floor(Math.random() * MAP_WIDTH), Math.floor(Math.random() * MAP_HEIGHT)];
        const end = [Math.floor(Math.random() * MAP_WIDTH), Math.floor(Math.random() * MAP_HEIGHT)];
        const path = aStar(start, end, map);
        for (const [x, y] of path) {
            map[y][x] = 'road';
        }
    }
}

function heuristic(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function getNeighbors([x, y], map) {
    const neighbors = [];
    if (x > 0) neighbors.push([x - 1, y]);
    if (x < MAP_WIDTH - 1) neighbors.push([x + 1, y]);
    if (y > 0) neighbors.push([x, y - 1]);
    if (y < MAP_HEIGHT - 1) neighbors.push([x, y + 1]);
    return neighbors;
}

export function aStar(start, goal, map) {
    const openSet = [start];
    const cameFrom = {};
    const gScore = {};
    const fScore = {};

    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            gScore[`${x},${y}`] = Infinity;
            fScore[`${x},${y}`] = Infinity;
        }
    }
    gScore[`${start[0]},${start[1]}`] = 0;
    fScore[`${start[0]},${start[1]}`] = heuristic(start, goal);

    while (openSet.length > 0) {
        let current = openSet.reduce((lowest, node) =>
            fScore[`${node[0]},${node[1]}`] < fScore[`${lowest[0]},${lowest[1]}`] ? node : lowest, openSet[0]);

        if (current[0] === goal[0] && current[1] === goal[1]) {
            const path = [];
            while (current) {
                path.push(current);
                current = cameFrom[`${current[0]},${current[1]}`];
            }
            return path.reverse();
        }

        openSet = openSet.filter(node => node[0] !== current[0] || node[1] !== current[1]);
        for (const neighbor of getNeighbors(current, map)) {
            const tentativeGScore = gScore[`${current[0]},${current[1]}`] + 1;
            if (tentativeGScore < gScore[`${neighbor[0]},${neighbor[1]}`]) {
                cameFrom[`${neighbor[0]},${neighbor[1]}`] = current;
                gScore[`${neighbor[0]},${neighbor[1]}`] = tentativeGScore;
                fScore[`${neighbor[0]},${neighbor[1]}`] = tentativeGScore + heuristic(neighbor, goal);
                if (!openSet.some(node => node[0] === neighbor[0] && node[1] === neighbor[1])) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    return [];
}

export function createCurvedPath(start, goal, map) {
    const path = [];
    let [x, y] = start;

    while (x !== goal[0] || y !== goal[1]) {
        path.push([x, y]);
        if (Math.random() > 0.8) {
            x += Math.sign(goal[0] - x);
        } else {
            y += Math.sign(goal[1] - y);
        }
    }

    path.push(goal);
    return path;
}
