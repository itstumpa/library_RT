/*
  Warnings:

  - You are about to drop the `academic_books` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "inventory_logs" DROP CONSTRAINT "inventory_logs_bookId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_bookId_fkey";

-- DropTable
DROP TABLE "academic_books";

-- CreateTable
CREATE TABLE "book_store" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isbn" TEXT,
    "author" TEXT NOT NULL,
    "publisher" TEXT,
    "edition" TEXT,
    "publicationYear" INTEGER,
    "pages" INTEGER,
    "language" TEXT NOT NULL DEFAULT 'English',
    "price" DOUBLE PRECISION NOT NULL,
    "comparePrice" DOUBLE PRECISION,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "coverImage" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "BookStatus" NOT NULL DEFAULT 'ACTIVE',
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "isLatestEdition" BOOLEAN NOT NULL DEFAULT false,
    "weight" DOUBLE PRECISION,
    "dimensions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "book_store_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "book_store_slug_key" ON "book_store"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "book_store_isbn_key" ON "book_store"("isbn");

-- CreateIndex
CREATE INDEX "book_store_status_idx" ON "book_store"("status");

-- CreateIndex
CREATE INDEX "book_store_isbn_idx" ON "book_store"("isbn");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book_store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_logs" ADD CONSTRAINT "inventory_logs_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book_store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
