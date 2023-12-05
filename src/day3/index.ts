import { readFileSync } from "node:fs";

function isStringANumber(str: string): boolean {
  return !!(str.length && !isNaN(Number(str)));
}

function isSymbol(char: string): boolean {
  return !!(isNaN(Number(char)) && char !== ".");
}

/**
 * This function is useful for checking the rows above and below a number.
 *
 * @param {string} row - The row/line to check for symbols.
 * @param {number} start - The inclusive starting index.
 * @param {number} end - The exclusive ending index.
 * @returns {boolean} true if a symbol is found. Otherwise false.
 */
function checkRowRangeForSymbol(
  row: string,
  start: number,
  end: number,
): boolean {
  let i = start > -1 ? start : 0;
  while (i < end && i < row.length) {
    const char = row[i];
    if (isSymbol(char)) return true;
    i++;
  }

  return false;
}

function checkRowForNumber(
  row: string,
  pivot: number,
  nums: number[],
): number[] {
  if (!isStringANumber(row[pivot])) {
    return checkSidesForNumber(row, pivot - 1, pivot + 1, nums);
  }

  let window = row[pivot];
  let left = pivot - 1;
  let right = pivot + 1;
  while (left > -1 || right < row.length) {
    const leftChar = row[left];
    const rightChar = row[right];
    if (!isStringANumber(leftChar) && !isStringANumber(rightChar)) break;
    if (isStringANumber(leftChar)) {
      window = leftChar + window;
      left--;
    }
    if (isStringANumber(rightChar)) {
      window += rightChar;
      right++;
    }
  }

  if (isStringANumber(window)) nums.push(parseInt(window));

  return nums;
}

function checkSidesForNumber(
  row: string,
  start: number,
  end: number,
  nums: number[],
): number[] {
  let leftWindow = "";
  while (start > -1 && isStringANumber(row[start])) {
    leftWindow = row[start] + leftWindow;
    start--;
  }

  if (isStringANumber(leftWindow)) nums.push(parseInt(leftWindow));

  let rightWindow = "";
  while (end < row.length && isStringANumber(row[end])) {
    rightWindow += row[end];
    end++;
  }

  if (isStringANumber(rightWindow)) nums.push(parseInt(rightWindow));

  return nums;
}

function checkSidesForSymbol(row: string, start: number, end: number): boolean {
  if (start && isSymbol(row[start - 1])) return true;
  if (end + 1 < row.length && isSymbol(row[end + 1])) return true;
  return false;
}

function main() {
  const input = readFileSync("./src/day3/input.txt", "utf8");
  const lines: string[] = input.split("\n");
  lines.pop();

  let answer = 0;
  for (let i = 0; i < lines.length; i++) {
    const row: string = lines[i];
    for (let col = 0; col < row.length; col++) {
      const char = row[col];
      if (char !== "*") continue;
      const nums: number[] = [];
      if (i) checkRowForNumber(lines[i - 1], col, nums);
      if (i + 1 < lines.length) checkRowForNumber(lines[i + 1], col, nums);
      checkSidesForNumber(row, col - 1, col + 1, nums);

      const total =
        nums.length > 1 ? nums.reduce((prev, curr) => prev * curr, 1) : 0;
      console.log("Row: ", i, "Col:", col, "Total:", total);
      answer += total;
    }
  }

  console.log("Sum of all the part numbers:", answer);
}

main();
