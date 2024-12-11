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
    const diskMap = parseDiskMap(input);
    const compactedDisk = compactDisk(diskMap);
    const checksum = calculateChecksum(compactedDisk);
    return checksum;
}

// What in the actual good lord fuck is this.
function parseDiskMap(input) {
    const diskMap = [];
    let fileId = 0;
    for (let i = 0; i < input.length; i += 2) {
        const fileLength = parseInt(input[i]);
        const freeSpaceLength = parseInt(input[i + 1]);
        diskMap.push({ fileId, length: fileLength });
        if (!isNaN(freeSpaceLength)) {
            diskMap.push({ fileId: -1, length: freeSpaceLength });
        }
        fileId++;
    }
    return diskMap;
}

function compactDisk(diskMap) {
    let disk = [];
    let fileIdMap = new Map();

    for (const segment of diskMap) {
        if (segment.fileId === -1) {
            for (let i = 0; i < segment.length; i++) {
                disk.push(-1);
            }
        } else {
            fileIdMap.set(segment.fileId, segment.length);
            for (let i = 0; i < segment.length; i++) {
                disk.push(segment.fileId);
            }
        }
    }

    while (true) {
        let moved = false;
        let firstFreeSpace = -1;
        for (let i = 0; i < disk.length; i++) {
            if (disk[i] === -1) {
                if (firstFreeSpace === -1) {
                    firstFreeSpace = i;
                }
            } else {
                if (firstFreeSpace !== -1) {
                    let lastFileIndex = -1;
                    for (let j = disk.length - 1; j > i; j--) {
                        if (disk[j] !== -1) {
                            lastFileIndex = j;
                            break;
                        }
                    }
                    if(lastFileIndex !== -1){
                      disk[firstFreeSpace] = disk[lastFileIndex];
                      disk[lastFileIndex] = -1;
                      moved = true;
                      break;
                    }
                }
            }
        }
        if (!moved) {
            break;
        }
    }

    return disk;
}

function calculateChecksum(disk) {
    let checksum = 0;
    for (let i = 0; i < disk.length; i++) {
        if (disk[i] !== -1) {
            checksum += i * disk[i];
        }
    }
    return checksum;
}

readInput();