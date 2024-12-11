import { promises as fs } from "fs";
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
    const lines = input.trim().split("\n");
    let sum = 0;

    for (const line of lines) {
        const [targetStr, numbersStr] = line.split(": ");
        const target = parseInt(targetStr);
        const numbers = numbersStr.split(" ").map(Number);

        if (canReachTarget(target, numbers)) {
            sum += target;
        }
    }

    return sum;
}

function canReachTarget(target, numbers) {
    const operators = ["+", "*", "||"];
    return generateCombinations(0, 0, "", target, numbers, operators);
}

// I wasn't made for this
// help me
function generateCombinations(
    index,
    currentResult,
    expression,
    target,
    numbers,
    operators
) {
    if (index === numbers.length) {
        return currentResult === target;
    }

    if (index === 0) {
        return generateCombinations(
            index + 1,
            numbers[index],
            numbers[index].toString(),
            target,
            numbers,
            operators
        );
    }

    for (const op of operators) {
        let newResult;
        if (op === "+") {
            newResult = currentResult + numbers[index];
        } else if (op === "*") {
            newResult = currentResult * numbers[index];
        } else {
            newResult = parseInt(
                currentResult.toString() + numbers[index].toString()
            );
        }

        if (
            generateCombinations(
                index + 1,
                newResult,
                expression + " " + op + " " + numbers[index],
                target,
                numbers,
                operators
            )
        ) {
            return true;
        }
    }
    return false;
}

readInput();