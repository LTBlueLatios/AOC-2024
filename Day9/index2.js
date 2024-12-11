import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readInput() {
    try {
        const inputPath = path.join(__dirname, "input.txt");
        const inputFile = await fs.promises.readFile(inputPath, "utf-8");
        const checksum = processInput(inputFile);
        console.log(checksum);
    } catch (error) {
        console.error("Error reading input file:", error);
    }
}

function processInput(input) {
    // UwU
    const diskMapNumbers = input
        .trim()
        .split("")
        .map(n => parseInt(n));

    let diskArray = diskMapNumbers.flatMap((num, index) =>
        Array(num).fill(index % 2 === 0 ? index / 2 : -1)
    );

    for (let fileId = Math.ceil(diskMapNumbers.length / 2) - 1; fileId >= 0; fileId--) {
        let fileStartIndex = diskArray.indexOf(fileId);
        let fileLength = consecutiveCount(diskArray, fileStartIndex);
        for (let freeSpaceIndex = 0; freeSpaceIndex < fileStartIndex; freeSpaceIndex++) {
            if (diskArray[freeSpaceIndex] === -1 && consecutiveCount(diskArray, freeSpaceIndex) >= fileLength) {
                diskArray.splice(fileStartIndex, fileLength, ...Array(fileLength).fill(-1));
                diskArray.splice(freeSpaceIndex, fileLength, ...Array(fileLength).fill(fileId));
                break;
            }
        }
    }

    let checksum = diskArray.reduce((sum, fileId, index) => {
        return fileId === -1 ? sum : sum + fileId * index;
    }, 0);

    return checksum;
}

function consecutiveCount(array, startIndex) {
    let count = 1;
    for (let i = startIndex + 1; array[i] === array[startIndex]; i++, count++) { }
    return count;
}

readInput();