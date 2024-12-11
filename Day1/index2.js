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
    const lines = input.trim().split("\n");
    const leftList = [];
    const rightList = [];
    for (const line of lines) {
        const [left, right] = line.split(/\s+/).map(Number);
        leftList.push(left);
        rightList.push(right);
    }

    let similarityScore = 0;
    for (const leftNum of leftList) {
        let count = 0;
        for (const rightNum of rightList) {
            if (leftNum === rightNum) {
                count++;
            }
        }
        similarityScore += leftNum * count;
    }
    return similarityScore;

}

readInput();