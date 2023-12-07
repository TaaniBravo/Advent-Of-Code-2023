export function parseNumbers(line: string): string[] {
  const match = line.match(/\d+/g);
  if (match) return match.map((val) => val);
  return [];
}
