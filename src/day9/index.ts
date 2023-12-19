import { readFileLines } from "../utils/files";

class History {
  public readonly values: number[];

  constructor(values: number[]) {
    this.values = values;
  }
}

function parseHistory(line: string): History {
  return new History(line.split(" ").map(Number));
}

function parseHistories(lines: string[]): History[] {
  const histories: History[] = [];
  for (const line of lines) {
    histories.push(parseHistory(line));
  }
  return histories;
}

function searchStartingHistory(
  history: History,
  histories: History[] = [],
): History[] {
  if (history.values.every((val) => !val)) return histories;

  const diffs = [];

  for (let i = 0; i < history.values.length - 1; i++) {
    const a: number = history.values.at(i) as number;
    const b: number = history.values.at(i + 1) as number;
    diffs.push(b - a);
  }

  const childHistory = new History(diffs);
  histories.push(childHistory);

  return searchStartingHistory(childHistory, histories);
}

function findRightSideExtrapolations(histories: History[]): number {
  (histories.at(-1) as History).values.push(0);

  for (let i = histories.length - 2; i > -1; i--) {
    const prev = histories.at(i + 1) as History;
    const curr = histories.at(i) as History;
    const extrapolation: number =
      (prev.values.at(-1) as number) + (curr.values.at(-1) as number);
    curr.values.push(extrapolation);
  }

  return (histories.at(0) as History).values.at(-1) as number;
}

function findLeftSideExtrapolations(histories: History[]): number {
  (histories.at(-1) as History).values.unshift(0);

  for (let i = histories.length - 2; i > -1; i--) {
    const prev = histories.at(i + 1) as History;
    const curr = histories.at(i) as History;
    const extrapolation: number =
      (curr.values.at(0) as number) - (prev.values.at(0) as number);
    curr.values.unshift(extrapolation);
  }

  return (histories.at(0) as History).values.at(0) as number;
}

function partOne(lines: string[]): number {
  const histories = parseHistories(lines);
  let sum: number = 0;
  for (const history of histories) {
    const historyHierarchy = searchStartingHistory(history, [history]);
    sum += findRightSideExtrapolations(historyHierarchy);
  }
  return sum;
}

function partTwo(lines: string[]): number {
  const histories = parseHistories(lines);
  let sum: number = 0;
  for (const history of histories) {
    const historyHierarchy = searchStartingHistory(history, [history]);
    sum += findLeftSideExtrapolations(historyHierarchy);
  }
  return sum;
}

function main() {
  const lines: string[] = readFileLines("./src/day9/input.txt");
  console.time("Part One");
  console.log("Part One Answer:", partOne(lines));
  console.timeEnd("Part One");

  console.time("Part Two");
  console.log("Part Two Answer:", partTwo(lines));
  console.timeEnd("Part Two");
}

main();
