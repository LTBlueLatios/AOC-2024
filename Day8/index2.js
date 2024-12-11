import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isWithinGrid(x, y, gridDimension) {
    return x >= 0 && y >= 0 && x < gridDimension && y < gridDimension;
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
        const devices = deviceLocations[deviceType];
        if (devices.length < 2) continue;

        // I was stuck on this
        // I then thought of daddy trollers
        // That didn't help
        for (let i = 0; i < devices.length; i++) {
            for (let j = i + 1; j < devices.length; j++) {
                const { x: x1, y: y1 } = devices[i];
                const { x: x2, y: y2 } = devices[j];

                const deltaX = x2 - x1;
                const deltaY = y2 - y1;

                if (deltaX === 0) {
                    for (let y = 0; y < gridDimension; y++) {
                        if (y !== y1 && y !== y2) {
                            if (isWithinGrid(x1, y, gridDimension)) {
                                potentialInterferencePoints.push({ x: x1, y });
                            }
                        }
                    }
                } else if (deltaY === 0) {
                    for (let x = 0; x < gridDimension; x++) {
                        if (x !== x1 && x !== x2) {
                            if (isWithinGrid(x, y1, gridDimension)) {
                                potentialInterferencePoints.push({ x, y: y1 });
                            }
                        }
                    }
                } else {
                    const slope = deltaY / deltaX;
                    for (let x = 0; x < gridDimension; x++) {
                        const y = y1 + slope * (x - x1);
                        if (Number.isInteger(y)) {
                            if (
                                isWithinGrid(x, y, gridDimension) &&
                                !(x === x1 && y === y1) &&
                                !(x === x2 && y === y2)
                            ) {
                                potentialInterferencePoints.push({ x, y });
                            }
                        }
                    }
                }
            }
        }
        for (const device of devices) {
            potentialInterferencePoints.push(device)
        }
    }

    const uniqueInterferencePoints = [];
    for (const point of potentialInterferencePoints) {
        if (
            !uniqueInterferencePoints.some(
                (existingPoint) => existingPoint.x === point.x && existingPoint.y === point.y
            )
        ) {
            uniqueInterferencePoints.push(point);
        }
    }

    return uniqueInterferencePoints.length;
}

async function readInput() {
    try {
        const inputPath = path.join(__dirname, 'input.txt');
        const input = await fs.readFile(inputPath, 'utf-8');
        const result = processInput(input);
        console.log('Unique antinode locations', result);
    } catch (error) {
        console.error('Error reading input file:', error);
    }
}

readInput();