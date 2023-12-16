import { readFileLines } from "../utils/files";

class Node {
  public readonly name: string;
  public readonly left: string;
  public readonly right: string;

  constructor(name: string, left: string, right: string) {
    this.name = name;
    this.left = left;
    this.right = right;
  }
}

type NodeMap = Map<string, Node>;

function parseNode(line: string): Node {
  const matches = line.match(/\w+/g);
  if (!matches) {
    throw new Error(
      `Why was there no matches?\nline: ${line}\nmatches: ${matches}`,
    );
  }

  const [curr, left, right] = matches;
  return new Node(curr, left, right);
}

function parseInput(lines: string[]): [string, any] {
  let directions: string = "";
  const nodes: NodeMap = new Map();
  for (let i = 0; i < lines.length; i++) {
    const line: string = lines[i];
    if (!i) {
      directions = line;
      continue;
    } else if (!line) {
      continue;
    }

    // logic for nodes
    const node: Node = parseNode(line);
    if (!nodes.has(node.name)) nodes.set(node.name, node);
  }

  return [directions, nodes];
}

function walk(
  curr: string,
  end: string,
  directions: string,
  nodes: NodeMap,
  steps: number = 0,
): number {
  if (curr.endsWith(end)) {
    return steps;
  }

  for (const dir of directions) {
    const node = nodes.get(curr) as Node;
    if (dir === "L") {
      curr = node.left;
    } else {
      curr = node.right;
    }
    steps++;
  }

  if (!curr.endsWith(end)) {
    return walk(curr, end, directions, nodes, steps);
  }

  return steps;
}

function findPointsEndingWith(end: string, nodes: NodeMap): string[] {
  const startingPoints: string[] = [];
  for (const [name] of nodes) {
    if (name.endsWith(end)) {
      startingPoints.push(name);
    }
  }
  return startingPoints;
}

function gcd(a: number, b: number): number {
  while (b != 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

function lcmOfList(numbers: number[]): number {
  let currentLcm = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    currentLcm = lcm(currentLcm, numbers[i]);
  }
  return currentLcm;
}

function partOne(lines: string[]): number {
  const [directions, nodes] = parseInput(lines);
  return walk("AAA", "Z", directions, nodes);
}

function partTwo(lines: string[]): number {
  const [directions, nodes] = parseInput(lines);
  const startingPoints = findPointsEndingWith("A", nodes);

  const pathsToZ = startingPoints.map((sp) => {
    return walk(sp, "Z", directions, nodes);
  });

  return lcmOfList(pathsToZ);
}

function main() {
  const lines: string[] = readFileLines("./src/day8/input.txt");
  console.time("Part One");
  console.log("Part One Answer:", partOne(lines));
  console.timeEnd("Part One");

  console.time("Part Two");
  console.log("Part Two Answer:", partTwo(lines));
  console.timeEnd("Part Two");
}

main();
