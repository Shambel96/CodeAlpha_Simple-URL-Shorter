import { randomInt } from "node:crypto";

const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function generateCode(length = 6): string {
  let result = "";

  for (let i = 0; i < length; i++) {
    const index = randomInt(CHARACTERS.length);

    result += CHARACTERS[index];
  }

  return result;
}
