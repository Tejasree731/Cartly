-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('COMPLETED', 'CANCELLED', 'REFUNDED');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "leadTimeDays" INTEGER NOT NULL DEFAULT 3;

-- CreateTable
CREATE TABLE "sales" (
    "id" SERIAL NOT NULL,
    "invoiceNumber" VARCHAR(50) NOT NULL,
    "status" "SaleStatus" NOT NULL DEFAULT 'COMPLETED',
    "total" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_items" (
    "id" SERIAL NOT NULL,
    "saleId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "sale_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sales_invoiceNumber_key" ON "sales"("invoiceNumber");

-- CreateIndex
CREATE INDEX "sales_status_createdAt_idx" ON "sales"("status", "createdAt");

-- CreateIndex
CREATE INDEX "sale_items_productId_idx" ON "sale_items"("productId");

-- AddForeignKey
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
