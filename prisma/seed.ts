import { parameters } from "../data/parameters";
import { factors } from "../data/factors";
import { categories } from "../data/categories";
import { languages } from "../data/languages";
import { countries } from "../data/countries";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // await prisma.category.createMany({
  //   data: categories,
  //   skipDuplicates: true, // Skip 'Bobo'
  // });
  // const allCategories = await prisma.category.findMany();
  // console.dir(allCategories, { depth: null });
  // await prisma.factor.createMany({
  //   data: factors,
  //   skipDuplicates: true, // Skip 'Bobo'
  // });
  // const allFactors = await prisma.factor.findMany();
  // console.dir(allFactors, { depth: null });
  // await prisma.parameter.createMany({
  //   data: parameters,
  //   skipDuplicates: true, // Skip 'Bobo'
  // });
  // const allParameters = await prisma.parameter.findMany();
  // console.dir(allParameters, { depth: null });
  // await prisma.language.createMany({
  //   data: languages,
  //   skipDuplicates: true, // Skip 'Bobo'
  // });
  // const allLanguages = await prisma.language.findMany();
  // console.dir(allLanguages, { depth: null });
  // await prisma.country.createMany({
  //   data: countries,
  // });
  // const allCountries = await prisma.country.findMany();
  // console.dir(allCountries, { depth: null });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
