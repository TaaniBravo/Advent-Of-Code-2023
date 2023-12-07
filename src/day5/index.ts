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

class Item {
  public readonly range: [number, number];
  public readonly type: Source;

  constructor(type: Source, range: [number, number]) {
    this.range = range;
    this.type = type;
  }
}

function isWithinRange(n: number, start: number, end: number): boolean {
  return n >= start && n < end;
}

function parseDestAndSrcCategory(mapName: string): [string, string] {
  const [destType, , srcType] = mapName.split("-");
  return [destType, srcType];
}

function parseMapName(line: string): string {
  return line.split(" ").at(0) as string;
}

type AlmanacMap = Map<Range, Range>;

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

function main() {
  const lines: string[] = readFileLines("./src/day5/input.txt");

  let seeds: string[] = [];
  const directory: Record<string, AlmanacMap> = {};
  let currentMap: AlmanacMap = new Map();
  let destType: string = "";
  let srcType: string = "";
  let mapName: string = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    if (!i) {
      seeds = parseNumbers(line);
      console.log("Seeds", seeds);
      continue;
    }

    if (!isStringANumber(line[0])) {
      mapName = parseMapName(line);
      [destType, srcType] = parseDestAndSrcCategory(mapName);
      currentMap = new Map<Range, Range>();
      directory[mapName] = currentMap;
    } else {
      const [dest, src, range] = parseNumbers(line).map((val) => parseInt(val));
      currentMap.set([src, src + range], [dest, dest + range]);
    }
  }

  let answer = Number.MAX_SAFE_INTEGER;
  for (const seed of seeds) {
    console.log("Seed:", parseInt(seed));
    let n = parseInt(seed);
    for (let j = 0; j < order.length - 1; j++) {
      const curr = order[j];
      const next = order[j + 1];
      const dirKey = `${curr}-to-${next}`;
      // console.log("Map:", dirKey);
      const map: AlmanacMap = directory[dirKey];
      for (const [key, val] of map) {
        const [start, end] = key;
        if (isWithinRange(n, Number(start), Number(end))) {
          const [vStart] = val;
          const old = n;
          n = n - Number(start) + vStart;
          console.log(`Converting ${dirKey}:`, old, n);
          break;
        }
      }
    }

    console.log("Deciding:", answer, n);
    answer = Math.min(answer, n);
  }

  console.log("Lowest Location:", answer);
}

main();
