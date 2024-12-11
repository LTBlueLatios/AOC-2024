import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let gridMapSize = 0;
let initialGuardPosition;
const obstaclePositions = {};
let validObstacleCount = 0;

function isPositionOutOfBounds(position) {
    return (
        position.x < 0 ||
        position.x >= gridMapSize ||
        position.y < 0 ||
        position.y >= gridMapSize
    );
}

function doesPositionContainObstacle(position, obstacles) {
    return obstacles[position.x] && obstacles[position.x].includes(position.y);
}

function getNextPosition(guard) {
    if (guard.direction === '^') return { ...guard, y: guard.y - 1 };
    if (guard.direction === '>') return { ...guard, x: guard.x + 1 };
    if (guard.direction === 'v') return { ...guard, y: guard.y + 1 };
    if (guard.direction === '<') return { ...guard, x: guard.x - 1 };
}

function hasLoopDetected(guard) {
    return guard.path.length > 2 * Math.pow(gridMapSize, 2);
}

function turnGuard(guard) {
    if (guard.direction === '^') guard.direction = '>';
    else if (guard.direction === '>') guard.direction = 'v';
    else if (guard.direction === 'v') guard.direction = '<';
    else if (guard.direction === '<') guard.direction = '^';
}

function recordPath(guard) {
    guard.path.push({ x: guard.x, y: guard.y });
}

function moveGuard(guard, obstacles) {
    recordPath(guard);
    const next = getNextPosition(guard);

    if (isPositionOutOfBounds(next)) return false;
    if (hasLoopDetected(guard)) throw new Error('Loop detected!');

    if (doesPositionContainObstacle(next, obstacles)) {
        turnGuard(guard);
    } else {
        guard.x = next.x;
        guard.y = next.y;
    }
    return true;
}

function canPlaceObstacle(position, obstacles, initialGuardPosition) {
    if (
        position.x === initialGuardPosition.x &&
        position.y === initialGuardPosition.y
    ) return false;

    if (doesPositionContainObstacle(position, obstacles)) return false;

    if (obstacles[position.x]) {
        obstacles[position.x].push(position.y);
    } else {
        obstacles[position.x] = [position.y];
    }

    return true;
}

function deepCopyGuard(guard) {
    return {
        ...guard,
        path: [...guard.path],
    };
}

function deepCopyObstacles(obstacles) {
    const copy = {};
    for (const key in obstacles) {
        copy[key] = [...obstacles[key]];
    }
    return copy;
}

// shit is so slow
// and I couldn't giv a fuck
// I optimise systems not math equations
// apparently to optimise it I have to use matrix math (idk)
async function readInput() {
    try {
        const inputPath = path.join(__dirname, 'input.txt');
        const input = await fs.promises.readFile(inputPath, 'utf-8');

        for (const line of input.split('\n')) {
            if (line.trim() === '') continue;
            const currentLine = line.toString();

            for (let columnIndex = 0; columnIndex < currentLine.length; columnIndex++) {
                const position = { x: columnIndex, y: gridMapSize };

                if (currentLine[columnIndex] === '^') {
                    initialGuardPosition = { ...position, direction: '^', path: [] };
                }

                if (currentLine[columnIndex] === '#') {
                    if (obstaclePositions[position.x])
                        obstaclePositions[position.x].push(position.y);
                    else obstaclePositions[position.x] = [position.y];
                }
            }

            gridMapSize++;
        }

        for (let x = 0; x < gridMapSize; x++) {
            for (let y = 0; y < gridMapSize; y++) {
                const currentGuardPosition = deepCopyGuard(initialGuardPosition);
                const currentObstaclePositions = deepCopyObstacles(obstaclePositions);
                const newObstaclePosition = { x, y };

                if (canPlaceObstacle(newObstaclePosition, currentObstaclePositions, initialGuardPosition)) {
                    try {
                        let maxMoves = gridMapSize * gridMapSize * 4;
                        for (let moveCount = 0; moveCount < maxMoves; moveCount++) {
                            if (!moveGuard(currentGuardPosition, currentObstaclePositions)) {
                                break;
                            }
                        }
                    } catch (error) {
                        if (error.message === 'Loop detected!') {
                            validObstacleCount++;
                        }
                    }
                }
            }
        }

        console.log(
            'Obstacle position possibilities:',
            validObstacleCount,
        );
    } catch (error) {
        console.error('Error reading input file:', error);
    }
}

readInput();