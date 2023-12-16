import { readFileLines } from "../utils/files";

const strengths: Map<string, number> = new Map([
  ["5", 6], // Five of a kind
  ["4", 5], // Four of a kind
  ["32", 4], // Full house
  ["3", 3], // Three of a kind
  ["22", 2], // Two pair - this is overwriting four of a kind
  ["2", 1], // One pair
  ["", 0], // High card
]);

const letterCardRank = new Map<string, number>([
  ["A", 14],
  ["K", 13],
  ["Q", 12],
  ["J", 11],
  ["T", 10],
]);

const letterCardRank2 = new Map<string, number>([
  ["A", 14],
  ["K", 13],
  ["Q", 12],
  ["J", 1],
  ["T", 10],
]);

type CardValue = string | number;
type Cards = Record<CardValue, number>;

class Hand {
  public readonly hand: string;
  public readonly cards: Cards;
  public readonly bid: number;
  public readonly strength: number;
  public rank: number = Number.MAX_SAFE_INTEGER;

  constructor(hand: string, cards: Cards, bid: number) {
    this.hand = hand;
    this.cards = cards;
    this.bid = bid;
    this.strength = this.determineHandStrength(this.cards);
  }

  private determineHandStrength(cardCounts: Cards): number {
    let rankKey = "";
    const cardValues = Object.values(cardCounts).sort((a, b) => b - a);
    for (const val of cardValues) {
      if (val > 1) rankKey += val;
    }

    return strengths.get(rankKey) ?? 0;
  }
}

function parseCards(str: string): Cards {
  const cardCounts: Cards = {};
  const cardValues: string[] = str.split("");
  for (const v of cardValues) {
    if (!cardCounts[v]) cardCounts[v] = 1;
    else cardCounts[v]++;
  }

  return cardCounts;
}

function parseCardsPartTwo(str: string): Cards {
  const cardCounts: Cards = {};
  const cardValues: string[] = str.split("");
  let jokerCount = 0;
  let strongestCard: [string, number] = [cardValues[0], 0];

  for (const v of cardValues) {
    if (v === "J") {
      jokerCount++;
      continue;
    }
    if (!cardCounts[v]) cardCounts[v] = 1;
    else cardCounts[v]++;
    if (cardCounts[v] && cardCounts[v] > strongestCard[1]) {
      strongestCard = [v, cardCounts[v]];
    } else if (cardCounts[v] && cardCounts[v] === strongestCard[1]) {
      const strongestCardLetter = determineStrongestCard(v, strongestCard[0]);
      strongestCard = [strongestCardLetter, cardCounts[strongestCardLetter]];
    }
  }

  if (!cardCounts[strongestCard[0]]) cardCounts[strongestCard[0]] = 0;
  cardCounts[strongestCard[0]] += jokerCount;

  return cardCounts;
}

function parseHands(lines: string[], partTwo: boolean = false) {
  return lines.reduce((list: Array<Hand>, line: string) => {
    const [cardsStr, bid] = line.split(" ");
    const cards = !partTwo ? parseCards(cardsStr) : parseCardsPartTwo(cardsStr);
    list.push(new Hand(cardsStr, cards, Number(bid)));
    return list;
  }, []);
}

function determineStrongestCard(a: string, b: string): string {
  const lcr = process.env.PART === "2" ? letterCardRank2 : letterCardRank;
  const aVal = lcr.get(a) ?? Number(a);
  const bVal = lcr.get(b) ?? Number(b);

  if (aVal > bVal) return a;
  if (aVal < bVal) return b;
  return a;
}

function sortByCardRank(a: Hand, b: Hand): number {
  const isPartTwo: boolean = process.env.PART === "2";
  let i: number = 0;
  while (a.hand[i] === b.hand[i]) i++;
  let aVal: any = a.hand[i];
  let bVal: any = b.hand[i];
  if (!isPartTwo) {
    if (!Number(a.hand[i]) && letterCardRank.has(aVal)) { aVal = letterCardRank.get(aVal); }
    if (!Number(b.hand[i]) && letterCardRank.has(bVal)) { bVal = letterCardRank.get(bVal); }
  } else {
    if (!Number(a.hand[i]) && letterCardRank2.has(aVal)) { aVal = letterCardRank2.get(aVal); }
    if (!Number(b.hand[i]) && letterCardRank2.has(bVal)) { bVal = letterCardRank2.get(bVal); }
  }

  return bVal - aVal;
}

function sortHands(a: Hand, b: Hand) {
  if (a.strength === b.strength) {
    return sortByCardRank(a, b);
  }

  return b.strength - a.strength;
}

function partOne(lines: string[]): number {
  console.time("Part One");
  let answer = 0;
  const hands = parseHands(lines);
  hands.sort(sortHands);
  let rank = hands.length;
  for (const hand of hands) {
    answer += rank * hand.bid;
    rank--;
  }

  console.timeEnd("Part One");
  return answer;
}

function partTwo(lines: string[]): number {
  console.time("Part Two");
  let answer = 0;
  const hands = parseHands(lines, true);
  hands.sort(sortHands);
  let rank = hands.length;
  for (const hand of hands) {
    hand.rank = rank;
    answer += hand.rank * hand.bid;
    rank--;
  }

  console.timeEnd("Part Two");
  return answer;
}

function main() {
  const lines: string[] = readFileLines("./src/day7/input.txt");
  console.log("Part 1 Answer:", partOne(lines));
  process.env.PART = "2";
  console.log("Part 2 Answer:", partTwo(lines));
}

main();
