import { readFileSync } from "node:fs";

const numMap: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

function findCalibration(str: string): number {
  let left = 0;
  let right = str.length - 1;
  let first = "0";
  let last = "0";

  while (left <= right) {
    if (first !== "0" && last !== "0") break;
    const leftChar = str[left];
    if (Number(leftChar)) {
      first = leftChar;
    } else if (first === "0") {
      left++;
    }

    const rightChar = str[right];
    if (Number(rightChar)) {
      last = rightChar;
    } else if (last === "0") {
      right--;
    }
  }

  return parseInt(first + last);
}

function replaceWords(str: string): string {
  for (const [key, value] of Object.entries(numMap)) {
    str = str.replaceAll(key, `${key}${value}${key}`);
  }

  return str;
}

function main() {
  const input: string = readFileSync("./src/day1/input.txt", "utf8");
  const lines: string[] = input.split("\n");
  let sum: number = 0;

  for (let i = 0; i < lines.length; i++) {
    const line: string = lines[i];
    const updated: string = replaceWords(line);
    const calibration: number = findCalibration(updated);
    sum += calibration;
  }

  console.log("Calibration: ", sum); // Answer for part 2 is 55413
}

main();
