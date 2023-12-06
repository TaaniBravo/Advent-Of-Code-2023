import { readFileSync } from "node:fs";

export function readFileLines(filePath: string): string[] {
  const lines = readFileSync(filePath, "utf-8").split("\n");
  lines.pop();
  return lines;
}
