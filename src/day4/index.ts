import { readFileLines } from "../utils/files";
import { parseNumbers } from "../utils/parsing";

class Card {
  public readonly id: number;
  public readonly winningNums: Set<string>;
  public readonly playingNums: string[];
  public score: number = 0;
  public copiesCreated: number = 0;

  constructor(
    id: number,
    winningNums: Set<string> = new Set(),
    playingNums: string[] = [],
  ) {
    this.id = id;
    this.winningNums = winningNums;
    this.playingNums = playingNums;
    this.calculateScore();
  }

  set setScore(score: number) {
    this.score = score;
  }

  private calculateScore(): number {
    for (let i = 0; i < this.playingNums.length; i++) {
      const n = this.playingNums[i];
      if (!this.winningNums.has(n)) continue;
      this.score += 1;
    }

    return this.score;
  }
}

function parseWinningNumbers(line: string): Set<string> {
  return new Set(parseNumbers(line));
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

function calcCardCopies(
  card: Card,
  map: Record<number, Card>,
  memo: Record<number, number> = {},
): number {
  if (!card.score) return 1;
  if (memo[card.id]) return memo[card.id];
  let total = 1;

  for (let i = 1; i <= card.score; i++) {
    const id = card.id + i;
    const nextCard = map[id];
    if (nextCard) total += calcCardCopies(nextCard, map, memo);
  }

  memo[card.id] = total;
  return total;
}

function main() {
  const lines = readFileLines("./src/day4/input.txt");

  let totalCards = 0;
  const cardMap: Record<number, Card> = {};
  for (let i = lines.length - 1; i > -1; i--) {
    const card = parseCard(lines[i]);
    cardMap[card.id] = card;
  }

  const memo: Record<number, number> = {};
  for (const card of Object.values(cardMap)) {
    totalCards += calcCardCopies(card, cardMap, memo);
  }

  console.log("Total Cards:", totalCards);
}

main();
