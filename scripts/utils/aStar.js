// aStar.js
export function aStar(start, goal, map) {
    const openSet = [start];
    const cameFrom = {};
    const gScore = {};
    const fScore = {};

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            gScore[`${x},${y}`] = Infinity;
            fScore[`${x},${y}`] = Infinity;
        }
    }

    gScore[`${start[0]},${start[1]}`] = 0;
    fScore[`${start[0]},${start[1]}`] = heuristicCostEstimate(start, goal);

    while (openSet.length > 0) {
        const current = openSet.reduce((a, b) => (fScore[`${a[0]},${a[1]}`] < fScore[`${b[0]},${b[1]}`] ? a : b));
        if (current[0] === goal[0] && current[1] === goal[1]) {
            return reconstructPath(cameFrom, current);
        }

        openSet.splice(openSet.indexOf(current), 1);
        for (const neighbor of getNeighbors(current, map)) {
            const tentativeGScore = gScore[`${current[0]},${current[1]}`] + 1;
            if (tentativeGScore < gScore[`${neighbor[0]},${neighbor[1]}`]) {
                cameFrom[`${neighbor[0]},${neighbor[1]}`] = current;
                gScore[`${neighbor[0]},${neighbor[1]}`] = tentativeGScore;
                fScore[`${neighbor[0]},${neighbor[1]}`] = gScore[`${neighbor[0]},${neighbor[1]}`] + heuristicCostEstimate(neighbor, goal);
                if (!openSet.some(node => node[0] === neighbor[0] && node[1] === neighbor[1])) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    return [];
}

function heuristicCostEstimate(start, goal) {
    return Math.abs(start[0] - goal[0]) + Math.abs(start[1] - goal[1]);
}

function getNeighbors(node, map) {
    const [x, y] = node;
    const neighbors = [];
    if (x > 0) neighbors.push([x - 1, y]);
    if (x < map[0].length - 1) neighbors.push([x + 1, y]);
    if (y > 0) neighbors.push([x, y - 1]);
    if (y < map.length - 1) neighbors.push([x, y + 1]);
    return neighbors;
}

function reconstructPath(cameFrom, current) {
    const path = [current];
    while (cameFrom[`${current[0]},${current[1]}`]) {
        current = cameFrom[`${current[0]},${current[1]}`];
        path.unshift(current);
    }
    return path;
}

export function createCurvedPath(start, goal, map) {
    const path = [];
    let [x, y] = start;

    while (x !== goal[0] || y !== goal[1]) {
        path.push([x, y]);
        if (Math.random() > 0.5) {
            x += Math.sign(goal[0] - x);
        } else {
            y += Math.sign(goal[1] - y);
        }
    }
    
    path.push(goal);
    return path;
}
