/*
  Warnings:

  - You are about to drop the column `sent_at` on the `quotes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "currency" SET DEFAULT 'USD';

-- AlterTable
ALTER TABLE "quotes" DROP COLUMN "sent_at";
