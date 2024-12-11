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
    const ratings = trailheads.map(trailhead => calculateTrailheadRating(grid, trailhead));
    return ratings.reduce((sum, rating) => sum + rating, 0);
}

// most tame pt.2 so far
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

function calculateTrailheadRating(grid, trailhead) {
    let count = 0;

    function findPaths(row, col, height) {
        if (height === 9) {
            count++;
            return;
        }

        const neighbors = getNeighbors(grid, row, col);
        for (const neighbor of neighbors) {
            if (grid[neighbor.row][neighbor.col] === height + 1) {
                findPaths(neighbor.row, neighbor.col, height + 1);
            }
        }
    }

    findPaths(trailhead.row, trailhead.col, 0);
    return count;
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