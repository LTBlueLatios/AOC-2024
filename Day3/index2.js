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
    const mulRegex = /mul\((\d{1,3}),(\d{1,3})\)/g;
    const doDontRegex = /(do|don't)\(\)/g;
    let match;
    let sum = 0;
    let enabled = true;
    let lastDoDontIndex = -1;

    const doDontMatches = [];
    while ((match = doDontRegex.exec(input)) !== null) {
        doDontMatches.push({
            type: match[1],
            index: match.index,
        });
    }

    while ((match = mulRegex.exec(input)) !== null) {
        enabled = true;
        lastDoDontIndex = -1;

        for (let i = doDontMatches.length - 1; i >= 0; i--) {
            if (doDontMatches[i].index < match.index) {
                lastDoDontIndex = i;
                break;
            }
        }

        if (lastDoDontIndex !== -1) {
            enabled = doDontMatches[lastDoDontIndex].type === "do";
        }

        if (enabled) {
            sum += parseInt(match[1]) * parseInt(match[2]);
        }
    }
    return sum;
}

readInput();