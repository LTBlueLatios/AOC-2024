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
    const grid = input.trim().split("\n").map(row => row.trim());
    return countOccurrences(grid, "XMAS");
}

function countOccurrences(grid, word) {
    let count = 0;
    const rows = grid.length;
    const cols = grid[0].length;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            count += checkDirections(grid, word, i, j);
        }
    }

    return count;
}

function checkDirections(grid, word, row, col) {
    const directions = [
        [0, 1], [1, 0], [1, 1], [1, -1],
        [0, -1], [-1, 0], [-1, -1], [-1, 1]
    ];
    let count = 0;

    for (const [dr, dc] of directions) {
        count += checkWord(grid, word, row, col, dr, dc);
    }

    return count;
}

function checkWord(grid, word, row, col, dr, dc) {
    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;

    for (let i = 0; i < word.length; i++) {
        const newRow = row + i * dr;
        const newCol = col + i * dc;

        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols || grid[newRow][newCol] !== word[i]) {
            return 0;
        }
    }

    return 1;
}

readInput();