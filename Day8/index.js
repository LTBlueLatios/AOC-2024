import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isWithinGrid(x, y, gridDimension) {
    return x >= 0 && y >= 0 && x < gridDimension && y < gridDimension;
}

function isValidInterferencePoint(
    x,
    y,
    exclusionX,
    exclusionY,
    gridDimension,
    potentialInterferencePoints
) {
    if (x === exclusionX || y === exclusionY) return false;
    if (!isWithinGrid(x, y, gridDimension)) return false;
    if (
        potentialInterferencePoints.some((point) => point.x === x && point.y === y)
    )
        return false;
    return true;
}

function processInput(input) {
    const deviceLocations = {};
    const potentialInterferencePoints = [];
    let gridDimension = 0;

    const lines = input.trim().split('\n');
    for (const line of lines) {
        for (let x = 0; x < line.length; x++) {
            if (line[x] === '.') continue;
            deviceLocations[line[x]] = deviceLocations[line[x]] || [];
            deviceLocations[line[x]].push({ x, y: gridDimension });
        }
        gridDimension++;
    }

    for (const deviceType of Object.keys(deviceLocations)) {
        for (const device1 of deviceLocations[deviceType]) {
            for (const device2 of deviceLocations[deviceType]) {
                const { x: x1, y: y1 } = device1;
                const { x: x2, y: y2 } = device2;

                if (x1 === x2 && y1 === y2) continue;

                const deltaX = x2 - x1;
                const deltaY = y2 - y1;

                let potentialX = x1 - deltaX;
                let potentialY = y1 - deltaY;
                if (
                    isValidInterferencePoint(
                        potentialX,
                        potentialY,
                        x2,
                        y2,
                        gridDimension,
                        potentialInterferencePoints
                    )
                ) {
                    potentialInterferencePoints.push({
                        x: potentialX,
                        y: potentialY,
                    });
                }

                potentialX = x2 + deltaX;
                potentialY = y2 + deltaY;
                if (
                    isValidInterferencePoint(
                        potentialX,
                        potentialY,
                        x1,
                        y1,
                        gridDimension,
                        potentialInterferencePoints
                    )
                ) {
                    potentialInterferencePoints.push({
                        x: potentialX,
                        y: potentialY,
                    });
                }
            }
        }
    }

    return potentialInterferencePoints.length;
}

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

readInput();