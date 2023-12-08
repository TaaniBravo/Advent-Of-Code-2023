import { readFileLines } from "../utils/files";
import { parseNumbers } from "../utils/parsing";

function determineAllOptions(time: number, record: number): number {
  let options: number = 0;
  for (let speed = 0; speed < time; speed++) {
    const timeLeft = time - speed;
    const distance = speed * timeLeft;
    if (distance > record) options++;
  }

  return options;
}

function partOne(lines: string[]): void {
  console.time("Time");
  const times = parseNumbers(lines[0]).map(Number);
  const distances = parseNumbers(lines[1]).map(Number);

  let answer: number = 1;
  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const distance = distances[i];
    answer *= determineAllOptions(time, distance);
  }

  console.log("Number of ways to win in Part 1:", answer);
  console.timeEnd("Time");
}

function partTwo(lines: string[]): void {
  console.time("Time");
  const times = Number(parseNumbers(lines[0]).join(""));
  const distances = Number(parseNumbers(lines[1]).join(""));
  const answer = determineAllOptions(times, distances);
  console.log("Number of ways to win in Part 2:", answer);
  console.timeEnd("Time");
}

function main() {
  const lines: string[] = readFileLines("./src/day6/input.txt");
  partOne(lines);
  partTwo(lines);
}

main();
