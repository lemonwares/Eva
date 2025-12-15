/*
  Warnings:

  - You are about to drop the column `max_price` on the `listings` table. All the data in the column will be lost.
  - You are about to drop the column `min_price` on the `listings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "listings" DROP COLUMN "max_price",
DROP COLUMN "min_price",
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "time_estimate" TEXT;
