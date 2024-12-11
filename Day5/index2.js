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
    const [rulesStr, updatesStr] = input.trim().split("\n\n");
    const rules = rulesStr.split("\n").map(parseRule);
    const updates = updatesStr.split("\n").map(parseUpdate);

    let sumOfMiddlePages = 0;
    for (const update of updates) {
        if (!isUpdateInOrder(update, rules)) {
            const sortedUpdate = sortUpdate(update, rules);
            const middlePage = sortedUpdate[Math.floor(sortedUpdate.length / 2)];
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

function sortUpdate(update, rules) {
    const sortedUpdate = [...update];
    let changed = true;
    while (changed) {
        // nested 1
        changed = false;
        for (let i = 0; i < sortedUpdate.length - 1; i++) {
            // nested 2
            for (let j = i + 1; j < sortedUpdate.length; j++) {
                // nested 3
                // staggering 4 loops
                // go keep yourself safe
                if (violatesRule(sortedUpdate[i], sortedUpdate[j], rules, sortedUpdate)) {
                    [sortedUpdate[i], sortedUpdate[j]] = [sortedUpdate[j], sortedUpdate[i]];
                    changed = true;
                }
            }
        }
    }
    return sortedUpdate;
}

readInput();