// aStar.js
export function aStar(start, goal, map) {
    // Basic A* algorithm
    const openSet = [];
    const closedSet = [];
    const startNode = {
        x: start[0],
        y: start[1],
        g: 0,
        h: heuristic(start, goal),
        f: 0,
        parent: null
    };
    startNode.f = startNode.g + startNode.h;
    openSet.push(startNode);

    while (openSet.length > 0) {
        // Sort by f value and take the lowest
        openSet.sort((a, b) => a.f - b.f);
        const currentNode = openSet.shift();
        closedSet.push(currentNode);

        // If goal is reached, reconstruct path
        if (currentNode.x === goal[0] && currentNode.y === goal[1]) {
            return reconstructPath(currentNode);
        }

        const neighbors = getNeighbors(currentNode, map);
        for (const neighbor of neighbors) {
            if (closedSet.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
                continue;
            }

            const tentativeG = currentNode.g + 1;
            let neighborNode = openSet.find(node => node.x === neighbor.x && node.y === neighbor.y);
            if (!neighborNode) {
                neighborNode = {
                    x: neighbor.x,
                    y: neighbor.y,
                    g: tentativeG,
                    h: heuristic([neighbor.x, neighbor.y], goal),
                    f: 0,
                    parent: currentNode
                };
                neighborNode.f = neighborNode.g + neighborNode.h;
                openSet.push(neighborNode);
            } else if (tentativeG < neighborNode.g) {
                neighborNode.g = tentativeG;
                neighborNode.f = neighborNode.g + neighborNode.h;
                neighborNode.parent = currentNode;
            }
        }
    }

    return null; // No path found
}

function heuristic(pos0, pos1) {
    // Manhattan distance heuristic
    return Math.abs(pos0[0] - pos1[0]) + Math.abs(pos0[1] - pos1[1]);
}

function getNeighbors(node, map) {
    const { x, y } = node;
    const neighbors = [];
    if (x > 0) neighbors.push({ x: x - 1, y: y });
    if (x < map[0].length - 1) neighbors.push({ x: x + 1, y: y });
    if (y > 0) neighbors.push({ x: x, y: y - 1 });
    if (y < map.length - 1) neighbors.push({ x: x, y: y + 1 });
    return neighbors;
}

function reconstructPath(node) {
    const path = [];
    while (node) {
        path.push([node.x, node.y]);
        node = node.parent;
    }
    return path.reverse();
}
