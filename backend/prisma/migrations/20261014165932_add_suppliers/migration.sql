-- CreateTable
CREATE TABLE "suppliers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_email_key" ON "suppliers"("email");

-- CreateIndex
CREATE INDEX "suppliers_name_idx" ON "suppliers"("name");

-- CreateIndex
CREATE INDEX "suppliers_isActive_idx" ON "suppliers"("isActive");
