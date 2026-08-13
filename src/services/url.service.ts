import { prisma } from "../lib/prisma.js";
import { generateCode } from "../utils/generateCode.js";

async function generateUniqueCode(): Promise<string> {
  while (true) {
    const code = generateCode();

    const existingUrl = await prisma.url.findUnique({
      where: {
        code,
      },
    });

    if (!existingUrl) {
      return code;
    }
  }
}

export async function createShortUrl(originalUrl: string) {
  const code = await generateUniqueCode();

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
