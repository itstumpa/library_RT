-- AlterTable
ALTER TABLE "inventory_logs" ADD COLUMN     "stationaryId" TEXT;

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "stationaryId" TEXT;

-- CreateTable
CREATE TABLE "stationery_store" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sku" TEXT,
    "brand" TEXT,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "comparePrice" DOUBLE PRECISION,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "coverImage" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "BookStatus" NOT NULL DEFAULT 'ACTIVE',
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
    "weight" DOUBLE PRECISION,
    "dimensions" TEXT,
    "color" TEXT,
    "material" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stationery_store_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stationery_store_slug_key" ON "stationery_store"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "stationery_store_sku_key" ON "stationery_store"("sku");

-- CreateIndex
CREATE INDEX "stationery_store_status_idx" ON "stationery_store"("status");

-- CreateIndex
CREATE INDEX "stationery_store_category_idx" ON "stationery_store"("category");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_stationaryId_fkey" FOREIGN KEY ("stationaryId") REFERENCES "stationery_store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_logs" ADD CONSTRAINT "inventory_logs_stationaryId_fkey" FOREIGN KEY ("stationaryId") REFERENCES "stationery_store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
