-- CreateTable
CREATE TABLE "Tax" (
    "id" SERIAL NOT NULL,
    "taxPrice" DOUBLE PRECISION,
    "shippingPrice" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tax_pkey" PRIMARY KEY ("id")
);
