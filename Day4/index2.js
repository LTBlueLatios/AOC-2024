import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// They really had to make it this complicated
// mf its only day 4
async function thisIsRidiculous(input) {
    const gridLines = input.trim().split('\n');
    const gridSize = gridLines.length;
    let christmasCounter = 0;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (gridLines[row][col] !== 'A') continue;

            if (row < 1 || row > gridSize - 2 || col < 1 || col > gridSize - 2) continue;

            const isMAS1 = (
                gridLines[row - 1][col - 1] === 'M' &&
                gridLines[row + 1][col + 1] === 'S'
            );

            const isSAM1 = (
                gridLines[row - 1][col - 1] === 'S' &&
                gridLines[row + 1][col + 1] === 'M'
            );

            const isMAS2 = (
                gridLines[row - 1][col + 1] === 'M' &&
                gridLines[row + 1][col - 1] === 'S'
            );

            const isSAM2 = (
                gridLines[row - 1][col + 1] === 'S' &&
                gridLines[row + 1][col - 1] === 'M'
            );

            if ((isMAS1 || isSAM1) && (isMAS2 || isSAM2)) {
                christmasCounter++;
            }
        }
    }
    return christmasCounter;
}

async function readInput() {
    try {
        const inputPath = path.join(__dirname, 'input.txt');
        const input = await fs.promises.readFile(inputPath, 'utf-8');
        const result = await thisIsRidiculous(input);
        console.log(result);
    } catch (error) {
        console.error('Error reading input file:', error);
    }
}

await readInput();