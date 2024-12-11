import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isPositionOutOfBounds(position, mapSize) {
    return (
        position.x < 0 ||
        position.x >= mapSize ||
        position.y < 0 ||
        position.y >= mapSize
    );
}

function doesPositionContainObstacle(position, obstaclePositions) {
    return (
        obstaclePositions.has(position.x) &&
        obstaclePositions.get(position.x).includes(position.y)
    );
}

function getNextPosition(guardPosition) {
    if (guardPosition.direction === '^')
        return { x: guardPosition.x, y: guardPosition.y - 1 };
    if (guardPosition.direction === '>')
        return { x: guardPosition.x + 1, y: guardPosition.y };
    if (guardPosition.direction === 'v')
        return { x: guardPosition.x, y: guardPosition.y + 1 };
    if (guardPosition.direction === '<')
        return { x: guardPosition.x - 1, y: guardPosition.y };
}

function turnGuardRight(guardPosition) {
    if (guardPosition.direction === '^') guardPosition.direction = '>';
    else if (guardPosition.direction === '>') guardPosition.direction = 'v';
    else if (guardPosition.direction === 'v') guardPosition.direction = '<';
    else if (guardPosition.direction === '<') guardPosition.direction = '^';
}

function recordVisitedPosition(visitedPositions, guardPosition) {
    const positionKey = `${guardPosition.x},${guardPosition.y}`;
    visitedPositions.add(positionKey);
}

function moveGuard(guardPosition, mapSize, obstaclePositions, visitedPositions) {
    const maxMoves = mapSize * mapSize * 4

    for (let moveCount = 0; moveCount < maxMoves; moveCount++) {
        recordVisitedPosition(visitedPositions, guardPosition);

        const nextPosition = getNextPosition(guardPosition);

        if (isPositionOutOfBounds(nextPosition, mapSize)) {
            break;
        }

        if (doesPositionContainObstacle(nextPosition, obstaclePositions)) {
            turnGuardRight(guardPosition);
        } else {
            guardPosition.x = nextPosition.x;
            guardPosition.y = nextPosition.y;
        }
    }
}

async function processInput(input) {
    let mapSize = 0;
    let guardPosition;
    const obstaclePositions = new Map();
    const visitedPositions = new Set();

    for (const line of input.split('\n')) {
        if (line.trim() === '') continue;
        const currentLine = line.toString();

        for (let columnIndex = 0; columnIndex < currentLine.length; columnIndex++) {
            const position = { x: columnIndex, y: mapSize };

            if (currentLine[columnIndex] === '^') {
                guardPosition = { ...position, direction: '^' };
            }

            if (currentLine[columnIndex] === '#') {
                if (obstaclePositions.has(position.x)) {
                    obstaclePositions.get(position.x).push(position.y);
                } else {
                    obstaclePositions.set(position.x, [position.y]);
                }
            }
        }

        mapSize++;
    }

    moveGuard(guardPosition, mapSize, obstaclePositions, visitedPositions);

    return visitedPositions.size;
}

async function readInput() {
    try {
        const inputPath = path.join(__dirname, 'input.txt');
        const input = await fs.promises.readFile(inputPath, 'utf-8');
        const result = processInput(input);
        console.log(result);
    } catch (error) {
        console.error('Error reading input file:', error);
    }
}

readInput();