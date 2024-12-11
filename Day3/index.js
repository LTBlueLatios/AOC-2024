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
  let match;
  let sum = 0;
  while ((match = mulRegex.exec(input)) !== null) {
    sum += parseInt(match[1]) * parseInt(match[2]);
  }
  return sum;
}

readInput();