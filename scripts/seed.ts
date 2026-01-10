import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});

async function main() {
  // 1️⃣ Create category
  const library = await prisma.category.create({
    data: {
      name: "Library",
      slug: "library",
    },
  });

  // 2️⃣ Create sub-category
  const academic = await prisma.subCategory.create({
    data: {
      name: "Academic Book Store",
      slug: "academic-book-store",
      categoryId: library.id,
    },
  });

  // 3️⃣ Create product
  const product = await prisma.product.create({
    data: {
      name: "Academic Books",
      slug: "academic-books",
      price: 550,
      categoryId: library.id,
      subCategoryId: academic.id,
    },
  });

  // 4️⃣ Fetch everything with relations
  const result = await prisma.product.findMany({
    include: {
      category: true,
      subCategory: true,
    },
  });

  console.log(result);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
