import { readFileSync, appendFileSync } from "node:fs";

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

function checkSidesForSymbol(row: string, start: number, end: number): boolean {
  if (start && isSymbol(row[start - 1])) return true;
  if (end + 1 < row.length && isSymbol(row[end + 1])) return true;
  return false;
}

function main() {
  const input = readFileSync("./src/day3/demo.txt", "utf8");
  const lines: string[] = input.split("\n");
  lines.pop();

  let answer = 0;
  for (let i = 0; i < lines.length; i++) {
    const row: string = lines[i];
    let window: string = "";
    let windowStart: number = 0;
    let rowSum = 0;
    for (let col = 0; col < row.length; col++) {
      window += row[col];
      while (!isStringANumber(window) && windowStart <= col) {
        window = window.substring(1);
        windowStart++;
      }

      if (!isStringANumber(window)) continue;
      if (col + 1 < row.length && isStringANumber(row[col + 1])) continue;

      let symbolFound: boolean = checkSidesForSymbol(row, windowStart, col);
      if (i && !symbolFound) {
        symbolFound = checkRowRangeForSymbol(
          lines[i - 1], // row above
          windowStart - 1,
          col + 2,
        );
      }
      if (i + 1 < lines.length && !symbolFound) {
        symbolFound = checkRowRangeForSymbol(
          lines[i + 1], // row below
          windowStart - 1,
          col + 2,
        );
      }

      if (symbolFound) {
        appendFileSync(
          "./src/day3/output2.txt",
          `Symbol found for: ${window}\n`,
        );
        // console.log("Symbol found for:", window, windowStart, col);
        answer += parseInt(window);
        rowSum += parseInt(window);
      }

      window = "";
      windowStart = col;
    }
    appendFileSync("./src/day3/output2.txt", `Row Sum [${i + 1}]: ${rowSum}\n`);
    console.log(`Row Sum [${i + 1}]: ${rowSum}`);
  }

  console.log(`Sum of all the part numbers: ${answer}`);
}

main();
