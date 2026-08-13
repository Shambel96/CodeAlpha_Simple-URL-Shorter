import { prisma } from "../lib/prisma.js";
import { generateCode } from "../utils/generateCode.js";

export async function createShortUrl(originalUrl: string) {
  let code: string;

  do {
    code = generateCode();
  } while (
    await prisma.url.findUnique({
      where: {
        code,
      },
    })
  );

  return prisma.url.create({
    data: {
      code,
      originalUrl,
    },
  });
}

export async function findUrlByCode(code: string) {
  return prisma.url.findUnique({
    where: {
      code,
    },
  });
}

export async function incrementClicks(id: number) {
  return prisma.url.update({
    where: {
      id,
    },
    data: {
      clicks: {
        increment: 1,
      },
    },
  });
}
