import { readFileLines } from "../utils/files";
import { parseNumbers } from "../utils/parsing";
import { isStringANumber } from "../utils/validate";

type Range = [number, number];

enum Source {
  Seed = "seed",
  Soil = "soil",
  Fertilizer = "fertilizer",
  Water = "water",
  Light = "light",
  Temp = "temperature",
  Humidity = "humidity",
  Location = "location",
}

const order: string[] = [
  "seed",
  "soil",
  "fertilizer",
  "water",
  "light",
  "temperature",
  "humidity",
  "location",
];

const orderReversed = order.toReversed();

function isWithinRange(n: number, start: number, end: number): boolean {
  return n >= start && n < end;
}

function parseDestAndSrcCategory(mapName: string): string[] {
  return mapName.split("-to-");
}

function parseMapName(line: string): string {
  return line.split(" ").at(0) as string;
}

function findSeedInLocationRange(
  n: number,
  almanac: Map<string, number[][]>,
  seedRanges: Range[],
  inverse: boolean = false,
): boolean {
  const steps = inverse ? orderReversed : order;
  for (let j = 0; j < steps.length - 1; j++) {
    const curr = steps[j];
    const next = steps[j + 1];
    const dirKey = `${curr}-to-${next}`;
    const ranges: number[][] = almanac.get(dirKey) as number[][];
    console.log("Ranges:", ranges, "for", dirKey);
    for (const [dest, src, range] of ranges) {
      let start: number;
      let end: number;
      const buffer = inverse ? src : dest;
      if (inverse) {
        start = dest;
        end = dest + range;
      } else {
        start = src;
        end = src + range;
      }
      if (isWithinRange(n, start, end)) {
        n = n - start + buffer;
        if (next === Source.Seed) {
          for (const [start, end] of seedRanges) {
            if (isWithinRange(n, start, end)) {
              console.log("Seed Found:", n);
              return true;
            }
          }
        }
        break;
      }
    }
  }

  return false;
}

function getSeedRanges(seeds: number[]): Range[] {
  const ranges: Range[] = [];

  for (let i = 0; i < seeds.length; i += 2) {
    const start = seeds[i];
    const range = seeds[i + 1];
    const end = start + range;
    ranges.push([start, end]);
  }

  return ranges;
}

function parseLinesForAlmanacAndSeeds(
  lines: string[],
  inverse: boolean = false,
): [Map<string, number[][]>, string[]] {
  let seeds: string[] = [];
  const almanac: Map<string, number[][]> = new Map();
  let destType: string = "";
  let srcType: string = "";
  let mapName: string = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    if (!i) {
      seeds = parseNumbers(line);
      continue;
    }

    if (!isStringANumber(line[0])) {
      mapName = parseMapName(line);
      [destType, srcType] = parseDestAndSrcCategory(mapName);
      if (inverse) mapName = `${srcType}-to-${destType}`;
      almanac.set(mapName, []);
    } else {
      const mapRange = parseNumbers(line).map(Number);
      almanac.get(mapName)?.push(mapRange);
    }
  }

  console.log("Almanac:", almanac);
  return [almanac, seeds];
}

function main() {
  console.time("Time");
  const lines: string[] = readFileLines("./src/day5/demo.txt");
  const [almanac, seeds] = parseLinesForAlmanacAndSeeds(lines, true);
  const seedRanges = getSeedRanges(seeds.map(Number));
  let answer: Number = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < 100; i++) {
    if (findSeedInLocationRange(i, almanac, seedRanges, true)) {
      answer = i;
      break;
    }
  }
  console.log("Lowest Location:", answer);
  console.timeEnd("Time");
}

main();
