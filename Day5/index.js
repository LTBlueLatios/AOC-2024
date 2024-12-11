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

// I'm actually going to touch you
function processInput(input) {
    const [rulesStr, updatesStr] = input.trim().split("\n\n");
    const rules = rulesStr.split("\n").map(parseRule);
    const updates = updatesStr.split("\n").map(parseUpdate);

    let sumOfMiddlePages = 0;
    for (const update of updates) {
        if (isUpdateInOrder(update, rules)) {
            const middlePage = update[Math.floor(update.length / 2)];
            sumOfMiddlePages += middlePage;
        }
    }

    return sumOfMiddlePages;
}

function parseRule(ruleStr) {
    const [before, after] = ruleStr.split("|").map(Number);
    return { before, after };
}

function parseUpdate(updateStr) {
    return updateStr.split(",").map(Number);
}

function isUpdateInOrder(update, rules) {
    for (let i = 0; i < update.length; i++) {
        for (let j = i + 1; j < update.length; j++) {
            const before = update[i];
            const after = update[j];
            if (violatesRule(before, after, rules, update)) {
                return false;
            }
        }
    }
    return true;
}

function violatesRule(before, after, rules, update) {
    for (const rule of rules) {
        if (
            rule.before === after &&
            rule.after === before &&
            update.includes(rule.before) &&
            update.includes(rule.after)
        ) {
            return true;
        }
    }
    return false;
}

readInput();