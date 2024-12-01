import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function calculateDistance(leftList, rightList) {
    // trollers gonna rant about big o efficiency or somethin
    // sorry man, I'm a software engineer, not a computer scientist
    // I'll take the easy route and use API's when I can
    leftList.sort((a, b) => a - b);
    rightList.sort((a, b) => a - b);

    let totalDistance = 0;

    for (let i = 0; i < leftList.length; i++) {
        totalDistance += Math.abs(leftList[i] - rightList[i]);
    }

    return totalDistance;
}

// ===== Utilities =====
function processInput(input) {
    const lines = input.trim().split("\n");
    const leftList = [];
    const rightList = [];

    lines.forEach(line => {
        const [left, right] = line.split(/\s+/).map(Number);
        leftList.push(left);
        rightList.push(right);
    });

    return calculateDistance(leftList, rightList);
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
