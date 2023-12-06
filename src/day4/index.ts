import { readFileLines } from "../utils/files";

class Card {
  public readonly id: number;
  public readonly winningNums: Set<string>;
  public readonly playingNums: string[];

  constructor(
    id: number,
    winningNums: Set<string> = new Set(),
    playingNums: string[] = [],
  ) {
    this.id = id;
    this.winningNums = winningNums;
    this.playingNums = playingNums;
  }
}

function parseWinningNumbers(line: string): Set<string> {
  return new Set(parseNumbers(line));
}

function parseNumbers(line: string): string[] {
  const match = line.match(/\d+/g);
  if (match) return match.map((val) => val);
  return [];
}

function parseId(line: string): number {
  const match = line.match(/\d+/);
  if (match) return Number(match?.at(0));
  return NaN;
}

function parseCard(line: string): Card {
  const [info, nums] = line.split("|");
  const [card, winningNumsStr] = info.split(":");
  const id = parseId(card);
  const winningNums: Set<string> = parseWinningNumbers(winningNumsStr);
  const playingNums = parseNumbers(nums);
  return new Card(id, winningNums, playingNums);
}

function calculateScore(card: Card): number {
  let score = 0;
  for (let i = 0; i < card.playingNums.length; i++) {
    const n = card.playingNums[i];
    if (!card.winningNums.has(n)) continue;
    if (!score) score = 1;
    else score *= 2;
  }

  return score;
}

function main() {
  const lines = readFileLines("./src/day4/input.txt");

  let totalScore = 0;
  for (let i = 0; i < lines.length; i++) {
    const card = parseCard(lines[i]);
    const score = calculateScore(card);

    console.log(`Card ${card.id} Score:`, score);
    totalScore += score;
  }

  console.log("Total Score:", totalScore);
}

main();
