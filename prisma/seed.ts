import { parameters } from "../data/parameters";
import { factors } from "../data/factors";
import { categories } from "../data/categories";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true, // Skip 'Bobo'
  });

  // await prisma.factor.createMany({
  //   data: factors,
  //   skipDuplicates: true, // Skip 'Bobo'
  // });

  // const allFactors = await prisma.factor.findMany();
  // console.dir(allFactors, { depth: null });

  const allCategories = await prisma.category.findMany();
  console.dir(allCategories, { depth: null });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
