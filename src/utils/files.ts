import { readFileSync } from "node:fs";

export function readFileLines(
  filePath: string,
  split: string = "\n",
): string[] {
  const lines = readFileSync(filePath, "utf-8").split(split);
  lines.pop();
  return lines;
}
