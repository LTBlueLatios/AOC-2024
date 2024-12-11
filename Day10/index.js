import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readInput() {
    try {
        const inputPath = path.join(__dirname, "input.txt");
        const input = await fs.promises.readFile(inputPath, "utf-8");
        const result = processInput(input);
        console.log(result);
    } catch (error) {
        console.error("Error reading input file:", error);
    }
}

function processInput(input) {
    const grid = input.trim().split("\n").map(row => row.split("").map(Number));
    const trailheads = findTrailheads(grid);
    const scores = trailheads.map(trailhead => calculateTrailheadScore(grid, trailhead));
    return scores.reduce((sum, score) => sum + score, 0);
}

// 🍞1️⃣🔍
function findTrailheads(grid) {
    const trailheads = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === 0) {
                trailheads.push({ row: i, col: j });
            }
        }
    }
    return trailheads;
}

function calculateTrailheadScore(grid, trailhead) {
    const reachableNines = new Set();
    const queue = [{ row: trailhead.row, col: trailhead.col, height: 0 }];
    const visited = new Set();

    while (queue.length > 0) {
        const current = queue.shift();
        const key = `${current.row},${current.col}`;

        if (visited.has(key)) continue;
        visited.add(key);

        if (current.height === 9) {
            reachableNines.add(key);
        }

        const neighbors = getNeighbors(grid, current.row, current.col);
        for (const neighbor of neighbors) {
            if (grid[neighbor.row][neighbor.col] === current.height + 1) {
                queue.push({ row: neighbor.row, col: neighbor.col, height: current.height + 1 });
            }
        }
    }
    return reachableNines.size;
}

function getNeighbors(grid, row, col) {
    const neighbors = [];
    const directions = [{ row: -1, col: 0 }, { row: 1, col: 0 }, { row: 0, col: -1 }, { row: 0, col: 1 }];
    for (const dir of directions) {
        const newRow = row + dir.row;
        const newCol = col + dir.col;
        if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
            neighbors.push({ row: newRow, col: newCol });
        }
    }
    return neighbors;
}

readInput();