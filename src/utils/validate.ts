export function isStringANumber(str: string): boolean {
  return !!(str.length && !isNaN(Number(str)));
}
