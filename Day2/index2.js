import fs from 'fs';

const input = fs.readFileSync('Day2/input.txt', 'utf8');
const reports = input.trim().split('\n');

let safeCount = 0;

function isSafe(levels) {
    let increasing = true;
    let decreasing = true;
    let valid = true;

    for (let i = 0; i < levels.length - 1; i++) {
        const diff = levels[i + 1] - levels[i];
        if (diff > 0) {
            decreasing = false;
        } else if (diff < 0) {
            increasing = false;
        }

        if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
            valid = false;
            break;
        }
    }

    return valid && (increasing || decreasing);
}

for (const report of reports) {
    const levels = report.split(' ').map(Number);

    if (isSafe(levels)) {
        safeCount++;
    } else {
        let dampenerSafe = false;
        for (let i = 0; i < levels.length; i++) {
            const tempLevels = [...levels];
            tempLevels.splice(i, 1);
            if (isSafe(tempLevels)) {
                dampenerSafe = true;
                break;
            }
        }
        if (dampenerSafe) {
            safeCount++;
        }
    }
}

console.log(safeCount);