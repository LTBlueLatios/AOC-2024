import fs from 'fs';

const input = fs.readFileSync('Day2/input.txt', 'utf8');
const reports = input.trim().split('\n');

let safeCount = 0;

for (const report of reports) {
    const levels = report.split(' ').map(Number);
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

    if (valid && (increasing || decreasing)) {
        safeCount++;
    }
}

console.log(safeCount);