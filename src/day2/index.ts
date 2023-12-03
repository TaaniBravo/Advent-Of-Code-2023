import { readFileSync } from "node:fs";

type GameSet = {
  red: number;
  green: number;
  blue: number;
};

type Game = {
  id: number;
  gameSets: GameSet[];
  isValid: boolean;
  mins: GameSet;
};

enum ColorLimit {
  Red = 12,
  Green = 13,
  Blue = 14,
}

function getId(str: string): number {
  const [, id]: string[] = str.split(" ");
  return parseInt(id.substring(0, id.length - 1));
}

function getGameSet(sets: string[]): GameSet {
  const gameSet: GameSet = {
    red: 0,
    blue: 0,
    green: 0,
  };
  for (let i = 0; i < sets.length; i++) {
    const [score, color] = sets[i].trim().split(" ");
    gameSet[color as keyof GameSet] = parseInt(score);
  }

  return gameSet;
}

function parseGameSets(str: string, gameSets: GameSet[] = []) {
  const sets: string[] = str.split(":").at(1)?.split(";") ?? [];

  for (let i = 0; i < sets.length; i++) {
    const set = sets[i];
    const colors = set.split(",");
    const gameSet = getGameSet(colors);
    gameSets.push(gameSet);
  }

  return gameSets;
}

function checkGameSetsAreValid(gameSets: GameSet[]) {
  for (let i = 0; i < gameSets.length; i++) {
    const gameSet = gameSets[i];
    if (
      gameSet.red > ColorLimit.Red ||
      gameSet.blue > ColorLimit.Blue ||
      gameSet.green > ColorLimit.Green
    ) {
      return false;
    }
  }

  return true;
}

function getGameMins(gameSets: GameSet[], mins: GameSet): void {
  for (let i = 0; i < gameSets.length; i++) {
    const gameSet = gameSets[i];

    if (gameSet.red > mins.red) mins.red = gameSet.red;
    if (gameSet.blue > mins.blue) mins.blue = gameSet.blue;
    if (gameSet.green > mins.green) mins.green = gameSet.green;
  }
}

function parseGame(str: string): Game {
  const game: Game = {
    id: getId(str),
    gameSets: parseGameSets(str),
    isValid: false,
    mins: {
      red: 0,
      blue: 0,
      green: 0,
    },
  };

  game.isValid = checkGameSetsAreValid(game.gameSets);
  getGameMins(game.gameSets, game.mins);

  return game;
}

function main() {
  const input = readFileSync("./src/day2/input.txt", "utf8");
  const lines: string[] = input.split("\n");
  lines.pop();

  let total = 0;
  let mins = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const game = parseGame(line);

    mins += game.mins.red * game.mins.blue * game.mins.green;

    if (game.isValid) {
      total += game.id;
    }
  }

  console.log("Total:", total);
  console.log("Mins Total:", mins);
}

main();
